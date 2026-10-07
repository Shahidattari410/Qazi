import React, { useState } from 'react';
import {
  Type,
  X,
  Upload,
  CheckCircle2,
  Trash2,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from 'lucide-react';
import { AppFontOption, fontManager } from '../../services/fontManager';

interface FontSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFontChanged?: () => void;
}

export const FontSettingsModal: React.FC<FontSettingsModalProps> = ({
  isOpen,
  onClose,
  onFontChanged,
}) => {
  const [fonts, setFonts] = useState<AppFontOption[]>(() => fontManager.getAllFonts());
  const [selectedFontId, setSelectedFontId] = useState<string>(() => fontManager.getSelectedFontId());
  const [fontScale, setFontScale] = useState<number>(() => fontManager.getFontScale());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectFont = (id: string) => {
    setSelectedFontId(id);
    fontManager.setSelectedFontId(id);
    if (onFontChanged) onFontChanged();
  };

  const handleScaleChange = (newScale: number) => {
    const val = Math.max(0.75, Math.min(1.35, parseFloat(newScale.toFixed(2))));
    setFontScale(val);
    fontManager.setFontScale(val);
    if (onFontChanged) onFontChanged();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['ttf', 'otf', 'woff', 'woff2'].includes(extension || '')) {
      alert('براہ کرم TTF، OTF، WOFF یا WOFF2 فونٹ فائل منتخب کریں۔');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = reader.result as string;
        const fontName = file.name.replace(/\.[^/.]+$/, '').trim() || 'MyMobileFont';
        const newFont = fontManager.saveCustomFont(fontName, dataUrl);
        setFonts(fontManager.getAllFonts());
        setSelectedFontId(newFont.id);
        fontManager.setSelectedFontId(newFont.id);
        setUploadSuccess(`فونٹ "${fontName}" کامیابی سے شامل ہو گیا!`);
        setTimeout(() => setUploadSuccess(null), 3500);
        if (onFontChanged) onFontChanged();
      } catch (err) {
        console.error('Font upload error:', err);
        alert('فونٹ فائل لوڈ کرنے میں خرابی واقع ہوئی۔');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCustom = (id: string) => {
    if (!confirm('کیا آپ واقعی یہ کسٹم فونٹ حذف کرنا چاہتے ہیں؟')) return;
    fontManager.deleteCustomFont(id);
    const updated = fontManager.getAllFonts();
    setFonts(updated);
    if (selectedFontId === id) {
      setSelectedFontId('jameel_nastaleeq');
      fontManager.setSelectedFontId('jameel_nastaleeq');
    }
    if (onFontChanged) onFontChanged();
  };

  const selectedFontObj = fonts.find((f) => f.id === selectedFontId) || fonts[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-urdu">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" />
            <h3 className="font-header-urdu font-bold text-sm text-white">
              فونٹس و سائز سیٹنگز اور موبائل سے فونٹ اپلوڈ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto bg-neutral-50/50 text-xs">
          {/* Live Preview Box */}
          <div className="p-3.5 rounded-xl border border-amber-300/80 bg-[#FFFDF5] shadow-inner space-y-1">
            <span className="text-[10px] text-neutral-500 font-bold block">
              براہ راست پیش منظر (Live Preview):
            </span>
            <div
              className="text-emerald-950 text-center py-2"
              style={{
                fontFamily: selectedFontObj.fontFamily,
                fontSize: `${14 * fontScale}px`,
                lineHeight: '1.4',
              }}
            >
              مولانا قاضی حافظ محمد شاہد عطاری مدنی
              <div className="text-emerald-800 font-semibold" style={{ fontSize: `${11 * fontScale}px` }}>
                باضابطہ دفتری رسید فیس و شرعی ریکارڈ (سائز: {Math.round(fontScale * 100)}%)
              </div>
            </div>
          </div>

          {/* Font Size Adjuster Controls */}
          <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-neutral-800 flex items-center gap-1.5 font-header-urdu">
                <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                <span>فونٹ کا سائز ایڈجسٹ کریں:</span>
              </label>
              <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {Math.round(fontScale * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScaleChange(fontScale - 0.05)}
                className="p-1.5 rounded-lg border bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                title="سائز چھوٹا کریں"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min="0.75"
                max="1.35"
                step="0.05"
                value={fontScale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => handleScaleChange(fontScale + 0.05)}
                className="p-1.5 rounded-lg border bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                title="سائز بڑا کریں"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Size Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 font-header-urdu">
              {[
                { label: 'چھوٹا (85%)', val: 0.85 },
                { label: 'معیاری (95%)', val: 0.95 },
                { label: 'مناسب (100%)', val: 1.0 },
                { label: 'بڑا (115%)', val: 1.15 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleScaleChange(p.val)}
                  className={`py-1 rounded text-[10px] font-bold border transition-colors ${
                    Math.abs(fontScale - p.val) < 0.02
                      ? 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selection List */}
          <div className="bg-white p-3 rounded-xl border border-neutral-200 space-y-2">
            <label className="font-bold text-neutral-800 block font-header-urdu">
              دستیاب فونٹس منتخب کریں:
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {fonts.map((f) => (
                <div
                  key={f.id}
                  onClick={() => handleSelectFont(f.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    selectedFontId === f.id
                      ? 'bg-emerald-50/80 border-emerald-700 shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedFontId === f.id
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-neutral-400'
                      }`}
                    >
                      {selectedFontId === f.id && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                    </span>
                    <div>
                      <span className="font-bold block text-neutral-900" style={{ fontFamily: f.fontFamily }}>
                        {f.nameUrdu}
                      </span>
                      <span className="text-[9px] text-neutral-500 font-mono">{f.nameEn}</span>
                    </div>
                  </div>

                  {f.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustom(f.id);
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                      title="فونٹ حذف کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Custom Font from Mobile/PC */}
          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-300/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-emerald-950 font-header-urdu flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-800" />
                <span>اپنے موبائل / کمپیوٹر سے فونٹ فائل ایڈ کریں:</span>
              </label>
              <span className="text-[9px] text-emerald-700 font-mono">TTF, OTF, WOFF, WOFF2</span>
            </div>

            <p className="text-[10.5px] text-neutral-600 font-urdu leading-relaxed">
              اگر آپ کے پاس کوئی خاص نفیس فونٹ موجود ہے تو آپ نیچے بٹن سے فائل اپلوڈ کر سکتے ہیں۔ وہ فوری طور پر رسیدوں اور تمام دستاویزات پر فعال ہو جائے گی۔
            </p>

            <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-emerald-700/60 rounded-xl bg-white hover:bg-emerald-50/50 cursor-pointer transition-all active:scale-98">
              <Upload className="w-4 h-4 text-emerald-800" />
              <span className="font-bold text-emerald-900 font-header-urdu text-xs">
                {isUploading ? 'فونٹ رجسٹر ہو رہا ہے...' : 'موبائل سے فونٹ فائل منتخب کریں (.ttf / .otf)'}
              </span>
              <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {uploadSuccess && (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs bg-emerald-100/80 p-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{uploadSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-100 px-4 py-2.5 border-t border-neutral-300 flex justify-between items-center">
          <span className="text-[10px] text-neutral-500 font-header-urdu">
            تمام تبدیلیاں فوری طور پر رسید اور پورٹل پر لاگو ہوں گی۔
          </span>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors font-header-urdu"
          >
            ٹھیک ہے / محفوظ کریں
          </button>
        </div>
      </div>
    </div>
  );
};
