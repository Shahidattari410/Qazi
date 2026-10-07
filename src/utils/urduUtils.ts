/**
 * Utility functions for Urdu numbers, currency in words, and reliable printing
 */

const URDU_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toUrduDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => URDU_DIGITS[parseInt(d, 10)]);
}

export function numberToUrduWords(num: number): string {
  if (isNaN(num) || num <= 0) return 'صفر روپے فقط';

  const units = [
    '', 'ایک', 'دو', 'تین', 'چار', 'پانچ', 'چھ', 'سات', 'آٹھ', 'نو', 'دس',
    'گیارہ', 'بارہ', 'تیرہ', 'چودہ', 'پندرہ', 'سولہ', 'سترہ', 'اٹھارہ', 'انیس',
  ];
  const tens = [
    '', '', 'بیس', 'تیس', 'چالیس', 'پچاس', 'ساٹھ', 'ستر', 'اسی', 'نوے',
  ];

  function convertBelowHundred(n: number): string {
    if (n < 20) return units[n];
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return tens[t];
    return `${tens[t]} ${units[u]}`;
  }

  function convertBelowThousand(n: number): string {
    if (n < 100) return convertBelowHundred(n);
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const hStr = h === 1 ? 'ایک سو' : `${units[h]} سو`;
    return rem > 0 ? `${hStr} ${convertBelowHundred(rem)}` : hStr;
  }

  let result = '';

  if (num >= 10000000) {
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    result += `${convertBelowHundred(crore)} کروڑ `;
  }

  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    result += `${convertBelowHundred(lakh)} لاکھ `;
  }

  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    result += `${convertBelowHundred(thousand)} ہزار `;
  }

  if (num > 0) {
    result += convertBelowThousand(num);
  }

  return `${result.trim()} روپے فقط`;
}

/**
 * 100% reliable printing helper that invokes mobile and desktop print dialogs
 * using hidden iframe injection + window.print() isolation.
 * Automatically injects all custom uploaded fonts and dynamic typography variables.
 */
export function triggerReliablePrint(elementId?: string): void {
  try {
    const targetElement = elementId ? document.getElementById(elementId) : null;
    const activeFont =
      getComputedStyle(document.documentElement).getPropertyValue('--app-font-family') ||
      '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", "Amiri", serif';

    if (targetElement) {
      // 1. Mobile & Iframe-safe: Create an isolated hidden print iframe
      const existingIframe = document.getElementById('qazi-app-print-iframe');
      if (existingIframe) {
        existingIframe.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'qazi-app-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        // Collect all active styles and custom font sheets
        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
          .map((s) => s.outerHTML)
          .join('\n');

        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html dir="rtl" lang="ur">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>پرنٹ دستاویز</title>
            ${styles}
            <style>
              :root {
                --app-font-family: ${activeFont};
              }
              * {
                font-family: ${activeFont} !important;
              }
              @page { size: A4 portrait; margin: 6mm; }
              body { background: #fff !important; color: #000 !important; margin: 0; padding: 0; font-family: ${activeFont} !important; }
              .no-print { display: none !important; }
            </style>
          </head>
          <body class="font-urdu" style="font-family: ${activeFont} !important;">
            ${targetElement.outerHTML}
          </body>
          </html>
        `);
        doc.close();

        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (iframeErr) {
            console.warn('Iframe print error, falling back to direct print:', iframeErr);
            fallbackDirectPrint(targetElement);
          } finally {
            setTimeout(() => {
              iframe.remove();
            }, 3000);
          }
        }, 300);
        return;
      }
    }

    // Direct fallback
    window.focus();
    window.print();
  } catch (err) {
    console.warn('Print general error, attempting direct window.print:', err);
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error('Final print error:', e);
    }
  }
}

function fallbackDirectPrint(elem: HTMLElement) {
  document.body.classList.add('app-printing-active');
  elem.classList.add('active-print-target');

  const cleanup = () => {
    document.body.classList.remove('app-printing-active');
    elem.classList.remove('active-print-target');
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);
  window.focus();
  setTimeout(() => {
    try {
      window.print();
    } catch (e) {
      console.error('Fallback window.print error:', e);
    } finally {
      setTimeout(cleanup, 2500);
    }
  }, 100);
}

/**
 * Mobile-friendly document sharer / downloader
 * Opens mobile share sheet (Print/WhatsApp/Drive) or downloads document file
 */
export async function shareOrDownloadMobileDoc(elementId: string, docTitle = 'Qazi_Document'): Promise<void> {
  const elem = document.getElementById(elementId);
  if (!elem) {
    triggerReliablePrint(elementId);
    return;
  }

  const activeFont =
    getComputedStyle(document.documentElement).getPropertyValue('--app-font-family') ||
    '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", "Amiri", serif';

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((s) => s.outerHTML)
    .join('\n');

  const fullHtml = `<!DOCTYPE html>
<html dir="rtl" lang="ur">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docTitle}</title>
  ${styles}
  <style>
    :root {
      --app-font-family: ${activeFont};
    }
    * {
      font-family: ${activeFont} !important;
    }
    @page { size: A4 portrait; margin: 6mm; }
    body { background: #fff !important; color: #000 !important; margin: 0; padding: 12px; font-family: ${activeFont} !important; }
  </style>
</head>
<body class="font-urdu" style="font-family: ${activeFont} !important;">
  ${elem.outerHTML}
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

  // Check if Web Share API with files is supported
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const fileName = `${docTitle}_${Date.now()}.html`;
  const file = new File([blob], fileName, { type: 'text/html' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: docTitle,
        text: 'دفتری قانونی و شرعی دستاویز (پرنٹ یا محفوظ کریں)',
      });
      return;
    } catch (shareErr) {
      if ((shareErr as any)?.name !== 'AbortError') {
        console.warn('Share error, falling back:', shareErr);
      }
    }
  }

  // Fallback: Trigger browser download or reliable print
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
