import React, { useState } from 'react';
import {
  Stamp,
  FileSignature,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Eye,
  Lock,
} from 'lucide-react';
import { OfficeSettings, User } from '../../types';
import { storageService } from '../../services/storage';

interface SealSignatureViewProps {
  user: User;
}

export const SealSignatureView: React.FC<SealSignatureViewProps> = ({ user }) => {
  const [settings, setSettings] = useState<OfficeSettings>(() => storageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof OfficeSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    storageService.saveSettings(updated);
    storageService.logAction('UPDATE', 'SETTINGS', 'seals', `مہریں و دستخط ترتیبات تبدیل کی گئیں`, user);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-urdu">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <Stamp className="w-5 h-5 text-amber-600" />
          <span>ڈیجیٹل مہریں، دفتری مونوگرام و دستخط کنٹرول</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          دستاویزات کے لیے مہرِ دفتری، قاضی کے تصدیقی دستخط اور واٹر مارک کا کنٹرول
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>ترتیبات کامیابی سے محفوظ ہو گئیں۔ پرنٹنگ پر نافذ العمل ہیں۔</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Office Seal Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 text-center">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-900">مہرِ دفتری (Office Seal)</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                settings.showSealOnPrint ? 'bg-emerald-100 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {settings.showSealOnPrint ? 'فعال' : 'غیر فعال'}
            </span>
          </div>

          {/* Seal Graphic Preview */}
          <div className="h-40 flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-emerald-800/40 p-4">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-emerald-900 flex flex-col items-center justify-center p-2 text-center bg-white shadow-xs">
              <Stamp className="w-6 h-6 text-emerald-800 mb-1" />
              <span className="text-[10px] font-bold text-emerald-950 leading-tight">
                دار القضاء و نکاح کونسل
              </span>
              <span className="text-[9px] text-emerald-800 leading-tight">
                مولانا قاضی حافظ محمد شاہد عطاری
              </span>
              <span className="text-[8px] text-neutral-500 font-mono">
                REG-2024-LHR
              </span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-600">
            یہ باضابطہ مہر نکاح نامہ، حلفی بیان اور رسید کے نچلے حصے پر ظاہر ہوتی ہے۔
          </p>

          <button
            onClick={() => handleToggle('showSealOnPrint')}
            className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
              settings.showSealOnPrint
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            {settings.showSealOnPrint ? 'پرنٹ سے مہر ہٹائیں' : 'پرنٹ پر مہر ظاہر کریں'}
          </button>
        </div>

        {/* Qazi Signature Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 text-center">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-900">دستخطِ قاضی (Qazi Signature)</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                settings.showSignatureOnPrint ? 'bg-emerald-100 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {settings.showSignatureOnPrint ? 'فعال' : 'غیر فعال'}
            </span>
          </div>

          <div className="h-40 flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-emerald-800/40 p-4">
            <div className="space-y-1">
              <div className="font-arabic text-emerald-950 text-xl font-bold italic tracking-wide">
                محمد شاہد عطاری مدنی (عفی عنہ)
              </div>
              <div className="w-32 border-b border-emerald-900 mx-auto"></div>
              <span className="text-[10px] text-neutral-600 block">
                نکاح خواں و شرعی رجسٹرار
              </span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-600">
            پرنٹ دستاویزات پر قاضی صاحب کا مصدقہ شرعی خطی دستخط ظاہر ہوتا ہے۔
          </p>

          <button
            onClick={() => handleToggle('showSignatureOnPrint')}
            className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
              settings.showSignatureOnPrint
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            {settings.showSignatureOnPrint ? 'پرنٹ سے دستخط ہٹائیں' : 'پرنٹ پر دستخط ظاہر کریں'}
          </button>
        </div>

        {/* Background Watermark Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4 text-center">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-900">پس منظر واٹر مارک (Watermark)</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                settings.showWatermark ? 'bg-emerald-100 text-emerald-900' : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              {settings.showWatermark ? 'فعال' : 'غیر فعال'}
            </span>
          </div>

          <div className="h-40 flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-emerald-800/40 p-4 relative overflow-hidden">
            <div className="opacity-25 font-bold text-emerald-950 text-2xl rotate-[-20deg]">
              دار القضاء ریکارڈ
            </div>
          </div>

          <p className="text-[11px] text-neutral-600">
            دستاویز کی نقل و جعلسازی کی روک تھام کے لیے پس منظر میں ہلکا واٹر مارک۔
          </p>

          <button
            onClick={() => handleToggle('showWatermark')}
            className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
              settings.showWatermark
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            {settings.showWatermark ? 'واٹر مارک ہٹائیں' : 'واٹر مارک فعال کریں'}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs text-amber-950 flex items-center gap-3">
        <Lock className="w-5 h-5 text-amber-700 shrink-0" />
        <p>
          <strong>سیکورٹی پروٹیکشن:</strong> مہریں اور دستخط عوامی پورٹل پر کبھی ظاہر نہیں ہوتے اور صرف مستند لاگ ان شدہ دفتری صارفین ہی پرنٹنگ کنٹرول تبدیل کر سکتے ہیں۔
        </p>
      </div>
    </div>
  );
};
