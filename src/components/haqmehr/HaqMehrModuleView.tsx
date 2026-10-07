import React, { useState, useEffect } from 'react';
import {
  Coins,
  RefreshCw,
  Lock,
  Unlock,
  Calculator,
  ArrowRight,
  Receipt,
  FileCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Printer,
} from 'lucide-react';
import {
  MetalRateData,
  MetalType,
  NikahRecord,
  PaymentStatus,
  User,
} from '../../types';
import {
  calculateMetalHaqMehrValue,
  calculateTotalTola,
  DEFAULT_RATES,
  fetchLiveMetalRates,
  getRatePerTola,
  TOLA_TO_GRAMS,
  TOLA_TO_MASHA,
} from '../../services/metalRates';
import { storageService } from '../../services/storage';

interface HaqMehrModuleViewProps {
  user: User;
  onOpenPrint: (docType: 'haqmehr' | 'nikah', record: any) => void;
  activeTab?: 'calculator' | 'records' | 'pending';
}

export const HaqMehrModuleView: React.FC<HaqMehrModuleViewProps> = ({
  user,
  onOpenPrint,
  activeTab = 'calculator',
}) => {
  const [tab, setTab] = useState<'calculator' | 'records' | 'pending'>(activeTab);
  const [rates, setRates] = useState<MetalRateData>(DEFAULT_RATES);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  // Calculator State
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('24K سونا');
  const [tola, setTola] = useState<number>(2);
  const [masha, setMasha] = useState<number>(7.5);
  const [ratti, setRatti] = useState<number>(0);
  const [grams, setGrams] = useState<number>(0);
  const [manualRate, setManualRate] = useState<number | undefined>(undefined);
  const [useManualRate, setUseManualRate] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  // Nikah records for mehr tracking
  const [nikahs, setNikahs] = useState<NikahRecord[]>([]);
  const [selectedNikahForPayment, setSelectedNikahForPayment] = useState<NikahRecord | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);

  useEffect(() => {
    loadData();
    refreshRates();
  }, []);

  const loadData = () => {
    const list = storageService.getNikahs();
    setNikahs(list);
  };

  const refreshRates = async () => {
    setIsFetchingRates(true);
    setRateError(null);
    try {
      const res = await fetchLiveMetalRates();
      setRates(res.rates);
      if (res.error) {
        setRateError(res.error);
      }
    } catch {
      setRateError('Live rate unavailable — Enter Manual Rate');
    } finally {
      setIsFetchingRates(false);
    }
  };

  // Calculations
  const calculatedTola = calculateTotalTola(tola, masha, ratti, grams);
  const currentRatePerTola = useManualRate && manualRate && manualRate > 0
    ? manualRate
    : getRatePerTola(selectedMetal, rates);

  const { totalValue: calculatedHaqMehrValue } = calculateMetalHaqMehrValue(
    selectedMetal,
    calculatedTola,
    rates,
    useManualRate ? manualRate : undefined
  );

  // Record payment against pending Mehr
  const handleRecordPayment = (record: NikahRecord) => {
    if (paymentAmountInput <= 0) return;

    const newAmountReceived = (record.mehr.amountReceived || 0) + Number(paymentAmountInput);
    const newRemaining = Math.max(0, record.mehr.totalAgreedAmount - newAmountReceived);
    const newStatus: PaymentStatus =
      newRemaining === 0 ? 'مکمل وصول' : 'جزوی وصول';

    const updated: NikahRecord = {
      ...record,
      mehr: {
        ...record.mehr,
        amountReceived: newAmountReceived,
        remainingAmount: newRemaining,
        paymentStatus: newStatus,
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNumber: 'RCPT-MEHR-' + Date.now().toString().slice(-5),
      },
      updatedAt: new Date().toISOString(),
      updatedBy: user.name,
    };

    const updatedList = nikahs.map((n) => (n.id === record.id ? updated : n));
    storageService.saveNikahs(updatedList);
    setNikahs(updatedList);

    // Also record fee / payment receipt
    const newReceipt = {
      id: 'fee-mehr-' + Date.now(),
      receiptNo: updated.mehr.receiptNumber || 'RCPT-MEHR',
      service: 'حق مہر مشاورت و ریکارڈ' as const,
      personName: record.groom.fullName,
      cnic: record.groom.cnic,
      mobile: record.groom.mobile,
      amount: paymentAmountInput,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'نقد' as const,
      status: 'وصول شدہ' as const,
      notes: `حق مہر کی ادائیگی برائے ${record.bride.fullName}۔ بقیہ مہر: روپے ${newRemaining.toLocaleString()}`,
      createdAt: new Date().toISOString(),
      createdBy: user.name,
    };
    const fees = storageService.getFees();
    fees.unshift(newReceipt);
    storageService.saveFees(fees);

    storageService.logAction(
      'UPDATE',
      'NIKAH',
      record.id,
      `حق مہر وصولی کا اندراج: روپے ${paymentAmountInput.toLocaleString()} موصول ہوئے`,
      user
    );

    setSelectedNikahForPayment(null);
    setPaymentAmountInput(0);
  };

  const pendingMehrRecords = nikahs.filter(
    (n) => n.mehr.remainingAmount > 0 || n.mehr.paymentStatus !== 'مکمل وصول'
  );

  return (
    <div className="space-y-4 font-urdu">
      {/* Top Heading Box - Royal Sapphire & Gold Typography Arch */}
      <div className="bg-linear-to-r from-[#0c2340] via-[#1a365d] to-[#0f4c81] p-3 sm:p-4 rounded-2xl border-2 border-amber-400/50 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-300 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-white flex items-center gap-1.5 leading-tight">
                <span>حق مہر و لائیو صرافہ مارکیٹ ریٹ مینجمنٹ</span>
              </h2>
            </div>
            <p className="text-[11px] text-cyan-200/90 font-header-urdu mt-0.5">
              شرعی حق مہر، لائیو سونا و چاندی ریٹ کیلکولیٹر اور بقایا جات کی ڈیجیٹل مانیٹرنگ
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center flex-wrap gap-1 p-1 bg-white/10 rounded-xl border border-white/20 relative z-10">
          <button
            onClick={() => setTab('calculator')}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-header-urdu transition-all ${
              tab === 'calculator'
                ? 'bg-linear-to-r from-amber-400 to-amber-300 text-slate-950 shadow-xs'
                : 'text-cyan-100 hover:text-white'
            }`}
          >
            لائیو ریٹ و کیلکولیٹر
          </button>
          <button
            onClick={() => setTab('records')}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-header-urdu transition-all ${
              tab === 'records'
                ? 'bg-linear-to-r from-amber-400 to-amber-300 text-slate-950 shadow-xs'
                : 'text-cyan-100 hover:text-white'
            }`}
          >
            حق مہر رجسٹر ({nikahs.length})
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-bold font-header-urdu transition-all ${
              tab === 'pending'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-cyan-100 hover:text-white'
            }`}
          >
            بقایا جات مہر ({pendingMehrRecords.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE CALCULATOR */}
      {tab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Calculator (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Live Rate Header Card */}
            <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-amber-950 font-urdu">
                    صرافہ مارکیٹ ریٹ کارڈ
                  </span>
                  <span className="text-[10px] text-amber-800 font-mono">
                    ({rates.isLive ? 'براہِ راست اپڈیٹ' : 'تخمینہ مارکیٹ'})
                  </span>
                </div>

                <button
                  onClick={refreshRates}
                  disabled={isFetchingRates}
                  className="flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRates ? 'animate-spin' : ''}`} />
                  <span className="font-urdu">تازہ ترین ریٹ (Refresh)</span>
                </button>
              </div>

              {rateError && (
                <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-900 bg-amber-100/90 px-3 py-1.5 rounded border border-amber-300 font-urdu">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>{rateError}</span>
                </div>
              )}

              {/* Current Market Rates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-amber-200">
                <div className="bg-white/80 p-2 rounded border border-amber-200 text-center">
                  <span className="text-[11px] font-urdu text-neutral-600 block">24K سونا (فی تولہ)</span>
                  <span className="text-sm font-bold font-mono text-amber-950">
                    روپے {rates.gold24KPerTola.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-amber-200 text-center">
                  <span className="text-[11px] font-urdu text-neutral-600 block">22K سونا (فی تولہ)</span>
                  <span className="text-sm font-bold font-mono text-amber-950">
                    روپے {rates.gold22KPerTola.toLocaleString()}
                  </span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-amber-200 text-center">
                  <span className="text-[11px] font-urdu text-neutral-600 block">خالص چاندی (فی تولہ)</span>
                  <span className="text-sm font-bold font-mono text-teal-900">
                    روپے {rates.silverPurePerTola.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-neutral-500 flex items-center justify-between font-mono">
                <span>ماخذ: {rates.source}</span>
                <span>آخری تجدید: {new Date(rates.lastUpdated).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Weight & Formula Entry */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold font-urdu text-neutral-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>وزن و دھات کا شرعی و حسابی انتخاب</span>
              </h3>

              {/* Metal Selector */}
              <div>
                <label className="block text-xs font-urdu font-medium text-neutral-700 mb-1.5">
                  قیمتی دھات / مہر کی قسم منتخب کریں:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(
                    [
                      '24K سونا',
                      '22K سونا',
                      '21K سونا',
                      '18K سونا',
                      'خالص چاندی',
                      'مارکیٹ چاندی',
                    ] as MetalType[]
                  ).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMetal(m)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-urdu transition-all border ${
                        selectedMetal === m
                          ? 'bg-emerald-800 text-white font-bold border-emerald-900 shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Inputs (Tola, Masha, Ratti, Gram) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50/70 p-3.5 rounded-lg border border-neutral-200">
                <div>
                  <label className="block text-xs font-urdu font-semibold text-neutral-800 mb-1">
                    تولہ (Tola):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={tola}
                    onChange={(e) => setTola(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-center text-sm font-bold border border-neutral-300 rounded p-1.5 bg-white focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-urdu font-semibold text-neutral-800 mb-1">
                    ماشہ (Masha):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11.99"
                    step="any"
                    value={masha}
                    onChange={(e) => setMasha(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-center text-sm font-bold border border-neutral-300 rounded p-1.5 bg-white focus:outline-emerald-800"
                  />
                  <span className="text-[10px] text-neutral-500 block text-center mt-0.5">
                    12 ماشہ = 1 تولہ
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-urdu font-semibold text-neutral-800 mb-1">
                    رتی (Ratti):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="7.99"
                    step="any"
                    value={ratti}
                    onChange={(e) => setRatti(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-center text-sm font-bold border border-neutral-300 rounded p-1.5 bg-white focus:outline-emerald-800"
                  />
                  <span className="text-[10px] text-neutral-500 block text-center mt-0.5">
                    8 رتی = 1 ماشہ
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-urdu font-semibold text-neutral-800 mb-1">
                    گرام (Grams):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={grams}
                    onChange={(e) => setGrams(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-center text-sm font-bold border border-neutral-300 rounded p-1.5 bg-white focus:outline-emerald-800"
                  />
                  <span className="text-[10px] text-neutral-500 block text-center mt-0.5">
                    11.66 گرام = 1 تولہ
                  </span>
                </div>
              </div>

              {/* Manual Rate Override Option */}
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-urdu font-medium text-neutral-800">
                    <input
                      type="checkbox"
                      checked={useManualRate}
                      onChange={(e) => setUseManualRate(e.target.checked)}
                      className="rounded text-emerald-800 focus:ring-emerald-800"
                    />
                    <span>دستی ریٹ درج کریں (Manual Rate Override)</span>
                  </label>

                  <span className="text-[11px] text-neutral-500 font-mono">
                    ریٹ فی تولہ: روپے {currentRatePerTola.toLocaleString()}
                  </span>
                </div>

                {useManualRate && (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="ریٹ فی تولہ درج کریں (روپے)"
                      value={manualRate || ''}
                      onChange={(e) => setManualRate(parseFloat(e.target.value) || undefined)}
                      className="flex-1 font-mono text-sm border border-amber-300 rounded p-2 bg-amber-50/40 focus:outline-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() => setManualRate(getRatePerTola(selectedMetal, rates))}
                      className="px-3 py-2 text-xs font-urdu bg-neutral-200 hover:bg-neutral-300 rounded text-neutral-700"
                    >
                      مارکیٹ ریٹ نقل کریں
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Calculation Result Card & Lock / Save (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border-2 border-emerald-900 bg-linear-to-b from-emerald-950 to-emerald-900 text-white p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Coins className="w-32 h-32" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-urdu text-amber-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    موجودہ اندازاً حق مہر
                  </span>

                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    className="flex items-center gap-1 text-[11px] font-urdu px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-100 transition-colors"
                    title="ریٹ لاک کریں تاکہ مستقبل میں قیمت بدلنے سے ریکارڈ تبدیل نہ ہو"
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>ریٹ بوقتِ نکاح مقفل (Locked)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-neutral-300" />
                        <span>لائیو ریٹ متحرک</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Big Total Value Display */}
                <div>
                  <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-amber-300 tabular-nums">
                    روپے {calculatedHaqMehrValue.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-200 font-urdu mt-1">
                    (تخمینہ مالیت برائے {calculatedTola} تولہ {selectedMetal})
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="bg-emerald-900/80 p-3 rounded-lg border border-emerald-800 text-xs font-urdu space-y-1.5 text-emerald-100">
                  <div className="flex justify-between">
                    <span>حساب کتاب فارمولا:</span>
                    <span className="font-mono text-amber-300">
                      {tola} + ({masha} / 12) = {calculatedTola} تولہ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>نافذ ریٹ فی تولہ:</span>
                    <span className="font-mono">روپے {currentRatePerTola.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وزن بمطابق گرام:</span>
                    <span className="font-mono">
                      {(calculatedTola * TOLA_TO_GRAMS).toFixed(2)} گرام
                    </span>
                  </div>
                </div>

                {/* Sunnah / Shariah Standard Info Box */}
                <div className="bg-amber-400/10 border border-amber-400/30 p-2.5 rounded text-[11px] font-urdu text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>مہر شرعی و مہر فاطمی رہنمائی:</span>
                  </div>
                  <p>
                    مہر فاطمی کا شرعی وزن 500 درہم یعنی تقریباً 131 تولہ 3 ماشہ (یا 52.5 تولہ چاندی) شمار کیا جاتا ہے۔ موجودہ چاندی ریٹ سے مہر فاطمی تقریباً 175,875 روپے بنتا ہے۔
                  </p>
                </div>

                <div className="text-[10px] text-emerald-300/80 font-urdu pt-1">
                  * ضروری انتباہ: یہ تخمینہ صرافہ مارکیٹ کے ریٹ کی بنیاد پر حسابی سہولت کے لیے ہے۔ یہ کوئی سرکاری قیمت نہیں ہے۔
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ALL MEHR RECORDS TABLE */}
      {tab === 'records' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-neutral-100 border-b font-urdu font-bold text-neutral-800">
                <tr>
                  <th className="p-3">نکاح نمبر</th>
                  <th className="p-3">دولہا / دلہن</th>
                  <th className="p-3">نوعیت و قسم مہر</th>
                  <th className="p-3">کل طے شدہ مہر</th>
                  <th className="p-3">معجل (ادا شدہ)</th>
                  <th className="p-3">مؤجل (بقایا)</th>
                  <th className="p-3">حیثیت ادائیگی</th>
                  <th className="p-3">ایکشن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-urdu">
                {nikahs.map((n) => (
                  <tr key={n.id} className="hover:bg-neutral-50/70">
                    <td className="p-3 font-mono font-bold text-neutral-900">
                      {n.registrationNo}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{n.groom.fullName}</div>
                      <div className="text-[11px] text-neutral-500">باہمراہ: {n.bride.fullName}</div>
                    </td>
                    <td className="p-3">
                      <div>{n.mehr.type}</div>
                      <div className="text-[11px] text-neutral-500">{n.mehr.nature}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-950">
                      روپے {n.mehr.totalAgreedAmount.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-emerald-800">
                      روپے {n.mehr.muajjalAmount.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-rose-800 font-semibold">
                      روپے {n.mehr.muakhkharAmount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          n.mehr.paymentStatus === 'مکمل وصول'
                            ? 'bg-emerald-100 text-emerald-900'
                            : n.mehr.paymentStatus === 'جزوی وصول'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {n.mehr.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onOpenPrint('haqmehr', n)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-medium"
                      >
                        <Printer className="w-3 h-3 text-neutral-600" />
                        <span>اقرار نامہ پرنٹ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PENDING MEHR & COLLECTION */}
      {tab === 'pending' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingMehrRecords.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {n.registrationNo} · {n.date}
                    </span>
                    <h4 className="font-urdu font-bold text-neutral-900 text-sm">
                      {n.groom.fullName} باہمراہ {n.bride.fullName}
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-urdu font-semibold">
                    باقی الذمہ
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-urdu bg-neutral-50 p-2.5 rounded">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">کل مہر:</span>
                    <span className="font-mono font-bold">
                      روپے {n.mehr.totalAgreedAmount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">ادا شدہ:</span>
                    <span className="font-mono text-emerald-800">
                      روپے {(n.mehr.amountReceived || n.mehr.muajjalAmount).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">بقیہ مہر:</span>
                    <span className="font-mono text-rose-800 font-bold">
                      روپے {(n.mehr.remainingAmount || n.mehr.muakhkharAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-neutral-500">
                    رابطہ دولہا: {n.groom.mobile}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedNikahForPayment(n);
                      setPaymentAmountInput(n.mehr.remainingAmount || n.mehr.muakhkharAmount);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-urdu font-semibold transition-colors"
                  >
                    وصولی کا اندراج کریں
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pendingMehrRecords.length === 0 && (
            <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-500 font-urdu">
              تمام حق مہر کے واجبات مکمل وصول شدہ ہیں۔ کوئی بقایا ریکارڈ نہیں ہے۔
            </div>
          )}
        </div>
      )}

      {/* Payment Entry Modal */}
      {selectedNikahForPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl text-right">
            <h3 className="font-urdu font-bold text-base text-emerald-950 border-b pb-2">
              حق مہر وصولی کا باضابطہ اندراج
            </h3>

            <div className="text-xs font-urdu space-y-1 text-neutral-700">
              <p>نکاح ریفرنس: <strong className="font-mono">{selectedNikahForPayment.registrationNo}</strong></p>
              <p>دولہا: <strong>{selectedNikahForPayment.groom.fullName}</strong></p>
              <p>دلہن: <strong>{selectedNikahForPayment.bride.fullName}</strong></p>
              <p>موجودہ بقایا رقم: <strong className="font-mono text-rose-800">روپے {(selectedNikahForPayment.mehr.remainingAmount || selectedNikahForPayment.mehr.muakhkharAmount).toLocaleString()}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-urdu font-medium text-neutral-800 mb-1">
                وصول شدہ رقم (روپے):
              </label>
              <input
                type="number"
                value={paymentAmountInput}
                onChange={(e) => setPaymentAmountInput(parseFloat(e.target.value) || 0)}
                className="w-full font-mono text-sm font-bold border border-emerald-300 rounded p-2 focus:outline-emerald-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedNikahForPayment(null)}
                className="px-3 py-1.5 rounded text-xs font-urdu text-neutral-600 hover:bg-neutral-100"
              >
                منسوخ
              </button>
              <button
                type="button"
                onClick={() => handleRecordPayment(selectedNikahForPayment)}
                className="px-4 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-urdu font-bold"
              >
                وصولی محفوظ کریں و رسید جاری کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
