import React from 'react';
import {
  HeartHandshake,
  Calendar,
  Clock,
  Scale,
  CheckCircle2,
  AlertCircle,
  Coins,
  Receipt,
  Stamp,
  FileText,
  PlusCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Printer,
  Sliders,
  Type,
  Layers,
  Award,
  Users,
  ChevronLeft,
  Download,
  WifiOff,
  Smartphone,
} from 'lucide-react';
import { NikahRecord, User } from '../../types';
import { storageService } from '../../services/storage';
import { toUrduDigits, numberToUrduWords, triggerReliablePrint } from '../../utils/urduUtils';
import { useTypography } from '../../context/TypographyContext';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenQuickNikah: () => void;
  user: User;
  onOpenInstallModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQuickNikah,
  user,
  onOpenInstallModal,
}) => {
  const { typographySettings, setIsTypographyModalOpen } = useTypography();
  const { isOnline, canInstall, triggerInstall, isInstalled } = useOfflineStatus();

  const handleInstallClick = async () => {
    if (canInstall) {
      const installed = await triggerInstall();
      if (!installed && onOpenInstallModal) {
        onOpenInstallModal();
      }
    } else if (onOpenInstallModal) {
      onOpenInstallModal();
    }
  };

  const nikahs = storageService.getNikahs();
  const talaqs = storageService.getTalaqRecords();
  const khulas = storageService.getKhulaRecords();
  const affidavits = storageService.getAffidavits();
  const stamps = storageService.getStamps();
  const documents = storageService.getDocuments();
  const fees = storageService.getFees();
  const logs = storageService.getAuditLogs();

  const totalNikah = nikahs.length;
  const currentMonthNikah = nikahs.filter(
    (n) => n.date.startsWith('2026-09') || n.date.startsWith('2026-10')
  ).length;

  const totalTalaq = talaqs.length;
  const totalKhula = khulas.length;
  const inProgressCases =
    nikahs.filter((n) => n.status === 'زیرِ کارروائی').length +
    talaqs.filter((t) => t.status === 'زیرِ کارروائی' || t.status === 'نوٹس جاری').length;
  const completedRecords = nikahs.filter(
    (n) => n.status === 'رجسٹرڈ' || n.status === 'تصدیق شدہ'
  ).length;

  const pendingMehrSum = nikahs.reduce(
    (sum, n) => sum + (n.mehr.remainingAmount || n.mehr.muakhkharAmount),
    0
  );
  const totalFeeSum = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalStamps = stamps.length;
  const totalAffidavits = affidavits.length;
  const totalDocs = documents.length;

  // Monthly trends data for SVG chart
  const monthlyData = [
    { month: 'اپریل', nikah: 8, talaq: 1, khula: 0, fee: 95000 },
    { month: 'مئی', nikah: 12, talaq: 2, khula: 1, fee: 140000 },
    { month: 'جون', nikah: 15, talaq: 1, khula: 1, fee: 180000 },
    { month: 'جولائی', nikah: 11, talaq: 2, khula: 0, fee: 135000 },
    { month: 'اگست', nikah: 18, talaq: 3, khula: 2, fee: 220000 },
    { month: 'ستمبر', nikah: 22, talaq: 1, khula: 1, fee: 290000 },
    { month: 'اکتوبر', nikah: 14, talaq: 0, khula: 1, fee: 175000 },
  ];
  const maxNikahVal = Math.max(...monthlyData.map((d) => d.nikah));

  // Shariah Mehr Fatimi Rate Calculations
  const silverRate = 3350; // PKR per Tola pure silver
  const mehrFatimiAmount = Math.round(52.5 * silverRate);
  const gold24kRate = 285400; // PKR per Tola 24K gold

  return (
    <div className="space-y-3.5 font-urdu text-base">
      {/* 1. SLENDER, AIRY & ELEGANT TOP BAR (NO HEAVY PAD) */}
      <div className="bg-white rounded-xl border border-neutral-200/90 p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
            ق
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-header-urdu font-bold text-base sm:text-lg text-emerald-950 leading-tight">
                مولانا قاضی حافظ محمد شاہد عطاری مدنی
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                نکاح خواں و شرعی رجسٹرار
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-header-urdu mt-0.5">
              دارالقضاء و دفتر رجسٹریشن · باضابطہ عائلی و قانونی کونسل
            </p>
          </div>
        </div>

        {/* Quick Top Actions & Font Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 border border-emerald-700 font-header-urdu"
            title="موبائل یا کمپیوٹر پر آف لائن ایپ انسٹال کریں"
          >
            <Download className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>📱 آف لائن ایپ انسٹال</span>
          </button>

          <button
            onClick={() => setIsTypographyModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-300 shadow-2xs"
            title="فونٹ و سائز تبدیل کریں"
          >
            <Type className="w-3.5 h-3.5 text-emerald-700" />
            <span>فونٹ کنٹرول</span>
          </button>

          <button
            onClick={onOpenQuickNikah}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>نیا نکاح اندراج</span>
          </button>
        </div>
      </div>

      {/* 1.5 PROMINENT OFFLINE STATUS & APP INSTALLATION BAR */}
      <div className="bg-emerald-900 text-white p-3 sm:p-3.5 rounded-xl border border-emerald-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-right w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-header-urdu font-bold text-xs sm:text-sm text-amber-200">
                ⚡ مکمل آف لائن سسٹم (انٹرنیٹ کے بغیر 100% فعال)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100 border border-emerald-600">
                PWA Ready
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 font-header-urdu mt-0.5">
              یہ ویب پورٹل انٹرنیٹ کے بغیر بھی چلے گا۔ اسے اپنے موبائل یا کمپیوٹر پر ایک کلک سے انسٹال کریں۔
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>موبائل / کمپیوٹر پر انسٹال کریں</span>
        </button>
      </div>

      {/* 2. LIGHTWEIGHT QUICK SERVICES BAR */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-neutral-200 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center font-header-urdu text-sm">
          <button
            onClick={onOpenQuickNikah}
            className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-2xs flex flex-col items-center justify-center gap-1 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span className="text-sm">نیا نکاح</span>
          </button>

          <button
            onClick={() => onNavigate('khutbah_nikah')}
            className="p-2 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-emerald-950 border border-amber-300/80 font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="text-sm">خطبہ نکاح</span>
          </button>

          <button
            onClick={() => onNavigate('official_nikah_form')}
            className="p-2 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 text-emerald-950 border border-emerald-300/80 font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-800" />
            <span className="text-sm">اصلی فارم دوم</span>
          </button>

          <button
            onClick={() => onNavigate('fees_receipts')}
            className="p-2 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-300/80 font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Receipt className="w-4 h-4 text-amber-700" />
            <span className="text-sm">فیس رسیدیں</span>
          </button>

          <button
            onClick={() => onNavigate('mehr_calculator')}
            className="p-2 rounded-lg bg-sky-50/80 hover:bg-sky-100 text-sky-950 border border-sky-300/80 font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Coins className="w-4 h-4 text-sky-700" />
            <span className="text-sm">مہر کیلکولیٹر</span>
          </button>

          <button
            onClick={() => onNavigate('affidavit_module')}
            className="p-2 rounded-lg bg-teal-50/80 hover:bg-teal-100 text-teal-950 border border-teal-300/80 font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <FileText className="w-4 h-4 text-teal-700" />
            <span className="text-sm">بیان حلفی</span>
          </button>

          <button
            onClick={() => onNavigate('islamic_library')}
            className="p-2 rounded-lg bg-purple-50/80 hover:bg-purple-100 text-purple-950 border border-purple-300/80 font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-purple-700" />
            <span className="text-sm">کتب خانہ</span>
          </button>
        </div>
      </div>

      {/* 3. LIGHTWEIGHT SHARIAH RATES & FINANCIAL STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="bg-amber-50/70 border border-amber-300/80 p-2.5 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-amber-900 font-header-urdu block">
              مہرِ فاطمی شرعی ریٹ (52.5 تولہ چاندی)
            </span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-emerald-950">
              روپے {mehrFatimiAmount.toLocaleString()} /-
            </div>
            <span className="text-[11px] text-neutral-600 block">
              خالص چاندی: روپے {silverRate.toLocaleString()} فی تولہ
            </span>
          </div>
          <Coins className="w-6 h-6 text-amber-600 opacity-80 shrink-0" />
        </div>

        <div className="bg-emerald-50/70 border border-emerald-300/80 p-2.5 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-emerald-900 font-header-urdu block">
              خالص سونا (24K Gold فی تولہ ریٹ)
            </span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-emerald-950">
              روپے {gold24kRate.toLocaleString()} /-
            </div>
            <span className="text-[11px] text-neutral-600 block">
              صرافہ مارکیٹ مستند ریٹ فی تولہ
            </span>
          </div>
          <Award className="w-6 h-6 text-emerald-700 opacity-80 shrink-0" />
        </div>

        <div className="bg-sky-50/70 border border-sky-300/80 p-2.5 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-sky-900 font-header-urdu block">
              مجموعی وصول شدہ فیس
            </span>
            <div className="text-base sm:text-lg font-mono font-extrabold text-sky-950">
              روپے {totalFeeSum.toLocaleString()} /-
            </div>
            <span className="text-[11px] text-neutral-600 block">
              کل رسیدیں: {fees.length} واؤچرز
            </span>
          </div>
          <Receipt className="w-6 h-6 text-sky-700 opacity-80 shrink-0" />
        </div>
      </div>

      {/* 4. COMPACT, LIGHTWEIGHT & AIRY STAT CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {/* Card 1: Nikah */}
        <div
          onClick={() => onNavigate('nikah_register')}
          className="cursor-pointer bg-white rounded-xl border border-emerald-200 p-3 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-emerald-800 text-white">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
              فعال
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-emerald-950">
              {totalNikah}
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              کل نکاح رجسٹرڈ
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              اس ماہ: {currentMonthNikah} نکاح
            </p>
          </div>
        </div>

        {/* Card 2: Talaq */}
        <div
          onClick={() => onNavigate('talaq_module')}
          className="cursor-pointer bg-white rounded-xl border border-rose-200 p-3 shadow-2xs hover:border-rose-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-rose-700 text-white">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              کونسل
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-rose-950">
              {totalTalaq}
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              طلاق ریکارڈز و نوٹسز
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              یونین کونسل کارروائی
            </p>
          </div>
        </div>

        {/* Card 3: Khula */}
        <div
          onClick={() => onNavigate('khula_module')}
          className="cursor-pointer bg-white rounded-xl border border-blue-200 p-3 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-blue-700 text-white">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              کورٹ
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-blue-950">
              {totalKhula}
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              خلع و عدالتی ڈگریاں
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              مصدقہ احکامات
            </p>
          </div>
        </div>

        {/* Card 4: Mehr Pending */}
        <div
          onClick={() => onNavigate('mehr_records')}
          className="cursor-pointer bg-white rounded-xl border border-amber-200 p-3 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-amber-600 text-white font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono">
              مؤجل
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-extrabold text-emerald-950">
              روپے {(pendingMehrSum / 1000).toFixed(0)}k
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              حق مہر بقایا جات
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              باقی شرعی واجبات
            </p>
          </div>
        </div>

        {/* Card 5: Affidavits */}
        <div
          onClick={() => onNavigate('affidavit_module')}
          className="cursor-pointer bg-white rounded-xl border border-teal-200 p-3 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-teal-700 text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
              مصدقہ
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-teal-950">
              {totalAffidavits}
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              حلفی بیانات (Affidavits)
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              مجرد و رضامندی اقرار نامے
            </p>
          </div>
        </div>

        {/* Card 6: Stamps */}
        <div
          onClick={() => onNavigate('stamp_module')}
          className="cursor-pointer bg-white rounded-xl border border-neutral-200 p-3 shadow-2xs hover:border-neutral-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-neutral-700 text-white">
              <Stamp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
              دستیاب
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-neutral-900">
              {totalStamps}
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              اسٹامپ پیپرز رجسٹر
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              100 تا 1200 روپے ویلیو
            </p>
          </div>
        </div>

        {/* Card 7: Documents */}
        <div
          onClick={() => onNavigate('all_documents')}
          className="cursor-pointer bg-white rounded-xl border border-indigo-200 p-3 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-indigo-700 text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
              آرکائیو
            </span>
          </div>
          <div>
            <div className="text-2xl font-mono font-extrabold text-indigo-950">
              {totalDocs}
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              کل قانونی دستاویزات
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              محفوظ دفتری ریکارڈ
            </p>
          </div>
        </div>

        {/* Card 8: Fees */}
        <div
          onClick={() => onNavigate('fees_receipts')}
          className="cursor-pointer bg-white rounded-xl border border-amber-200 p-3 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all space-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-amber-600 text-white">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono">
              {fees.length} رسیدیں
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-extrabold text-emerald-950">
              روپے {(totalFeeSum / 1000).toFixed(0)}k
            </div>
            <h4 className="font-header-urdu font-bold text-sm text-neutral-800">
              رسیدات و آمدنی
            </h4>
            <p className="text-xs text-neutral-500 font-header-urdu">
              باضابطہ واؤچرز
            </p>
          </div>
        </div>
      </div>

      {/* 5. CHARTS & RECENT NIKAHS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-header-urdu font-bold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>ماہانہ نکاح و قانونی کارروائی رجحان (2026ء)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-header-urdu">
                ماہانہ بنیاد پر نکاح، طلاق و خلع ریکارڈز
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-800"></span>
                <span>نکاح</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-600"></span>
                <span>طلاق/خلع</span>
              </span>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="pt-1">
            <div className="h-44 flex items-end justify-between gap-2 px-1">
              {monthlyData.map((d, idx) => {
                const nikahHeight = (d.nikah / maxNikahVal) * 100;
                const talaqKhulaVal = d.talaq + d.khula;
                const talaqHeight = (talaqKhulaVal / maxNikahVal) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-34">
                      {/* Nikah Bar */}
                      <div
                        style={{ height: `${Math.max(12, nikahHeight)}%` }}
                        className="w-4 sm:w-6 bg-emerald-800 hover:bg-emerald-900 rounded-t-sm transition-all relative cursor-pointer"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-950 text-white text-[10px] font-mono px-1 rounded transition-opacity whitespace-nowrap">
                          {d.nikah}
                        </span>
                      </div>

                      {/* Talaq/Khula Bar */}
                      <div
                        style={{ height: `${Math.max(4, talaqHeight)}%` }}
                        className="w-2 sm:w-2.5 bg-rose-600 hover:bg-rose-700 rounded-t-xs transition-all relative cursor-pointer"
                      >
                        {talaqKhulaVal > 0 && (
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-950 text-white text-[10px] font-mono px-1 rounded transition-opacity whitespace-nowrap">
                            {talaqKhulaVal}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-neutral-600 whitespace-nowrap">
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-xs">
            <div className="bg-neutral-50 p-2 rounded-lg text-center">
              <span className="text-neutral-500 block text-xs">اوسط ماہانہ نکاح:</span>
              <strong className="font-mono text-emerald-900 text-sm">15.2 اندراجات</strong>
            </div>
            <div className="bg-neutral-50 p-2 rounded-lg text-center">
              <span className="text-neutral-500 block text-xs">کامیاب تصفیہ:</span>
              <strong className="font-mono text-emerald-900 text-sm">96.8%</strong>
            </div>
            <div className="bg-neutral-50 p-2 rounded-lg text-center">
              <span className="text-neutral-500 block text-xs">مالی وصولی:</span>
              <strong className="font-mono text-emerald-900 text-sm">روپے 1.23M</strong>
            </div>
          </div>
        </div>

        {/* Recent Audit & Activity Stream */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-3.5 sm:p-4 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b pb-1.5">
              <h3 className="font-header-urdu font-bold text-sm sm:text-base text-emerald-950 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>حالیہ دفتری سرگرمیاں</span>
              </h3>
              <button
                onClick={() => onNavigate('audit_logs')}
                className="text-xs text-emerald-800 hover:underline font-semibold font-header-urdu"
              >
                تمام دیکھیں
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                    <span className="font-bold text-emerald-900">{log.userName.split(' ')[0]}</span>
                    <span>
                      {new Date(log.timestamp).toLocaleTimeString('ur-PK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="font-medium text-neutral-800 line-clamp-1 font-header-urdu text-xs">
                    {log.entityDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1.5 border-t border-neutral-100">
            <div className="bg-emerald-50/80 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-header-urdu text-xs">تمام سرگرمیاں باقاعدہ انکرپٹڈ سیکیورٹی لاگ میں محفوظ ہیں۔</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
