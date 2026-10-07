import React, { useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
  WifiOff,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, triggerInstall, isInstalled } = useOfflineStatus();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Detect actual public URL reliably
  const getAppUrl = () => {
    if (typeof window !== 'undefined') {
      // If running on localhost or inside iframe, fallback to standard shared cloud URL if on preview
      const href = window.location.href;
      if (href && !href.startsWith('about:') && !href.startsWith('blob:')) {
        return href;
      }
    }
    return 'https://ais-pre-wfov3fhs3bmgrld3v2j4ch-324391521914.asia-east1.run.app';
  };

  const currentUrl = getAppUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`مولانا قاضی حافظ محمد شاہد عطاری مدنی (نکاح رجسٹرار پورٹل)\nبغیر انٹرنیٹ مکمل آف لائن ایپ انسٹال کرنے کے لیے لنک کھولیں:\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-urdu"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm">
              ق
            </div>
            <div>
              <h3 className="font-header-urdu font-bold text-sm sm:text-base text-white">
                آف لائن ایپ انسٹالیشن (موبائل و کمپیوٹر)
              </h3>
              <p className="text-[11px] text-emerald-200 font-header-urdu">
                بغیر انٹرنیٹ 100% مکمل استعمال کے لیے ہوم اسکرین پر انسٹال کریں
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Direct Install Button if supported by browser */}
          {canInstall && (
            <div className="bg-emerald-50 border-2 border-emerald-500/40 p-3.5 rounded-xl text-center space-y-2">
              <span className="text-xs font-bold text-emerald-950 block">
                آپ کے براؤزر میں ڈائریکٹ انسٹال بٹن فعال ہے!
              </span>
              <button
                onClick={async () => {
                  const success = await triggerInstall();
                  if (success) onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>ابھی موبائل / کمپیوٹر پر انسٹال کریں</span>
              </button>
            </div>
          )}

          {/* 1-Click Direct Install App Link Box */}
          <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-header-urdu">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>براہِ راست آٹو انسٹال ایپ لنک:</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                آفیشل شیئرنگ لنک
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-neutral-300">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full text-xs font-mono text-neutral-800 bg-transparent border-0 focus:outline-hidden pr-2 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-all active:scale-95 font-header-urdu"
                title="لنک کاپی کریں"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کاپی ہو گیا' : 'کاپی لنک'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs font-header-urdu"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واٹس ایپ پر بھیجیں</span>
              </button>

              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-neutral-300 font-header-urdu"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>نئے ٹیب میں کھولیں</span>
              </a>
            </div>
          </div>

          {isInstalled && (
            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>ایپ پہلے ہی آپ کے ڈیوائس پر بطور آف لائن سافٹ ویئر انسٹال ہو چکی ہے۔</span>
            </div>
          )}

          {/* Quick Offline Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>بغیر انٹرنیٹ 100% اوپن ہوگی</span>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>تمام ڈیٹا محفوظ رہے گا</span>
            </div>
          </div>

          {/* Android WebAPK Card */}
          <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-3.5 rounded-xl border border-amber-400/40 space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <span className="font-header-urdu font-bold text-xs sm:text-sm text-amber-300 block">
                  اینڈرائیڈ APK (WebAPK) براہِ راست انسٹالیشن:
                </span>
                <span className="text-[10px] text-emerald-200">
                  گوگل کی جدید ٹیکنالوجی کے مطابق APK خودکار طریقے سے موبائل میں انسٹال ہو جاتی ہے
                </span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-100 font-header-urdu leading-relaxed">
              اینڈرائیڈ میں نامعلوم ذرائع سے روایتی .apk فائلیں ڈاؤنلوڈ کرنے کی ضرورت نہیں ہوتی۔ جب آپ <strong>"ایپ انسٹال کریں"</strong> یا گوگل کروم کے مینیو سے <strong>"Install app"</strong> پر کلک کرتے ہیں تو گوگل پلے سروسز آپ کے موبائل کے لیے محفوظ <strong>WebAPK</strong> بنا کر آپ کی ہوم اسکرین پر اصلی ایپ آئیکن بنا دیتی ہے جو 100% آف لائن کام کرتی ہے۔
            </p>
          </div>

          {/* Easy Step-by-Step Instructions */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-neutral-800 border-b pb-1">
              مختلف ڈیوائسز پر انسٹال کرنے کا آسان طریقہ:
            </h4>

            {/* Android / Chrome */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. اینڈرائیڈ موبائل (Google Chrome):</span>
              </div>
              <p className="text-[11.5px] text-neutral-600 pr-5 leading-relaxed">
                کروم براؤزر کے اوپر دائیں کونے میں **3 نقطوں (Menu ⋮)** پر کلک کریں اور **"Install app"** یا **"Add to Home screen" (ہوم اسکرین میں شامل کریں)** منتخب کریں۔
              </p>
            </div>

            {/* iPhone / Safari */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
                <Smartphone className="w-3.5 h-3.5 text-blue-700" />
                <span>2. آئی فون (Apple Safari):</span>
              </div>
              <p className="text-[11.5px] text-neutral-600 pr-5 leading-relaxed">
                سفاری میں نیچے موجود **Share بٹن (<Share className="w-3 h-3 inline text-blue-600" />)** پر کلک کریں، پھر نیچے اسکرول کر کے **"Add to Home Screen" (<PlusSquare className="w-3 h-3 inline text-neutral-700" />)** پر کلک کریں۔
              </p>
            </div>

            {/* Laptop / Windows / Mac */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
                <Monitor className="w-3.5 h-3.5 text-purple-700" />
                <span>3. لیپ ٹاپ یا کمپیوٹر (Chrome / Edge):</span>
              </div>
              <p className="text-[11.5px] text-neutral-600 pr-5 leading-relaxed">
                ایڈریس بار میں دائیں جانب موجود **انسٹال آئیکن (<Download className="w-3 h-3 inline text-emerald-700" />)** یا براؤزر مینیو سے **"Install Qazi Portal"** پر کلک کریں۔
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-100 px-4 py-3 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs shadow-2xs"
          >
            سمجھ آ گیا (بند کریں)
          </button>
        </div>
      </div>
    </div>
  );
};
