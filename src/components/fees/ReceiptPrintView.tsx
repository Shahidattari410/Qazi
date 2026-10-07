import React, { useRef, useEffect, useState } from 'react';
import {
  Printer,
  X,
  Receipt,
  Stamp,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wallet,
  Building2,
  Download,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Sliders,
  Type,
  ZoomIn,
  ZoomOut,
  Layers,
  Share2,
} from 'lucide-react';
import { FeeReceipt, OfficeSettings } from '../../types';
import { Emblem } from '../common/Emblem';
import { numberToUrduWords, triggerReliablePrint, shareOrDownloadMobileDoc } from '../../utils/urduUtils';
import { useTypography } from '../../context/TypographyContext';

interface ReceiptPrintViewProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FeeReceipt | null;
  settings: OfficeSettings;
}

export const ReceiptPrintView: React.FC<ReceiptPrintViewProps> = ({
  isOpen,
  onClose,
  receipt,
  settings,
}) => {
  const {
    typographySettings,
    updateTypographySettings,
    setIsTypographyModalOpen,
    availableFontFamilies,
  } = useTypography();

  const [dualCopyMode, setDualCopyMode] = useState<boolean>(false);
  const [localFontFamily, setLocalFontFamily] = useState<string>(typographySettings.primaryFont);
  const [localFontScale, setLocalFontScale] = useState<number>(typographySettings.receiptFontScale || 90);

  // Sync when typography settings update
  useEffect(() => {
    setLocalFontFamily(typographySettings.primaryFont);
    setLocalFontScale(typographySettings.receiptFontScale || 90);
  }, [typographySettings]);

  // Close on Escape key press so user is never stuck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    triggerReliablePrint('receipt-a4-printable');
  };

  const handleOpenInNewWindow = () => {
    handlePrint();
  };

  const handleDownloadHtml = () => {
    const elem = document.getElementById('receipt-a4-printable');
    if (!elem) return;

    const htmlContent = `
      <!doctype html>
      <html lang="ur" dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>رسید فیس - ${receipt.receiptNo}</title>
          <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: '${localFontFamily}', 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Amiri', serif; margin: 15px; background: #fff; }
            .receipt-card { border: 2px solid #D4AF37; padding: 18px; background: #FFFDF5; max-width: 720px; margin: auto; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            ${elem.outerHTML}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${receipt.receiptNo}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const amountInWords = numberToUrduWords(receipt.amount);

  // Helper renderer for a single voucher (Single or Duplicate copy)
  const renderVoucher = (voucherType: 'سائل' | 'دفتر') => (
    <div
      className="bg-[#FFFDF5] p-3.5 sm:p-5 rounded-xl border-2 border-[#D4AF37] relative shadow-md mx-auto max-w-[650px] space-y-2.5 transition-all"
      style={{
        boxShadow: '0 6px 20px -4px rgba(8, 116, 67, 0.12), 0 0 0 1px #D4AF37, 0 0 0 3px #087443',
        fontFamily: `"${localFontFamily}", 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif`,
        fontSize: `${(13.5 * localFontScale) / 100}px`,
      }}
    >
      {/* Subtle Royal Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <Emblem size={240} />
      </div>

      {/* Top 3D Calligraphy Bismillah & Quranic Ayat */}
      <div className="relative z-10 text-center pb-1 border-b border-emerald-900/25">
        <div className="text-[10px] font-arabic font-bold text-emerald-900 tracking-wider">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <div className="text-[8px] sm:text-[8.5px] font-arabic text-emerald-800/90 tracking-normal mt-0.5">
          وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً · وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ
        </div>
      </div>

      {/* Compact Letterhead Pad (Smaller Nastaleeq as requested) */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-0.5">
        <div className="w-10 shrink-0 text-center">
          <Emblem size={28} />
        </div>

        <div className="flex-1 text-center px-1">
          <h2 className="font-header-urdu font-bold text-[12px] sm:text-[13px] text-emerald-950 leading-tight">
            {settings.qaziName}
          </h2>
          <p className="text-[8.5px] font-semibold text-emerald-800 font-header-urdu leading-tight mt-0.5">
            {settings.qaziTitle} · دار القضاء و شرعی ریکارڈ کونسل
          </p>
          <p className="text-[7.5px] text-neutral-600 font-header-urdu leading-tight">
            لائسنس رجسٹریشن نمبر: {settings.qaziRegistrationNo} · فون: {settings.contactNumber}
          </p>
        </div>

        <div className="w-10 shrink-0 flex flex-col items-center justify-center p-0.5 border border-emerald-900/20 rounded bg-white/80">
          <QrCode className="w-5 h-5 text-emerald-900" />
          <span className="text-[6px] font-mono text-neutral-500">تصدیق</span>
        </div>
      </div>

      {/* 3D Islamic Metallic Typography Header Ribbon */}
      <div
        className="relative z-10 text-center py-1 px-3 rounded-lg text-white shadow-xs border-y border-amber-300 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #087443 0%, #152554 50%, #087443 100%)',
        }}
      >
        <span className="text-[7.5px] font-mono tracking-wider text-amber-200 uppercase">
          {voucherType === 'سائل' ? 'CLIENT COPY' : 'OFFICE COPY'}
        </span>
        <h3
          className="font-header-urdu font-extrabold text-[11.5px] sm:text-[12.5px] text-amber-300 tracking-tight"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 0 10px rgba(212,175,55,0.4)' }}
        >
          رسید وصولی فیس و قانونی اندراجِ نکاح
        </h3>
        <span className="text-[7.5px] font-bold text-amber-200 font-header-urdu">
          {voucherType === 'سائل' ? 'نقل برائے سائل' : 'دفتری دوسیہ نقل'}
        </span>
      </div>

      {/* Metadata Bar (Compact 3 Columns) */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 bg-neutral-50/90 p-1.5 rounded-lg border border-neutral-200 text-xs">
        <div>
          <span className="text-[8px] text-neutral-500 block">رسید نمبر:</span>
          <span className="font-mono font-bold text-emerald-950 text-[11px]">{receipt.receiptNo}</span>
        </div>
        <div>
          <span className="text-[8px] text-neutral-500 block">تاریخ اجراء:</span>
          <span className="font-mono font-bold text-neutral-800 text-[10px]">{receipt.date}</span>
        </div>
        <div>
          <span className="text-[8px] text-neutral-500 block">طریقہ ادائیگی:</span>
          <span className="font-bold text-neutral-800 text-[10px]">{receipt.paymentMethod}</span>
        </div>
      </div>

      {/* Client Particulars & Service Info */}
      <div className="relative z-10 border border-emerald-900/20 rounded-lg p-2 bg-white/90 space-y-1 text-xs">
        <div className="grid grid-cols-2 gap-2 pb-1 border-b border-neutral-200">
          <div>
            <span className="text-neutral-500 block text-[8px]">موصول شدہ از محترم / محترمہ:</span>
            <span className="font-bold text-neutral-900 text-[11px]">{receipt.personName}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[8px]">شناختی کارڈ نمبر (CNIC):</span>
            <span className="font-mono font-bold text-neutral-800 text-[10.5px]">{receipt.cnic || 'تصدیق شدہ'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div>
            <span className="text-neutral-500 block text-[8px]">رابطہ فون نمبر:</span>
            <span className="font-mono font-bold text-neutral-800 text-[10px]">{receipt.mobile || 'دستیاب نہیں'}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[8px]">بابت سروس و خدمت:</span>
            <span className="font-bold text-emerald-900 text-[10.5px]">{receipt.service}</span>
          </div>
        </div>

        {receipt.notes && (
          <div className="pt-0.5 text-[9px] text-neutral-700 bg-emerald-50/40 p-1 rounded border border-emerald-900/10">
            <strong>تفصیل و شرائط:</strong> {receipt.notes}
          </div>
        )}
      </div>

      {/* Itemized Table Breakdown */}
      <div className="relative z-10 border border-neutral-200 rounded-lg overflow-hidden bg-white text-[9.5px]">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-neutral-100 text-neutral-700 font-bold border-b">
              <th className="p-1 pr-2">شمار</th>
              <th className="p-1">تفصیلِ خدمت / فیس</th>
              <th className="p-1 text-left pl-2">رقم (روپے)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150">
            <tr>
              <td className="p-1 pr-2 font-mono">1</td>
              <td className="p-1">{receipt.service} (نکاح نامہ اندراج، کاپی و کارروائی)</td>
              <td className="p-1 text-left pl-2 font-mono font-bold">روپے {receipt.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3D Amount Display Box with Urdu Words (Refined Typography) */}
      <div
        className="relative z-10 border border-amber-400 p-2 rounded-xl text-center space-y-0.5 shadow-2xs"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(8,116,67,0.08) 50%, rgba(212,175,55,0.08) 100%)',
        }}
      >
        <span className="text-neutral-600 text-[8.5px] font-semibold block">
          کل وصول شدہ فیس رقم (Total Amount Received)
        </span>
        <div className="text-base sm:text-lg font-mono font-extrabold text-emerald-950 tracking-tight">
          روپے {receipt.amount.toLocaleString()} /-
        </div>
        <div className="text-[10px] sm:text-[10.5px] font-bold text-emerald-900 font-header-urdu">
          (بحروف: {amountInWords})
        </div>
      </div>

      {/* Signature & Seal Footer */}
      <div className="relative z-10 pt-1.5 border-t border-neutral-300 grid grid-cols-3 gap-1 text-center text-xs">
        <div className="flex flex-col items-center justify-end h-12">
          <div className="w-16 border-b border-neutral-400 mb-0.5"></div>
          <span className="text-[8px] text-neutral-600">دستخط سائل / فریق</span>
        </div>

        {/* Office Seal */}
        <div className="flex flex-col items-center justify-center">
          {settings.showSealOnPrint && (
            <div className="w-11 h-11 rounded-full border border-dashed border-emerald-800 flex flex-col items-center justify-center p-0.5 text-center bg-emerald-50/60 transform -rotate-3">
              <Stamp className="w-2.5 h-2.5 text-emerald-800 mb-0.2" />
              <span className="text-[6px] font-bold text-emerald-950 leading-tight">مہر دفتری</span>
              <span className="text-[5.5px] text-emerald-800 leading-tight">قاضی شاہد عطاری</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-end h-12">
          {settings.showSignatureOnPrint && (
            <span className="font-arabic text-emerald-900 text-[9.5px] italic font-bold mb-0.5">
              محمد شاہد عطاری مدنی
            </span>
          )}
          <div className="w-20 border-b border-emerald-900 mb-0.5"></div>
          <span className="font-bold text-emerald-950 text-[8.5px]">دستخط و مہر قاضی / رجسٹرار</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative z-10 pt-0.5 border-t border-neutral-200 text-[7px] text-neutral-500 text-center font-header-urdu">
        یہ کمپیوٹرائزڈ رسید دفتری ریکارڈ کے مطابق مستند جاری کی گئی۔ شرعی و قانونی خدمات ریکارڈ سسٹم۔
      </div>
    </div>
  );

  return (
    <div
      onClick={(e) => {
        // Clicking on backdrop closes the modal and returns to menu
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto font-urdu"
    >
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none flex flex-col max-h-[96vh]">
        {/* Top Action Toolbar with Prominent 'Back to Menu' & Typography Controls */}
        <div className="no-print bg-linear-to-r from-[#0c2340] via-[#1a365d] to-[#0f4c81] text-white px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-400/50 shadow-md">
          {/* Prominent Back to Menu button */}
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-all font-header-urdu active:scale-95"
            title="رسید بند کر کے واپس مینیو میں جائیں"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>← واپس مینیو</span>
          </button>

          {/* Quick Typography Controls directly on the receipt modal! */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-xl border border-white/20">
            <Type className="w-3.5 h-3.5 text-amber-300" />
            <select
              value={localFontFamily}
              onChange={(e) => {
                setLocalFontFamily(e.target.value);
                updateTypographySettings({ primaryFont: e.target.value });
              }}
              className="bg-transparent text-white text-[11px] rounded px-1.5 py-0.5 border-0 focus:outline-none cursor-pointer"
              title="رسید کا فونٹ تبدیل کریں"
            >
              {availableFontFamilies.map((f) => (
                <option key={f.id} value={f.id} className="text-neutral-900">
                  {f.labelUrdu}
                </option>
              ))}
            </select>

            {/* Quick Font Size Buttons */}
            <div className="flex items-center gap-0.5 border-r border-white/20 pr-1 mr-1">
              <button
                onClick={() => {
                  const newScale = Math.max(75, localFontScale - 4);
                  setLocalFontScale(newScale);
                  updateTypographySettings({ receiptFontScale: newScale });
                }}
                className="px-1.5 py-0.5 text-[10px] bg-white/10 hover:bg-white/20 rounded font-bold text-amber-300"
                title="چھوٹا سائز"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-cyan-200 px-1">{localFontScale}%</span>
              <button
                onClick={() => {
                  const newScale = Math.min(125, localFontScale + 4);
                  setLocalFontScale(newScale);
                  updateTypographySettings({ receiptFontScale: newScale });
                }}
                className="px-1.5 py-0.5 text-[10px] bg-white/10 hover:bg-white/20 rounded font-bold text-amber-300"
                title="بڑا سائز"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setIsTypographyModalOpen(true)}
              className="p-1 rounded text-amber-300 hover:text-white"
              title="مکمل فونٹ کنٹرول کھولیں"
            >
              <Sliders className="w-3 h-3" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Dual Copy Toggle */}
            <button
              onClick={() => setDualCopyMode(!dualCopyMode)}
              type="button"
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dualCopyMode
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
              title="دوہری کاپی (دفتر + سائل)"
            >
              <Layers className="w-3 h-3" />
              <span>{dualCopyMode ? 'دوہری کاپی فعال' : 'دوہری کاپی'}</span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-linear-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs shadow-sm transition-all active:scale-95 font-header-urdu"
              title="براہ راست پرنٹ کریں"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ کریں</span>
            </button>

            <button
              onClick={() => {
                if (receipt) {
                  shareOrDownloadMobileDoc('receipt-a4-printable', `Receipt_${receipt.receiptNo}`);
                }
              }}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm active:scale-95 transition-all font-header-urdu border border-cyan-400/30"
              title="موبائل پرنٹ و شیئر"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-200" />
              <span>موبائل پرنٹ / PDF</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-xl hover:bg-white/20 text-cyan-200 hover:text-white transition-colors"
              title="بند کریں"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Container */}
        <div className="p-2 sm:p-4 overflow-y-auto bg-neutral-100 print:bg-white print:p-0 flex-1">
          <div id="receipt-a4-printable" className="space-y-4">
            {renderVoucher('سائل')}
            {dualCopyMode && (
              <div className="pt-2 border-t-2 border-dashed border-neutral-400">
                {renderVoucher('دفتر')}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Prominent Navigation & Print Footer */}
        <div className="no-print bg-neutral-100 border-t border-neutral-300 p-2.5 px-4 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs shadow-xs transition-all font-header-urdu active:scale-95"
          >
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            <span>← واپس مینیو / فہرست پر جائیں</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 hidden sm:inline">
              (بند کرنے کے لیے کی بورڈ کا Esc بٹن بھی دبا سکتے ہیں)
            </span>
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition-all active:scale-95 font-header-urdu"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ کریں / PDF محفوظ کریں</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
