/**
 * High-Fidelity PDF Export Utility for Placement Hub Resume Studio
 * Renders an isolated A4 print document preserving 100% of the active template
 * layout, typography, custom accent colors, section order, and margins.
 */

export const exportResumeToPdf = (
  elementId: string = 'resume-print-canvas',
  candidateName: string = 'Resume',
  targetRole: string = ''
) => {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    console.warn(`Element #${elementId} not found, falling back to window.print()`);
    window.print();
    return;
  }

  const cleanTitle = targetRole
    ? `${candidateName} — ${targetRole} Resume`
    : `${candidateName} — Resume`;

  // Remove existing print iframe if any
  const existingIframe = document.getElementById('resume-pdf-print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  // Create isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'resume-pdf-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  // Capture all application styles (Tailwind CSS, Google Fonts, inline styles)
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  // Deep clone the rendered resume canvas
  const clone = sourceEl.cloneNode(true) as HTMLElement;

  // Remove editing tags, guides, and indicators
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());

  // Convert inputs into clean typography text spans
  clone.querySelectorAll('input').forEach((inputEl) => {
    const span = document.createElement('span');
    span.textContent = inputEl.value || inputEl.placeholder || '';
    span.className = inputEl.className
      .replace(/hover:[^\s]+/g, '')
      .replace(/focus:[^\s]+/g, '')
      .replace(/bg-[^\s]+/g, '');
    span.style.cssText = inputEl.style.cssText;
    inputEl.parentNode?.replaceChild(span, inputEl);
  });

  // Convert textareas into clean typography pre-wrapped blocks
  clone.querySelectorAll('textarea').forEach((textareaEl) => {
    const div = document.createElement('div');
    div.textContent = textareaEl.value || textareaEl.placeholder || '';
    div.className = textareaEl.className
      .replace(/hover:[^\s]+/g, '')
      .replace(/focus:[^\s]+/g, '')
      .replace(/bg-[^\s]+/g, '');
    div.style.cssText = textareaEl.style.cssText;
    div.style.whiteSpace = 'pre-wrap';
    textareaEl.parentNode?.replaceChild(div, textareaEl);
  });

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${cleanTitle}</title>
    ${headStyles}
    <style>
      @page {
        size: A4 portrait;
        margin: 0;
      }
      *, *::before, *::after {
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
        width: 210mm !important;
        min-height: 297mm !important;
        font-family: inherit;
        overflow: visible !important;
      }
      .resume-print-container,
      #resume-print-canvas {
        display: block !important;
        visibility: visible !important;
        width: 210mm !important;
        min-height: 297mm !important;
        max-width: 210mm !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        border: none !important;
        transform: none !important;
        background: #ffffff !important;
        overflow: visible !important;
        page-break-after: auto !important;
        page-break-inside: auto !important;
      }
      .resume-print-container header,
      .resume-print-container main,
      .resume-print-container section {
        display: block !important;
        visibility: visible !important;
      }
      .no-print {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div class="resume-print-container" style="width: 210mm; min-height: 297mm; background: #ffffff;">
      ${clone.innerHTML}
    </div>
  </body>
</html>`);
  iframeDoc.close();

  // Allow styles, fonts, and inline CSS to complete layout computation
  setTimeout(() => {
    try {
      const prevDocTitle = document.title;
      document.title = cleanTitle;
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      // Restore title after print dialog closes
      setTimeout(() => {
        document.title = prevDocTitle;
      }, 1500);
    } catch (e) {
      console.warn('Iframe print error, falling back to window.print():', e);
      window.print();
    }
  }, 250);
};
