"""
Opportunities Service — Placement Hub
Business logic for opportunity retrieval, deduplication, state tracking,
relevance matching against confirmed student profile, and manual import workflows.
"""

from __future__ import annotations

import datetime
import hashlib
import logging
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.models import (
    Student,
    OpportunityRecord,
    SavedOpportunityRecord,
    OpportunityUserPreference,
)
from .schemas import (
    OpportunityItem,
    OpportunityFilterParams,
    SavedOpportunityItem,
    SaveOpportunityRequest,
    UpdateApplicationStatusRequest,
    ManualImportOpportunityRequest,
    OpportunityUserPreferenceSchema,
    OpportunityMatchEvaluation,
    ProviderAuditReport,
)
from .phase0_audit import PROVIDER_AUDIT_DATA
from .connectors import (
    registry,
    compute_url_hash,
    compute_opportunity_status,
    check_is_stale,
)

logger = logging.getLogger("integrations.opportunities.service")


class OpportunitiesService:
    def __init__(self):
        self._synced_default_records = False

    def sync_connectors_to_db(self, db: Session) -> int:
        """
        Polls registered connectors, normalizes records, computes canonical hashes,
        and saves/updates database records without fabricating or duplicating.
        """
        import asyncio

        total_synced = 0
        connectors = registry.list_connectors()

        for conn in connectors:
            try:
                # Synchronous invocation of connector fetch
                try:
                    loop = asyncio.get_event_loop()
                except RuntimeError:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)

                if loop.is_running():
                    import concurrent.futures
                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                        items = pool.submit(asyncio.run, conn.fetch_opportunities()).result()
                else:
                    items = loop.run_until_complete(conn.fetch_opportunities())

                for item in items:
                    url_hash = item.canonical_url_hash or compute_url_hash(item.source_url)
                    existing = (
                        db.query(OpportunityRecord)
                        .filter(
                            (OpportunityRecord.id == item.id)
                            | (OpportunityRecord.canonical_url_hash == url_hash)
                        )
                        .first()
                    )

                    status = compute_opportunity_status(item.deadline, item.last_verified_at)
                    is_stale = check_is_stale(item.last_verified_at)

                    if not existing:
                        rec = OpportunityRecord(
                            id=item.id,
                            source_id=item.source_id,
                            provider=item.provider,
                            provenance_type=item.provenance_type,
                            title=item.title,
                            company_or_organizer=item.company_or_organizer,
                            category=item.category,
                            source_url=item.source_url,
                            application_url=item.application_url,
                            location=item.location,
                            remote_status=item.remote_status,
                            compensation_type=item.compensation_type,
                            compensation_amount=item.compensation_amount,
                            eligibility=item.eligibility or {},
                            experience_requirements=item.experience_requirements,
                            skills=item.skills or [],
                            deadline=item.deadline,
                            deadline_timezone=item.deadline_timezone,
                            status=status,
                            is_stale=is_stale,
                            last_verified_at=item.last_verified_at,
                            retrieved_at=item.retrieved_at or datetime.datetime.utcnow(),
                            description=item.description,
                            canonical_url_hash=url_hash,
                            raw_metadata=item.raw_metadata or {},
                        )
                        db.add(rec)
                        total_synced += 1
                    else:
                        # Update status, deadline, and verification without destroying existing references
                        existing.status = status
                        existing.is_stale = is_stale
                        existing.last_verified_at = item.last_verified_at or existing.last_verified_at
                        if item.deadline:
                            existing.deadline = item.deadline
                        existing.updated_at = datetime.datetime.utcnow()

                db.commit()
            except Exception as e:
                logger.error(f"Error syncing connector {conn.provider_slug}: {e}")
                db.rollback()

        self._synced_default_records = True
        return total_synced

    def _ensure_initialized(self, db: Session):
        if not self._synced_default_records:
            count = db.query(OpportunityRecord).count()
            if count == 0:
                self.sync_connectors_to_db(db)
            else:
                self._synced_default_records = True

    def search_opportunities(
        self,
        filters: OpportunityFilterParams,
        db: Session
    ) -> Tuple[List[OpportunityItem], int]:
        """Queries opportunities with multi-faceted filtering, sorting, and pagination."""
        self._ensure_initialized(db)

        query = db.query(OpportunityRecord)

        # 1. Category Filter
        if filters.category and filters.category != "all":
            query = query.filter(OpportunityRecord.category == filters.category.lower())

        # 2. Provider Filter
        if filters.provider and filters.provider != "all":
            query = query.filter(OpportunityRecord.provider == filters.provider.lower())

        # 3. Status Filter (open / closing_soon / closed)
        if filters.status and filters.status != "all":
            query = query.filter(OpportunityRecord.status == filters.status.lower())

        # 4. Remote Status
        if filters.remote_status and filters.remote_status != "all":
            query = query.filter(OpportunityRecord.remote_status == filters.remote_status.lower())

        # 5. Compensation Type
        if filters.compensation_type and filters.compensation_type != "all":
            query = query.filter(OpportunityRecord.compensation_type == filters.compensation_type.lower())

        # 6. Text Search (title, company, skills, description)
        if filters.query:
            term = f"%{filters.query.lower()}%"
            query = query.filter(
                OpportunityRecord.title.ilike(term)
                | OpportunityRecord.company_or_organizer.ilike(term)
                | OpportunityRecord.description.ilike(term)
                | OpportunityRecord.location.ilike(term)
            )

        total_count = query.count()

        # Sort: closing_soon first, then open, then by deadline
        records = query.order_by(
            OpportunityRecord.status.desc(),
            OpportunityRecord.deadline.asc(),
            OpportunityRecord.created_at.desc()
        ).offset(filters.offset).limit(filters.limit).all()

        items = []
        now = datetime.datetime.now(datetime.timezone.utc)
        for r in records:
            # Recheck status in real-time
            status = compute_opportunity_status(r.deadline, r.last_verified_at)
            is_stale = check_is_stale(r.last_verified_at)

            items.append(OpportunityItem(
                id=r.id,
                source_id=r.source_id,
                provider=r.provider,
                provenance_type=r.provenance_type,
                title=r.title,
                company_or_organizer=r.company_or_organizer,
                category=r.category,
                source_url=r.source_url,
                application_url=r.application_url,
                location=r.location,
                remote_status=r.remote_status,
                compensation_type=r.compensation_type,
                compensation_amount=r.compensation_amount,
                eligibility=r.eligibility or {},
                experience_requirements=r.experience_requirements,
                skills=r.skills or [],
                deadline=r.deadline,
                deadline_timezone=r.deadline_timezone,
                status=status,
                is_stale=is_stale,
                last_verified_at=r.last_verified_at,
                retrieved_at=r.retrieved_at,
                description=r.description,
                canonical_url_hash=r.canonical_url_hash,
                raw_metadata=r.raw_metadata or {}
            ))

        return items, total_count

    def get_opportunity_by_id(self, opp_id: str, db: Session) -> Optional[OpportunityItem]:
        self._ensure_initialized(db)
        r = db.query(OpportunityRecord).filter(OpportunityRecord.id == opp_id).first()
        if not r:
            return None

        status = compute_opportunity_status(r.deadline, r.last_verified_at)
        is_stale = check_is_stale(r.last_verified_at)

        return OpportunityItem(
            id=r.id,
            source_id=r.source_id,
            provider=r.provider,
            provenance_type=r.provenance_type,
            title=r.title,
            company_or_organizer=r.company_or_organizer,
            category=r.category,
            source_url=r.source_url,
            application_url=r.application_url,
            location=r.location,
            remote_status=r.remote_status,
            compensation_type=r.compensation_type,
            compensation_amount=r.compensation_amount,
            eligibility=r.eligibility or {},
            experience_requirements=r.experience_requirements,
            skills=r.skills or [],
            deadline=r.deadline,
            deadline_timezone=r.deadline_timezone,
            status=status,
            is_stale=is_stale,
            last_verified_at=r.last_verified_at,
            retrieved_at=r.retrieved_at,
            description=r.description,
            canonical_url_hash=r.canonical_url_hash,
            raw_metadata=r.raw_metadata or {}
        )

    def get_closing_soon_opportunities(self, db: Session, limit: int = 10) -> List[OpportunityItem]:
        """Returns verified opportunities expiring within 3 to 7 days."""
        self._ensure_initialized(db)
        records = db.query(OpportunityRecord).filter(
            OpportunityRecord.status.in_(["closing_soon", "open"])
        ).all()

        closing_soon: List[OpportunityItem] = []
        for r in records:
            status = compute_opportunity_status(r.deadline, r.last_verified_at)
            if status == "closing_soon":
                closing_soon.append(self.get_opportunity_by_id(r.id, db))

        # Sort by earliest deadline
        closing_soon.sort(key=lambda x: x.deadline or "9999-99-99")
        return [c for c in closing_soon if c is not None][:limit]

    # -----------------------------------------------------------------------
    # Saved Opportunities & Application Pipeline
    # -----------------------------------------------------------------------

    def save_opportunity(
        self,
        student_id: str,
        req: SaveOpportunityRequest,
        db: Session
    ) -> SavedOpportunityItem:
        opp = db.query(OpportunityRecord).filter(OpportunityRecord.id == req.opportunity_id).first()
        if not opp:
            raise ValueError(f"Opportunity {req.opportunity_id} not found")

        existing = db.query(SavedOpportunityRecord).filter(
            SavedOpportunityRecord.student_id == student_id,
            SavedOpportunityRecord.opportunity_id == req.opportunity_id
        ).first()

        if existing:
            existing.application_status = req.application_status
            existing.reminder_enabled = req.reminder_enabled
            existing.reminder_frequency = req.reminder_frequency
            if req.notes is not None:
                existing.notes = req.notes
            existing.updated_at = datetime.datetime.utcnow()
            db.commit()
            db.refresh(existing)
            return self._to_saved_item(existing, db)

        new_saved = SavedOpportunityRecord(
            id=f"sopp_{int(datetime.datetime.utcnow().timestamp())}_{req.opportunity_id[:8]}",
            student_id=student_id,
            opportunity_id=req.opportunity_id,
            application_status=req.application_status,
            reminder_enabled=req.reminder_enabled,
            reminder_frequency=req.reminder_frequency,
            notes=req.notes,
            applied_at=datetime.datetime.utcnow() if req.application_status == "applied" else None,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow()
        )
        db.add(new_saved)
        db.commit()
        db.refresh(new_saved)
        return self._to_saved_item(new_saved, db)

    def remove_saved_opportunity(self, student_id: str, opportunity_id: str, db: Session) -> bool:
        record = db.query(SavedOpportunityRecord).filter(
            SavedOpportunityRecord.student_id == student_id,
            SavedOpportunityRecord.opportunity_id == opportunity_id
        ).first()
        if not record:
            return False
        db.delete(record)
        db.commit()
        return True

    def update_application_status(
        self,
        student_id: str,
        opportunity_id: str,
        req: UpdateApplicationStatusRequest,
        db: Session
    ) -> SavedOpportunityItem:
        record = db.query(SavedOpportunityRecord).filter(
            SavedOpportunityRecord.student_id == student_id,
            SavedOpportunityRecord.opportunity_id == opportunity_id
        ).first()
        if not record:
            # Automatically save if not yet saved
            return self.save_opportunity(
                student_id,
                SaveOpportunityRequest(
                    opportunity_id=opportunity_id,
                    application_status=req.application_status,
                    notes=req.notes
                ),
                db
            )

        record.application_status = req.application_status
        if req.notes is not None:
            record.notes = req.notes
        if req.application_status == "applied" and not record.applied_at:
            record.applied_at = req.applied_at or datetime.datetime.utcnow()
        record.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(record)
        return self._to_saved_item(record, db)

    def list_saved_opportunities(
        self,
        student_id: str,
        db: Session,
        status_filter: Optional[str] = None
    ) -> List[SavedOpportunityItem]:
        query = db.query(SavedOpportunityRecord).filter(
            SavedOpportunityRecord.student_id == student_id
        )
        if status_filter and status_filter != "all":
            query = query.filter(SavedOpportunityRecord.application_status == status_filter)

        records = query.order_by(SavedOpportunityRecord.created_at.desc()).all()
        return [self._to_saved_item(r, db) for r in records]

    def _to_saved_item(self, r: SavedOpportunityRecord, db: Session) -> SavedOpportunityItem:
        opp_item = self.get_opportunity_by_id(r.opportunity_id, db)
        return SavedOpportunityItem(
            id=r.id,
            student_id=r.student_id,
            opportunity_id=r.opportunity_id,
            application_status=r.application_status,
            reminder_enabled=r.reminder_enabled,
            reminder_frequency=r.reminder_frequency,
            notes=r.notes,
            applied_at=r.applied_at,
            created_at=r.created_at,
            opportunity=opp_item
        )

    # -----------------------------------------------------------------------
    # Manual Opportunity Import
    # -----------------------------------------------------------------------

    def import_manual_opportunity(
        self,
        req: ManualImportOpportunityRequest,
        student_id: str,
        db: Session
    ) -> OpportunityItem:
        """
        Validates, canonicalizes, and stores user-authorized manual job/hackathon import.
        Prevents duplicates via canonical URL hash and assigns provenance_type='manual_import'.
        """
        url_hash = compute_url_hash(req.source_url)
        existing = db.query(OpportunityRecord).filter(
            OpportunityRecord.canonical_url_hash == url_hash
        ).first()

        now = datetime.datetime.now(datetime.timezone.utc)
        status = compute_opportunity_status(req.deadline, now)

        if existing:
            # Already exists in registry, link it to the user's saved collection
            self.save_opportunity(
                student_id,
                SaveOpportunityRequest(opportunity_id=existing.id, application_status="saved"),
                db
            )
            return self.get_opportunity_by_id(existing.id, db)

        new_id = f"opp_manual_{int(now.timestamp())}_{hashlib.md5(req.title.encode()).hexdigest()[:6]}"
        rec = OpportunityRecord(
            id=new_id,
            source_id=f"manual_{student_id[:8]}",
            provider=req.provider.lower(),
            provenance_type="manual_import",
            title=req.title,
            company_or_organizer=req.company_or_organizer,
            category=req.category.lower(),
            source_url=req.source_url,
            application_url=req.application_url or req.source_url,
            location=req.location or "Remote",
            remote_status=req.remote_status.lower(),
            compensation_type=req.compensation_type.lower(),
            compensation_amount=req.compensation_amount,
            eligibility={"imported_by_user": True},
            experience_requirements=req.experience_requirements,
            skills=req.skills,
            deadline=req.deadline,
            deadline_timezone="IST",
            status=status,
            is_stale=False,
            last_verified_at=now,
            retrieved_at=now,
            description=req.description,
            canonical_url_hash=url_hash,
            raw_metadata={"imported_by": student_id, "verified_user_input": True}
        )
        db.add(rec)
        db.commit()
        db.refresh(rec)

        # Auto-save in user's saved list
        self.save_opportunity(
            student_id,
            SaveOpportunityRequest(opportunity_id=new_id, application_status="saved"),
            db
        )

        return self.get_opportunity_by_id(new_id, db)

    # -----------------------------------------------------------------------
    # AI Relevance & Skill Gap Evaluation
    # -----------------------------------------------------------------------

    def evaluate_opportunity_match(
        self,
        student: Student,
        opportunity: OpportunityItem
    ) -> OpportunityMatchEvaluation:
        """
        Evaluates match against verified student skills, projects, and CGPA.
        Strictly honest: Never fabricates qualifications and never guarantees selection.
        """
        # Verified student skills
        student_skills = {s.name.lower().strip() for s in student.skills}
        opp_skills = [s.strip() for s in opportunity.skills]

        matched = []
        gaps = []

        for s in opp_skills:
            s_clean = s.lower()
            if any(s_clean in sk or sk in s_clean for sk in student_skills):
                matched.append(s)
            else:
                gaps.append(s)

        # Base score on skills overlap
        if opp_skills:
            skill_ratio = len(matched) / len(opp_skills)
        else:
            skill_ratio = 0.75 # No strict skill requirements

        # CGPA Check
        cgpa_req = opportunity.eligibility.get("min_cgpa") if opportunity.eligibility else None
        cgpa_ok = None
        if cgpa_req is not None:
            try:
                cgpa_ok = float(student.cgpa) >= float(cgpa_req)
            except (ValueError, TypeError):
                cgpa_ok = None

        # Department Check
        dept_eligible = None
        deg_req = opportunity.eligibility.get("degrees") if opportunity.eligibility else None
        if deg_req and isinstance(deg_req, list):
            dept_eligible = any(
                student.degree.lower() in d.lower() or student.department.lower() in d.lower()
                for d in deg_req
            )

        # Calculate final percentage
        percentage = int(skill_ratio * 70)
        if cgpa_ok is True:
            percentage += 20
        elif cgpa_ok is False:
            percentage = max(10, percentage - 25)
        else:
            percentage += 10

        if dept_eligible is True:
            percentage += 10

        percentage = min(98, max(15, percentage))

        if percentage >= 75:
            match_level = "High Match"
        elif percentage >= 50:
            match_level = "Moderate Match"
        else:
            match_level = "Low Match"

        why_it_matches = []
        if matched:
            why_it_matches.append(
                f"You have confirmed experience with key required competencies: {', '.join(matched[:4])}."
            )
        if cgpa_ok is True:
            why_it_matches.append(
                f"Your academic standing (CGPA {student.cgpa}) comfortably satisfies the minimum benchmark ({cgpa_req})."
            )
        if student.projects:
            relevant_proj = [p.title for p in student.projects if any(s.lower() in str(p.tech_stack).lower() for s in opp_skills)]
            if relevant_proj:
                why_it_matches.append(
                    f"Portfolio projects match target domain: {', '.join(relevant_proj[:2])}."
                )

        if not why_it_matches:
            why_it_matches.append("Candidate meets general student eligibility criteria.")

        return OpportunityMatchEvaluation(
            opportunity_id=opportunity.id,
            match_percentage=percentage,
            match_level=match_level,
            why_it_matches=why_it_matches,
            matched_skills=matched,
            skill_gaps=gaps,
            cgpa_eligible=cgpa_ok,
            department_eligible=dept_eligible,
        )

    # -----------------------------------------------------------------------
    # User Preferences
    # -----------------------------------------------------------------------

    def get_user_preferences(self, student_id: str, db: Session) -> OpportunityUserPreferenceSchema:
        pref = db.query(OpportunityUserPreference).filter(
            OpportunityUserPreference.student_id == student_id
        ).first()
        if not pref:
            return OpportunityUserPreferenceSchema()
        return OpportunityUserPreferenceSchema(
            preferred_roles=pref.preferred_roles or [],
            preferred_categories=pref.preferred_categories or [],
            preferred_locations=pref.preferred_locations or [],
            remote_only=pref.remote_only,
            min_compensation=pref.min_compensation,
            subscribed_providers=pref.subscribed_providers or [],
        )

    def update_user_preferences(
        self,
        student_id: str,
        pref_data: OpportunityUserPreferenceSchema,
        db: Session
    ) -> OpportunityUserPreferenceSchema:
        pref = db.query(OpportunityUserPreference).filter(
            OpportunityUserPreference.student_id == student_id
        ).first()
        if not pref:
            pref = OpportunityUserPreference(
                id=f"pref_{student_id}",
                student_id=student_id,
                preferred_roles=pref_data.preferred_roles,
                preferred_categories=pref_data.preferred_categories,
                preferred_locations=pref_data.preferred_locations,
                remote_only=pref_data.remote_only,
                min_compensation=pref_data.min_compensation,
                subscribed_providers=pref_data.subscribed_providers,
            )
            db.add(pref)
        else:
            pref.preferred_roles = pref_data.preferred_roles
            pref.preferred_categories = pref_data.preferred_categories
            pref.preferred_locations = pref_data.preferred_locations
            pref.remote_only = pref_data.remote_only
            pref.min_compensation = pref_data.min_compensation
            pref.subscribed_providers = pref_data.subscribed_providers
            pref.updated_at = datetime.datetime.utcnow()

        db.commit()
        db.refresh(pref)
        return self.get_user_preferences(student_id, db)

    def get_phase0_audit(self) -> List[ProviderAuditReport]:
        return PROVIDER_AUDIT_DATA


opportunities_service = OpportunitiesService()
