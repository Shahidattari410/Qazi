import React, { useState } from 'react';
import {
  HeartHandshake,
  FileText,
  Scale,
  Coins,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Send,
  Building,
  Mail,
  UserCheck,
} from 'lucide-react';
import { Emblem } from '../common/Emblem';
import { OfficeSettings } from '../../types';
import { storageService } from '../../services/storage';

interface PublicWebsiteViewProps {
  settings: OfficeSettings;
  onNavigateToOfficePortal: () => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  settings,
  onNavigateToOfficePortal,
}) => {
  const [inquiryRef, setInquiryRef] = useState('');
  const [inquiryResult, setInquiryResult] = useState<{
    found: boolean;
    type?: string;
    refNo?: string;
    date?: string;
    verified?: boolean;
  } | null>(null);

  const [appointmentName, setAppointmentName] = useState('');
  const [appointmentPhone, setAppointmentPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentService, setAppointmentService] = useState('نکاح خوانی و رجسٹریشن');
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  // Safe Public Verification without exposing sensitive private CNIC or full addresses
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inquiryRef.trim().toUpperCase();
    if (!query) return;

    const nikahs = storageService.getNikahs();
    const talaqs = storageService.getTalaqRecords();
    const khulas = storageService.getKhulaRecords();
    const affidavits = storageService.getAffidavits();

    const foundNikah = nikahs.find((n) => n.registrationNo.toUpperCase() === query);
    if (foundNikah) {
      setInquiryResult({
        found: true,
        type: 'نکاح رجسٹر اندراج',
        refNo: foundNikah.registrationNo,
        date: foundNikah.date,
        verified: true,
      });
      return;
    }

    const foundTalaq = talaqs.find((t) => t.caseNo.toUpperCase() === query);
    if (foundTalaq) {
      setInquiryResult({
        found: true,
        type: 'دفتری نوٹس طلاق ریکارڈ',
        refNo: foundTalaq.caseNo,
        date: foundTalaq.talaqDate,
        verified: true,
      });
      return;
    }

    const foundKhula = khulas.find((k) => k.caseNo.toUpperCase() === query);
    if (foundKhula) {
      setInquiryResult({
        found: true,
        type: 'خلع عدالتی ڈگری اندراج',
        refNo: foundKhula.caseNo,
        date: foundKhula.courtOrderDate,
        verified: true,
      });
      return;
    }

    const foundAffidavit = affidavits.find((a) => a.affidavitNo.toUpperCase() === query);
    if (foundAffidavit) {
      setInquiryResult({
        found: true,
        type: 'بیان حلفی تصدیق',
        refNo: foundAffidavit.affidavitNo,
        date: foundAffidavit.date,
        verified: true,
      });
      return;
    }

    setInquiryResult({
      found: false,
    });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentSuccess(true);
    setTimeout(() => {
      setAppointmentName('');
      setAppointmentPhone('');
      setAppointmentDate('');
      setAppointmentSuccess(false);
    }, 4000);
  };

  const services = [
    {
      title: 'نکاح رجسٹریشن و نکاح خوانی',
      desc: 'سنتِ نبوی کے مطابق خطبہ نکاح، شرعی ایجاب و قبول اور قانونی دستاویزات کی باضابطہ تیاری۔',
      icon: HeartHandshake,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'نکاح ریکارڈ و نقل مصدقہ',
      desc: 'سابقہ رجسٹرڈ نکاح جات کے دفتری ریکارڈ کی پڑتال اور مصدقہ نقول برائے قانونی ضرورت۔',
      icon: FileText,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      title: 'حلفی بیانات و اقرار نامے',
      desc: 'مجرد ہونے کا حلف نامہ، رضامندی ولی، مہر کا اقرار نامہ اور قانونی اسٹامپ پیپر تیاری۔',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      title: 'حق مہر شرعی حساب و رہنمائی',
      desc: 'مہر فاطمی کی موجودہ صرافہ مارکیٹ قیمت کا شرعی حساب، معجل و مؤجل کی قانونی وضاحت۔',
      icon: Coins,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'طلاق دفتری نوٹس و مصالحت',
      desc: 'تحریری طلاق نامہ کا شرعی اندراج اور یونین کونسل مصالحتی کونسل کو قانونی نوٹس کا طریقہ کار۔',
      icon: Scale,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      title: 'خلع و عدالتی ڈگری اندراج',
      desc: 'معزز فیملی کورٹ سے جاری شدہ خلع ڈگری کا دفتری اندراج اور شرعی مشاورت۔',
      icon: UserCheck,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
  ];

  return (
    <div className="space-y-12 font-urdu text-neutral-900 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-linear-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 sm:p-7 shadow-lg border border-emerald-800">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-2.5">
          <div className="flex justify-center mb-1">
            <Emblem size={52} />
          </div>

          <div className="text-[10px] font-semibold text-amber-300 font-sans tracking-widest uppercase">
            Official Islamic Legal & Nikah Services Office
          </div>

          <h1 className="text-lg sm:text-2xl font-bold font-header-urdu tracking-tight text-white leading-tight">
            {settings.qaziName}
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-amber-200 font-header-urdu">
            {settings.qaziTitle} · دار القضاء و نکاح رجسٹریشن کونسل
          </p>

          <p className="text-xs text-emerald-100/90 max-w-xl mx-auto leading-relaxed font-urdu">
            شرعی و قانونی نکاح، حلفی بیانات، حق مہر کے باضابطہ تعین اور متعلقہ دفتری دستاویزی خدمات کا معتمد اور مستند مرکز۔
          </p>

          <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2 font-header-urdu">
            <a
              href="#appointment"
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs transition-all"
            >
              وقتِ ملاقات / تقریب بکنگ
            </a>
            <a
              href="#verification"
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              دفتری تصدیقِ ریکارڈ
            </a>
            <button
              onClick={onNavigateToOfficePortal}
              className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600 transition-all"
            >
              دفتری پورٹل لاگ ان
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-emerald-950">
            فراہمی خدمات و دفتری سہولیات
          </h2>
          <p className="text-xs text-neutral-500">
            ہماری تمام خدمات اسلامی شریعت اور ملکی رائج الوقت عائلی قوانین کے عین مطابق انجام دی جاتی ہیں۔
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className={`p-3 rounded-lg w-fit border ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-neutral-900">{s.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safe Public Verification Inquiry */}
      <section id="verification" className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="max-w-2xl mx-auto text-center space-y-1.5">
          <h3 className="text-xl font-bold text-emerald-950 flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>آن لائن دفتری ریکارڈ کی تصدیق</span>
          </h3>
          <p className="text-xs text-neutral-600">
            اپنے نکاح رجسٹریشن نمبر یا کیس ریفرنس سے تصدیق فرمائیں (شہریوں کے نجی کوائف کی رازداری کا مکمل تحفظ)
          </p>
        </div>

        <form onSubmit={handleVerify} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            required
            placeholder="مثال: QZ-LHR-2026-001 یا AFF-2026-045"
            value={inquiryRef}
            onChange={(e) => setInquiryRef(e.target.value)}
            className="flex-1 font-mono text-xs border border-neutral-300 rounded-xl p-2.5 bg-white focus:outline-emerald-800"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs"
          >
            تصدیق کریں
          </button>
        </form>

        {inquiryResult && (
          <div className="max-w-md mx-auto mt-4 p-4 rounded-xl border text-xs text-center font-urdu">
            {inquiryResult.found ? (
              <div className="bg-white p-3 rounded-lg border border-emerald-300 space-y-1 text-emerald-950">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-sm block">✓ دفتری ریکارڈ مصدقہ موجود ہے</span>
                <p className="font-mono text-xs">{inquiryResult.refNo}</p>
                <p>قسم: <strong>{inquiryResult.type}</strong></p>
                <p className="text-neutral-500 font-mono">تاریخ اندراج: {inquiryResult.date}</p>
                <span className="text-[10px] text-emerald-700 block mt-1">
                  دفتر قاضی مولانا حافظ محمد شاہد عطاری مدنی کے پاس باضابطہ محفوظ ہے۔
                </span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-lg border border-rose-300 space-y-1 text-rose-950">
                <AlertTriangle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
                <span className="font-bold block">ریکارڈ نہیں ملا</span>
                <p className="text-neutral-500 text-[11px]">
                  درج کردہ ریفرنس نمبر دفتری ڈیٹا بیس میں موجود نہیں ہے۔ براہ کرم نمبر دوبارہ چیک فرمائیں یا دفتر سے رابطہ کریں۔
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Appointment & Contact Section */}
      <section id="appointment" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <span>نکاح خوانی یا مشاورت کے لیے وقتِ ملاقات (Appointment)</span>
          </h3>

          {appointmentSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>آپ کی درخواست موصول ہو گئی ہے۔ دفتر سے بر وقت تصدیقی رابطہ کیا جائے گا۔</span>
            </div>
          )}

          <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
            <div>
              <label className="block mb-1 text-neutral-700 font-medium">سائل کا نام:</label>
              <input
                type="text"
                required
                value={appointmentName}
                onChange={(e) => setAppointmentName(e.target.value)}
                placeholder="اپنا مکمل نام درج کریں"
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-neutral-700 font-medium">موبائل رابطہ نمبر:</label>
                <input
                  type="text"
                  required
                  value={appointmentPhone}
                  onChange={(e) => setAppointmentPhone(e.target.value)}
                  placeholder="0300-0000000"
                  className="w-full font-mono border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-neutral-700 font-medium">مطلوبہ تاریخ:</label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full font-mono border rounded-lg p-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-neutral-700 font-medium">مطلوبہ خدمت / سروس:</label>
              <select
                value={appointmentService}
                onChange={(e) => setAppointmentService(e.target.value)}
                className="w-full border rounded-lg p-2 bg-white"
              >
                <option value="نکاح خوانی و رجسٹریشن">نکاح خوانی و رجسٹریشن</option>
                <option value="نکاح نامہ نقل و تصدیق">نکاح نامہ نقل و تصدیق</option>
                <option value="حق مہر مشاورت و حساب">حق مہر مشاورت و حساب</option>
                <option value="حلفی بیان کی تیاری">حلفی بیان کی تیاری</option>
                <option value="دیگر قانونی رہنمائی">دیگر قانونی رہنمائی</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>درخواست ارسال کریں</span>
            </button>
          </form>
        </div>

        {/* Office Contact & Address Box */}
        <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-amber-300">
              رابطہ و دفتری اوقاتِ کار
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">دفتری پتہ:</strong>
                  <span>{settings.officeAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">اوقاتِ کار:</strong>
                  <span>{settings.officeTimings}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">رابطہ فون نمبر:</strong>
                  <span className="font-mono text-emerald-300">{settings.contactNumber}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">ای میل:</strong>
                  <span className="font-mono">{settings.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="p-3 bg-neutral-800 rounded-xl text-[11px] text-neutral-400 border border-neutral-700 leading-normal">
            <strong>قانونی آگاہی:</strong> یہ پورٹل قاضی و نکاح رجسٹرار کا دفتری معلوماتی نظام ہے۔ کمپیوٹرائزڈ نادرا میرج رجسٹریشن سرٹیفکیٹ کا اجرا مجاز یونین کونسل کرتی ہے۔
          </div>
        </div>
      </section>
    </div>
  );
};
