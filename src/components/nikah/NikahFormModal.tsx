import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  User,
  Users,
  Coins,
  ShieldCheck,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Building2,
  FileText,
  Calculator,
} from 'lucide-react';
import {
  BrideRecord,
  GroomRecord,
  GuardianRecord,
  MetalType,
  NikahRecord,
  NikahStatus,
  PaymentStatus,
  User as AppUser,
  WakeelRecord,
  WitnessRecord,
} from '../../types';
import { calculateMetalHaqMehrValue, calculateTotalTola, DEFAULT_RATES } from '../../services/metalRates';
import { storageService } from '../../services/storage';

interface NikahFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (record: NikahRecord) => void;
  editRecord?: NikahRecord | null;
  currentUser: AppUser;
}

export const NikahFormModal: React.FC<NikahFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editRecord,
  currentUser,
}) => {
  const settings = storageService.getSettings();
  const stamps = storageService.getStamps().filter((s) => s.status === 'Unused');

  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState<Partial<NikahRecord>>(() => {
    if (editRecord) return editRecord;

    const currentYear = new Date().getFullYear();
    const count = storageService.getNikahs().length + 1;
    const generatedRegNo = `QZ-LHR-${currentYear}-${String(count).padStart(3, '0')}`;
    const generatedBookNo = `BK-14-PG-${String(count + 88).padStart(2, '0')}`;

    return {
      registrationNo: generatedRegNo,
      nikahNamaNo: generatedBookNo,
      date: new Date().toISOString().split('T')[0],
      hijriDate: 'ربیع الثانی 1448ھ',
      time: '08:00 شام',
      place: 'جامع مسجد دارالقضاء، ماڈل ٹاؤن، لاہور',
      unionCouncil: 'یونین کونسل 118',
      tehsil: 'ماڈل ٹاؤن',
      district: 'لاہور',
      registrarName: settings.qaziName,
      registrarLicenseNo: settings.qaziRegistrationNo,
      status: 'رجسٹرڈ',
      groom: {
        fullName: '',
        fatherName: '',
        cnic: '',
        dob: '1998-01-01',
        age: 28,
        religion: 'اسلام',
        maritalStatus: 'کنوارا',
        mobile: '',
        address: '',
        city: 'لاہور',
        tehsil: 'ماڈل ٹاؤن',
        district: 'لاہور',
        occupation: '',
        nationality: 'پاکستانی',
      },
      bride: {
        fullName: '',
        fatherName: '',
        cnic: '',
        dob: '2001-01-01',
        age: 25,
        religion: 'اسلام',
        maritalStatus: 'کنواری',
        mobile: '',
        address: '',
        city: 'لاہور',
        tehsil: 'ماڈل ٹاؤن',
        district: 'لاہور',
        occupation: '',
        nationality: 'پاکستانی',
      },
      groomGuardian: {
        name: '',
        fatherName: '',
        cnic: '',
        mobile: '',
        address: '',
        relationship: 'والد',
      },
      brideGuardian: {
        name: '',
        fatherName: '',
        cnic: '',
        mobile: '',
        address: '',
        relationship: 'والد',
      },
      witnesses: [
        {
          id: 'wit-' + Date.now() + '-1',
          name: '',
          fatherName: '',
          cnic: '',
          mobile: '',
          address: '',
          verified: true,
        },
        {
          id: 'wit-' + Date.now() + '-2',
          name: '',
          fatherName: '',
          cnic: '',
          mobile: '',
          address: '',
          verified: true,
        },
      ],
      wakeelBride: {
        name: '',
        fatherName: '',
        cnic: '',
        mobile: '',
        address: '',
        representing: 'دلہن',
        appointmentDate: new Date().toISOString().split('T')[0],
      },
      mehr: {
        type: 'سونا',
        nature: 'معجل (فوری)',
        totalAgreedAmount: 500000,
        muajjalAmount: 500000,
        muakhkharAmount: 0,
        metalType: '24K سونا',
        tola: 1,
        masha: 9,
        ratti: 0,
        gram: 0,
        totalTolaEquivalent: 1.75,
        ratePerTolaAtRegistration: 283500,
        rateLocked: true,
        paymentStatus: 'مکمل وصول',
        amountReceived: 500000,
        remainingAmount: 0,
        paymentMethod: 'نقد',
      },
      stampPaperNo: stamps.length > 0 ? stamps[0].stampNo : '',
      specialConditions: 'شرعی حقوق و فرائض کی باہمی پابندی اور نان و نفقہ کی بروقت فراہمی۔',
    };
  });

  if (!isOpen) return null;

  // Add witness handler
  const handleAddWitness = () => {
    const updated = [...(formData.witnesses || [])];
    updated.push({
      id: 'wit-' + Date.now(),
      name: '',
      fatherName: '',
      cnic: '',
      mobile: '',
      address: '',
      verified: true,
    });
    setFormData({ ...formData, witnesses: updated });
  };

  // Remove witness handler
  const handleRemoveWitness = (index: number) => {
    if ((formData.witnesses?.length || 0) <= 2) return; // Keep min 2 witnesses
    const updated = formData.witnesses?.filter((_, idx) => idx !== index);
    setFormData({ ...formData, witnesses: updated });
  };

  // Update Groom
  const handleGroomChange = (field: keyof GroomRecord, value: any) => {
    setFormData({
      ...formData,
      groom: { ...formData.groom!, [field]: value },
    });
  };

  // Update Bride
  const handleBrideChange = (field: keyof BrideRecord, value: any) => {
    setFormData({
      ...formData,
      bride: { ...formData.bride!, [field]: value },
    });
  };

  // Update Mehr
  const handleMehrAmountChange = (total: number, muajjal: number) => {
    const remaining = Math.max(0, total - muajjal);
    const status: PaymentStatus =
      remaining === 0 ? 'مکمل وصول' : muajjal > 0 ? 'جزوی وصول' : 'وصول نہیں ہوا';

    setFormData({
      ...formData,
      mehr: {
        ...formData.mehr!,
        totalAgreedAmount: total,
        muajjalAmount: muajjal,
        muakhkharAmount: remaining,
        amountReceived: muajjal,
        remainingAmount: remaining,
        paymentStatus: status,
      },
    });
  };

  // Save Record
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.groom?.fullName || !formData.bride?.fullName) {
      alert('براہ کرم دولہا اور دلہن کا نام لازمی درج فرمائیں۔');
      return;
    }

    const now = new Date().toISOString();
    const finalRecord: NikahRecord = {
      ...(formData as NikahRecord),
      id: editRecord?.id || 'nkh-' + Date.now(),
      createdAt: editRecord?.createdAt || now,
      updatedAt: now,
      createdBy: editRecord?.createdBy || currentUser.name,
      updatedBy: currentUser.name,
    };

    // If a stamp was chosen, mark it as used
    if (finalRecord.stampPaperNo) {
      const allStamps = storageService.getStamps();
      const updatedStamps = allStamps.map((st) =>
        st.stampNo === finalRecord.stampPaperNo
          ? {
              ...st,
              status: 'Used' as const,
              usageDate: finalRecord.date,
              relatedCase: finalRecord.registrationNo,
              personName: finalRecord.groom.fullName,
              cnic: finalRecord.groom.cnic,
            }
          : st
      );
      storageService.saveStamps(updatedStamps);
    }

    onSaved(finalRecord);
    onClose();
  };

  const steps = [
    { num: 1, label: 'بنیادی کوائف و رجسٹر' },
    { num: 2, label: 'کوائف دولہا' },
    { num: 3, label: 'کوائف دلہن' },
    { num: 4, label: 'سرپرست و گواہان' },
    { num: 5, label: 'حق مہر و شرائط' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-urdu">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {editRecord ? 'ترمیم نکاح نامہ و رجسٹر ریکارڈ' : 'نیا ڈیجیٹل اندراج نکاح و رجسٹر'}
              </h2>
              <p className="text-xs text-emerald-300">
                دفتر قاضی مولانا حافظ محمد شاہد عطاری مدنی (نکاح خواں و رجسٹرار)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-neutral-100 px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between overflow-x-auto text-xs">
          {steps.map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => setActiveStep(st.num)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                activeStep === st.num
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/20 text-center font-mono text-[10px] flex items-center justify-center">
                {st.num}
              </span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body Scrollable Area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-neutral-800">
          {/* STEP 1: BASIC INFORMATION */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 border-b pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>بنیادی دفتری کوائف و یونین کونسل دائرہ اختیار</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    نکاح رجسٹریشن نمبر:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNo || ''}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2 focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    نکاح رجسٹر جلد و صفحہ نمبر:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nikahNamaNo || ''}
                    onChange={(e) => setFormData({ ...formData, nikahNamaNo: e.target.value })}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2 focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    حالتِ اندراج (Status):
                  </label>
                  <select
                    value={formData.status || 'رجسٹرڈ'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as NikahStatus })}
                    className="w-full text-xs border border-neutral-300 rounded p-2 focus:ring-1 focus:ring-emerald-800 bg-white"
                  >
                    <option value="رجسٹرڈ">رجسٹرڈ</option>
                    <option value="زیرِ کارروائی">زیرِ کارروائی</option>
                    <option value="تصدیق شدہ">تصدیق شدہ</option>
                    <option value="منسوخ">منسوخ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">عیسوی تاریخ نکاح:</label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">ہجری تاریخ:</label>
                  <input
                    type="text"
                    value={formData.hijriDate || ''}
                    onChange={(e) => setFormData({ ...formData, hijriDate: e.target.value })}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">وقتِ نکاح:</label>
                  <input
                    type="text"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">اسٹامپ پیپر نمبر:</label>
                  <input
                    type="text"
                    value={formData.stampPaperNo || ''}
                    onChange={(e) => setFormData({ ...formData, stampPaperNo: e.target.value })}
                    placeholder="مثال: PB-STP-2026-90412"
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">یونین کونسل:</label>
                  <input
                    type="text"
                    value={formData.unionCouncil || ''}
                    onChange={(e) => setFormData({ ...formData, unionCouncil: e.target.value })}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">تحصیل:</label>
                  <input
                    type="text"
                    value={formData.tehsil || ''}
                    onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">ضلع:</label>
                  <input
                    type="text"
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-neutral-700">
                  مقامِ تقریب / پتہ نکاح خوانی:
                </label>
                <input
                  type="text"
                  value={formData.place || ''}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  className="w-full text-xs border border-neutral-300 rounded p-2"
                />
              </div>
            </div>
          )}

          {/* STEP 2: GROOM FORM */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 border-b pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>کوائف دولہا (Groom Particulars)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">نام دولہا:</label>
                  <input
                    type="text"
                    required
                    value={formData.groom?.fullName || ''}
                    onChange={(e) => handleGroomChange('fullName', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">ولدیت:</label>
                  <input
                    type="text"
                    required
                    value={formData.groom?.fatherName || ''}
                    onChange={(e) => handleGroomChange('fatherName', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    شناختی کارڈ نمبر (CNIC):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.groom?.cnic || ''}
                    onChange={(e) => handleGroomChange('cnic', e.target.value)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">تاریخ پیدائش:</label>
                  <input
                    type="date"
                    value={formData.groom?.dob || ''}
                    onChange={(e) => handleGroomChange('dob', e.target.value)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">عمر (سال):</label>
                  <input
                    type="number"
                    value={formData.groom?.age || ''}
                    onChange={(e) => handleGroomChange('age', parseInt(e.target.value) || 0)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">موبائل نمبر:</label>
                  <input
                    type="text"
                    value={formData.groom?.mobile || ''}
                    onChange={(e) => handleGroomChange('mobile', e.target.value)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">ازدواجی حیثیت:</label>
                  <select
                    value={formData.groom?.maritalStatus || 'کنوارا'}
                    onChange={(e) => handleGroomChange('maritalStatus', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2 bg-white"
                  >
                    <option value="کنوارا">کنوارا</option>
                    <option value="شادی شدہ (پہلی بیوی موجود)">شادی شدہ (پہلی بیوی موجود)</option>
                    <option value="طلاق یافتہ">طلاق یافتہ</option>
                    <option value="رنڈوا">رنڈوا</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">پیشہ / روزگار:</label>
                  <input
                    type="text"
                    value={formData.groom?.occupation || ''}
                    onChange={(e) => handleGroomChange('occupation', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">قومیت و مذہب:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="قومیت"
                      value={formData.groom?.nationality || 'پاکستانی'}
                      onChange={(e) => handleGroomChange('nationality', e.target.value)}
                      className="w-1/2 text-xs border border-neutral-300 rounded p-2"
                    />
                    <input
                      type="text"
                      placeholder="مذہب"
                      value={formData.groom?.religion || 'اسلام'}
                      onChange={(e) => handleGroomChange('religion', e.target.value)}
                      className="w-1/2 text-xs border border-neutral-300 rounded p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-neutral-700">مکمل رہائشی پتہ:</label>
                <input
                  type="text"
                  value={formData.groom?.address || ''}
                  onChange={(e) => handleGroomChange('address', e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded p-2"
                />
              </div>
            </div>
          )}

          {/* STEP 3: BRIDE FORM */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 border-b pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-700" />
                <span>کوائف دلہن (Bride Particulars)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">نام دلہن:</label>
                  <input
                    type="text"
                    required
                    value={formData.bride?.fullName || ''}
                    onChange={(e) => handleBrideChange('fullName', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">ولدیت:</label>
                  <input
                    type="text"
                    required
                    value={formData.bride?.fatherName || ''}
                    onChange={(e) => handleBrideChange('fatherName', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">
                    شناختی کارڈ نمبر (CNIC):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.bride?.cnic || ''}
                    onChange={(e) => handleBrideChange('cnic', e.target.value)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">تاریخ پیدائش:</label>
                  <input
                    type="date"
                    value={formData.bride?.dob || ''}
                    onChange={(e) => handleBrideChange('dob', e.target.value)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">عمر (سال):</label>
                  <input
                    type="number"
                    value={formData.bride?.age || ''}
                    onChange={(e) => handleBrideChange('age', parseInt(e.target.value) || 0)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">موبائل نمبر:</label>
                  <input
                    type="text"
                    value={formData.bride?.mobile || ''}
                    onChange={(e) => handleBrideChange('mobile', e.target.value)}
                    className="w-full font-mono text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">ازدواجی حیثیت:</label>
                  <select
                    value={formData.bride?.maritalStatus || 'کنواری'}
                    onChange={(e) => handleBrideChange('maritalStatus', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2 bg-white"
                  >
                    <option value="کنواری">کنواری</option>
                    <option value="بیوہ">بیوہ</option>
                    <option value="طلاق یافتہ">طلاق یافتہ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">پیشہ / روزگار:</label>
                  <input
                    type="text"
                    value={formData.bride?.occupation || ''}
                    onChange={(e) => handleBrideChange('occupation', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">مکمل رہائشی پتہ:</label>
                  <input
                    type="text"
                    value={formData.bride?.address || ''}
                    onChange={(e) => handleBrideChange('address', e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GUARDIANS & WITNESSES */}
          {activeStep === 4 && (
            <div className="space-y-6">
              {/* Witnesses List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>گواہانِ عقد (کم از کم 2 گواہان ضروری ہیں)</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleAddWitness}
                    className="flex items-center gap-1 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>مزید گواہ شامل کریں</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.witnesses?.map((w, index) => (
                    <div
                      key={w.id || index}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between text-neutral-700 font-semibold">
                        <span>گواہ نمبر {index + 1}</span>
                        {formData.witnesses!.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWitness(index)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                            title="گواہ حذف کریں"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="نام گواہ"
                          required
                          value={w.name}
                          onChange={(e) => {
                            const updated = [...formData.witnesses!];
                            updated[index].name = e.target.value;
                            setFormData({ ...formData, witnesses: updated });
                          }}
                          className="text-xs border rounded p-1.5 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="ولدیت"
                          value={w.fatherName}
                          onChange={(e) => {
                            const updated = [...formData.witnesses!];
                            updated[index].fatherName = e.target.value;
                            setFormData({ ...formData, witnesses: updated });
                          }}
                          className="text-xs border rounded p-1.5 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="شناختی کارڈ (CNIC)"
                          required
                          value={w.cnic}
                          onChange={(e) => {
                            const updated = [...formData.witnesses!];
                            updated[index].cnic = e.target.value;
                            setFormData({ ...formData, witnesses: updated });
                          }}
                          className="font-mono text-xs border rounded p-1.5 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="موبائل رابطہ"
                          value={w.mobile}
                          onChange={(e) => {
                            const updated = [...formData.witnesses!];
                            updated[index].mobile = e.target.value;
                            setFormData({ ...formData, witnesses: updated });
                          }}
                          className="font-mono text-xs border rounded p-1.5 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wakeel Section */}
              <div className="space-y-3 pt-3 border-t">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>وکیلِ شرعی (دلہن / دولہا کا نمائندہ)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <input
                    type="text"
                    placeholder="نام وکیل"
                    value={formData.wakeelBride?.name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wakeelBride: { ...formData.wakeelBride!, name: e.target.value },
                      })
                    }
                    className="text-xs border rounded p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="ولدیت وکیل"
                    value={formData.wakeelBride?.fatherName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wakeelBride: { ...formData.wakeelBride!, fatherName: e.target.value },
                      })
                    }
                    className="text-xs border rounded p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="شناختی کارڈ وکیل"
                    value={formData.wakeelBride?.cnic || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wakeelBride: { ...formData.wakeelBride!, cnic: e.target.value },
                      })
                    }
                    className="font-mono text-xs border rounded p-1.5 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="رابطہ نمبر"
                    value={formData.wakeelBride?.mobile || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wakeelBride: { ...formData.wakeelBride!, mobile: e.target.value },
                      })
                    }
                    className="font-mono text-xs border rounded p-1.5 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: HAQ MEHR & SPECIAL CONDITIONS */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 border-b pb-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>حق مہر کا تعین، ادائیگی کی نوعیت اور خصوصی شرائط</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700">قسمِ حق مہر:</label>
                  <select
                    value={formData.mehr?.type || 'سونا'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mehr: { ...formData.mehr!, type: e.target.value as any },
                      })
                    }
                    className="w-full text-xs border rounded p-2 bg-white"
                  >
                    <option value="نقد رقم">نقد رقم</option>
                    <option value="سونا">سونا</option>
                    <option value="چاندی">چاندی</option>
                    <option value="جائیداد">جائیداد</option>
                    <option value="مخلوط">مخلوط</option>
                    <option value="دیگر">دیگر</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">نوعیت ادائیگی:</label>
                  <select
                    value={formData.mehr?.nature || 'معجل (فوری)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mehr: { ...formData.mehr!, nature: e.target.value as any },
                      })
                    }
                    className="w-full text-xs border rounded p-2 bg-white"
                  >
                    <option value="معجل (فوری)">معجل (فوری)</option>
                    <option value="مؤجل (مؤخر)">مؤجل (مؤخر)</option>
                    <option value="کچھ معجل کچھ مؤجل">کچھ معجل کچھ مؤجل</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-neutral-700">طریقہ ادائیگی:</label>
                  <select
                    value={formData.mehr?.paymentMethod || 'نقد'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mehr: { ...formData.mehr!, paymentMethod: e.target.value as any },
                      })
                    }
                    className="w-full text-xs border rounded p-2 bg-white"
                  >
                    <option value="نقد">نقد</option>
                    <option value="بینک ٹرانسفر">بینک ٹرانسفر</option>
                    <option value="ایزی پیسہ / جاز کیش">ایزی پیسہ / جاز کیش</option>
                    <option value="چیک">چیک</option>
                  </select>
                </div>
              </div>

              {/* Amounts and calculations */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-amber-950 mb-1">
                    کل طے شدہ مالیت مہر (روپے):
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.mehr?.totalAgreedAmount || 0}
                    onChange={(e) =>
                      handleMehrAmountChange(
                        parseFloat(e.target.value) || 0,
                        formData.mehr?.muajjalAmount || 0
                      )
                    }
                    className="w-full font-mono text-sm font-bold border border-amber-300 rounded p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-emerald-900 mb-1">
                    معجل ادا شدہ رقم (روپے):
                  </label>
                  <input
                    type="number"
                    value={formData.mehr?.muajjalAmount || 0}
                    onChange={(e) =>
                      handleMehrAmountChange(
                        formData.mehr?.totalAgreedAmount || 0,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full font-mono text-sm font-bold border border-emerald-300 rounded p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-900 mb-1">
                    مؤجل بقیہ رقم (روپے):
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={formData.mehr?.muakhkharAmount || 0}
                    className="w-full font-mono text-sm font-bold border border-rose-300 rounded p-2 bg-rose-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-neutral-700">
                  نان و نفقہ یا دیگر خصوصی شرائط نکاح:
                </label>
                <textarea
                  rows={2}
                  value={formData.specialConditions || ''}
                  onChange={(e) => setFormData({ ...formData, specialConditions: e.target.value })}
                  className="w-full text-xs border border-neutral-300 rounded p-2"
                />
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-semibold"
                >
                  پچھلا مرحلہ
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100"
              >
                منسوخ
              </button>

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  اگلا مرحلہ
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold shadow-md"
                >
                  نکاح ریکارڈ محفوظ کریں
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
