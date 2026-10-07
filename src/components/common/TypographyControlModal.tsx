import React, { useState, useRef } from 'react';
import {
  Type,
  X,
  Upload,
  Check,
  Trash2,
  RotateCcw,
  Sliders,
  Sparkles,
  Smartphone,
  Eye,
  FileText,
  Receipt,
  Layers,
} from 'lucide-react';
import { useTypography } from '../../context/TypographyContext';

export const TypographyControlModal: React.FC = () => {
  const {
    typographySettings,
    updateTypographySettings,
    resetTypography,
    customFonts,
    addCustomFont,
    removeCustomFont,
    isTypographyModalOpen,
    setIsTypographyModalOpen,
    availableFontFamilies,
  } = useTypography();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ message: string; isError?: boolean } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isTypographyModalOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    const result = await addCustomFont(file, customNameInput);
    setIsUploading(false);

    if (result.success) {
      setUploadStatus({
        message: `مبارک ہو! فونٹ "${result.fontName}" کامیابی سے انسٹال اور فعال ہو گیا ہے۔`,
        isError: false,
      });
      setCustomNameInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setUploadStatus({
        message: result.error || 'فونٹ شامل کرنے میں خرابی واقع ہوئی۔',
        isError: true,
      });
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsTypographyModalOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-urdu"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/30 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-emerald-50 px-4 py-3 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400 text-emerald-950">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-header-urdu font-bold text-sm sm:text-base text-white">
                فونٹ و سائز کنٹرول سینٹر
              </h3>
              <p className="text-[10px] text-emerald-300 font-header-urdu">
                فونٹس کی تبدیلی، سائز چھوٹا/بڑا کرنا، اور موبائل سے نیا فونٹ شامل کرنا
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTypographyModalOpen(false)}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
            title="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-right bg-neutral-50/50 flex-1">
          {/* Live Preview Box */}
          <div className="bg-linear-to-b from-amber-500/5 to-emerald-500/5 border-2 border-dashed border-[#D4AF37] p-4 rounded-xl text-center space-y-1.5 shadow-2xs">
            <div className="text-[10.5px] font-bold text-emerald-900 flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>براہ راست پیش منظر (Live Typography Preview)</span>
            </div>
            <div
              className="bg-white p-3.5 rounded-lg border border-neutral-200 shadow-xs transition-all"
              style={{
                fontFamily: `"${typographySettings.primaryFont}", 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif`,
                fontSize: `${(15 * typographySettings.fontScale) / 100}px`,
                lineHeight: typographySettings.lineHeightScale,
              }}
            >
              <div className="text-amber-800 font-arabic text-sm">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div className="font-bold text-emerald-950 mt-1">
                مولانا قاضی حافظ محمد شاہد عطاری مدنی
              </div>
              <div className="text-neutral-700 text-xs">
                نکاح خواں و شرعی رجسٹرار · باضابطہ نکاح نامہ و فیس رسید اندراج
              </div>
              <div className="text-[11px] text-emerald-800 mt-1 font-mono">
                فعال فونٹ: {typographySettings.primaryFont} ({typographySettings.fontScale}%)
              </div>
            </div>
          </div>

          {/* Section 1: Font Family Selection */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2.5">
            <label className="block text-xs font-bold text-emerald-950">
              ۱. مرکزی اردو فونٹ کا انتخاب (Choose Font Family):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableFontFamilies.map((font) => {
                const isSelected = typographySettings.primaryFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => updateTypographySettings({ primaryFont: font.id })}
                    className={`p-2.5 rounded-lg border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-600/30 font-bold'
                        : 'border-neutral-200 hover:border-emerald-300 bg-white text-neutral-800'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs" style={{ fontFamily: `"${font.id}", 'Jameel Noori Nastaleeq', serif` }}>
                        {font.labelUrdu}
                      </span>
                      {font.isCustom && (
                        <span className="text-[9.5px] text-amber-700 font-sans">
                          اپلوڈ شدہ فونٹ فائل
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Font Sizes Adjustments */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>۲. فونٹ کے سائز ایڈجسٹمنٹ (Font Scale & Sizing):</span>
              </span>
              <button
                onClick={resetTypography}
                className="text-[10px] text-neutral-500 hover:text-emerald-800 flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>ڈیفالٹ پر ری سیٹ</span>
              </button>
            </div>

            {/* Quick Sizing Presets */}
            <div>
              <span className="block text-[11px] text-neutral-600 mb-1.5 font-bold">
                فوری سائز پری سیٹس (Quick Presets):
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'بہت چھوٹا', scale: 85 },
                  { label: 'چھوٹا (نازک)', scale: 92 },
                  { label: 'معتدل (عام)', scale: 100 },
                  { label: 'بڑا (واضح)', scale: 110 },
                ].map((item) => (
                  <button
                    key={item.scale}
                    onClick={() => updateTypographySettings({ fontScale: item.scale })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      typographySettings.fontScale === item.scale
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {item.label} ({item.scale}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Font Scale Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800">
                  عمومی فونٹ سائز (پوری ویب سائٹ اور تمام اسکرینز پر فوری لاگو):
                </span>
                <span className="font-mono text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {typographySettings.fontScale}%
                </span>
              </div>
              <p className="text-[10px] text-emerald-800 font-header-urdu">
                یہ سلائیڈر پوری ویب سائٹ کے تمام ٹیکسٹس، ڈیش بورڈ، ٹیبلز اور فارمز کو فوری چھوٹا یا بڑا کرتا ہے۔
              </p>
              <input
                type="range"
                min="75"
                max="140"
                step="2"
                value={typographySettings.fontScale}
                onChange={(e) => updateTypographySettings({ fontScale: Number(e.target.value) })}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[9.5px] text-neutral-400">
                <span>۷۵٪ (نہایت چھوٹا و نازک)</span>
                <span>۱۰۰٪ (معیاری ڈیفالٹ)</span>
                <span>۱۴۰٪ (بڑا و نمایاں)</span>
              </div>
            </div>

            {/* Letterhead Pad Scale Slider */}
            <div className="space-y-1 pt-2 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>اوپر والے ہیڈنگ پیڈ کا سائز (Letterhead Pad Scale):</span>
                </span>
                <span className="font-mono text-emerald-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {typographySettings.letterheadScale}%
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                اوپر والے ہیڈنگ پیڈ کو چھوٹا یا بڑا کرنے کے لیے یہ سلائیڈر استعمال کریں۔
              </p>
              <input
                type="range"
                min="75"
                max="120"
                step="2"
                value={typographySettings.letterheadScale}
                onChange={(e) => updateTypographySettings({ letterheadScale: Number(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Receipts Font Scale Slider */}
            <div className="space-y-1 pt-2 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                  <span>رسیدوں کا فونٹ سائز (Receipts Font Scale):</span>
                </span>
                <span className="font-mono text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {typographySettings.receiptFontScale}%
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                رسید کے متن اور اعداد کا سائز مناسب و خوبصورت رکھنے کے لیے یہاں سے کنٹرول کریں۔
              </p>
              <input
                type="range"
                min="75"
                max="120"
                step="2"
                value={typographySettings.receiptFontScale}
                onChange={(e) => updateTypographySettings({ receiptFontScale: Number(e.target.value) })}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Upload Custom Font from Mobile or PC */}
          <div className="bg-linear-to-b from-white to-amber-50/30 p-4 rounded-xl border border-amber-300 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-amber-100 text-amber-800">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  ۳. موبائل یا کمپیوٹر سے اپنا فونٹ شامل کریں (Add Custom Font from Mobile):
                </h4>
                <p className="text-[10.5px] text-neutral-600">
                  اپنے موبائل کے ڈاؤنلوڈز یا میموری سے کوئی بھی نستعلیق فونٹ (.ttf, .otf, .woff, .woff2) اپلوڈ کریں۔
                </p>
              </div>
            </div>

            {/* Custom Name (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="فونٹ کا نام رکھیں (اختیاری، مثلاً: نور نستعلیق)"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="mobile-font-file-input"
                />
                <label
                  htmlFor="mobile-font-file-input"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'اپلوڈ ہو رہا ہے...' : 'فونٹ فائل منتخب کریں'}</span>
                </label>
              </div>
            </div>

            {/* Status Message */}
            {uploadStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  uploadStatus.isError
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {uploadStatus.isError ? (
                  <X className="w-4 h-4 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 shrink-0" />
                )}
                <span>{uploadStatus.message}</span>
              </div>
            )}

            {/* List of Uploaded Fonts */}
            {customFonts.length > 0 && (
              <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                <span className="block text-[11px] font-bold text-neutral-700">
                  آپ کے انسٹال کردہ فونٹس ({customFonts.length}):
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {customFonts.map((cf) => (
                    <div
                      key={cf.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-neutral-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-950">{cf.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ({cf.format} · {cf.fileSizeKb} KB)
                        </span>
                        {typographySettings.primaryFont === cf.name && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                            فعال
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateTypographySettings({ primaryFont: cf.name })}
                          className="px-2 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold"
                        >
                          فعال کریں
                        </button>
                        <button
                          onClick={() => removeCustomFont(cf.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          title="فونٹ حذف کریں"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-100 px-4 py-2.5 flex items-center justify-between border-t border-neutral-200">
          <button
            type="button"
            onClick={resetTypography}
            className="text-xs text-neutral-600 hover:text-neutral-900 underline"
          >
            ڈیفالٹ ترتیبات بحال کریں
          </button>

          <button
            type="button"
            onClick={() => setIsTypographyModalOpen(false)}
            className="px-5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
          >
            ترتیبات محفوظ و بند کریں
          </button>
        </div>
      </div>
    </div>
  );
};
