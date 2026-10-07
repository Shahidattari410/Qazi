import React, { useRef, useEffect, useState } from 'react';
import {
  Printer,
  X,
  FileCheck,
  ShieldAlert,
  Stamp,
  CheckCircle2,
  Calendar,
  MapPin,
  UserCheck,
  Coins,
  QrCode,
  Download,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { Emblem } from './Emblem';
import {
  AffidavitRecord,
  FeeReceipt,
  KhulaRecord,
  NikahRecord,
  OfficeSettings,
  TalaqRecord,
} from '../../types';
import { triggerReliablePrint, numberToUrduWords, shareOrDownloadMobileDoc } from '../../utils/urduUtils';

export type PrintableDocumentType =
  | 'nikah'
  | 'haqmehr'
  | 'talaq'
  | 'khula'
  | 'affidavit'
  | 'fee_receipt'
  | 'wakalat';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PrintableDocumentType;
  record: any;
  settings: OfficeSettings;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  docType,
  record,
  settings,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [nikahPrintMode, setNikahPrintMode] = useState<'official_25_columns' | 'summary_card'>('official_25_columns');

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

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    triggerReliablePrint('modal-printable-document');
  };

  const handleDownloadDoc = () => {
    const elem = document.getElementById('modal-printable-document');
    if (!elem) return;
    const blob = new Blob([elem.outerHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Document_${docType}_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1. Official 25 Columns Statutory Nikah Nama (Form II)
  const renderNikahOfficial25Columns = (n: NikahRecord) => {
    const g = n.groom;
    const b = n.bride;
    const m = n.mehr;

    return (
      <div className="space-y-3 font-urdu text-neutral-900 text-xs">
        {/* Form II Statutory Top Header */}
        <div className="border-b-2 border-emerald-900 pb-2 text-center space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono border-2 border-emerald-900 px-2 py-0.5 rounded bg-emerald-50 text-emerald-950 font-bold">
              رجسٹریشن نمبر: {n.registrationNo}
            </span>
            <div className="text-center">
              <span className="text-[11px] font-arabic font-bold text-emerald-900 tracking-widest block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <h2 className="font-header-urdu font-black text-base sm:text-lg text-emerald-950 leading-tight">
                فارم دوم (نکاح نامہ) - باضابطہ قانونی فارم
              </h2>
            </div>
            <span className="text-[10px] font-mono border-2 border-emerald-900 px-2 py-0.5 rounded bg-emerald-50 text-emerald-950 font-bold">
              جلد نمبر: {n.nikahNamaNo}
            </span>
          </div>

          <p className="text-[10px] font-bold text-emerald-900 font-header-urdu leading-tight">
            بمطابق قواعد مغربی پاکستان مجریہ زیر دفعہ 5 مسلم فیملی لاز آرڈیننس 1961ء (قاعدہ نمبر 8 و 10)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[9px] text-neutral-700 font-header-urdu">
            <span>دفتر قاضی و نکاح رجسٹرار: <strong>{settings.qaziName}</strong> ({settings.qaziTitle})</span>
            <span>·</span>
            <span>لائسنس رجسٹریشن نمبر: <strong className="font-mono">{settings.qaziRegistrationNo}</strong></span>
            <span>·</span>
            <span>یونین کونسل: <strong>{n.unionCouncil}</strong></span>
          </div>
        </div>

        {/* The Classical 25 Columns Official Table */}
        <div className="border-2 border-emerald-900 overflow-hidden rounded bg-white">
          <table className="w-full text-right text-[10.5px] border-collapse leading-snug">
            <thead>
              <tr className="bg-emerald-900 text-white font-header-urdu font-bold">
                <th className="p-1.5 border border-emerald-800 text-center w-12 text-xs">کالم</th>
                <th className="p-1.5 border border-emerald-800 w-[38%] text-xs">قانونی شق / سوال نامہ</th>
                <th className="p-1.5 border border-emerald-800 text-xs">تفصیلات و بیاناتِ فریقین</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 font-urdu">
              {/* Column 1 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">1</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  نام وارڈ / یونین کونسل، قصبہ، تحصیل و ضلع جس میں شادی واقع ہوئی:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong>{n.unionCouncil}</strong>، تحصیل {n.tehsil || 'لاہور'}، ضلع {n.district || 'لاہور'} 
                  {n.place ? ` (بمقام: ${n.place})` : ''}
                </td>
              </tr>

              {/* Column 2 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">2</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دولہا اور اس کے باپ کا نام معہ سکونت:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong>{g.fullName}</strong> ولد <strong>{g.fatherName}</strong>
                  <span className="block text-[9.5px] text-neutral-600 mt-0.5">
                    شناختی کارڈ: <span className="font-mono font-bold text-neutral-900">{g.cnic}</span> | 
                    موبائل: <span className="font-mono">{g.mobile}</span> | 
                    پتہ: {g.address}، {g.city || g.district}
                  </span>
                </td>
              </tr>

              {/* Column 3 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">3</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دولہا کی عمر و تاریخ پیدائش:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong className="font-mono text-emerald-950 font-bold">{g.age}</strong> سال 
                  {g.dob ? ` (تاریخ پیدائش بمطابق شناختی کارڈ: ${g.dob})` : ''}
                </td>
              </tr>

              {/* Column 4 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">4</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  اگر دولہا کی طرف سے وکیل مقرر ہوا ہو تو اس کا نام معہ ولدیت و سکونت:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  {n.wakeelGroom?.name ? (
                    <span>
                      <strong>{n.wakeelGroom.name}</strong> ولد {n.wakeelGroom.fatherName} 
                      (شناختی کارڈ: <span className="font-mono">{n.wakeelGroom.cnic}</span> | پتہ: {n.wakeelGroom.address})
                    </span>
                  ) : (
                    'دولہا خود بالمشافہ حاضرِ مجلسِ عقد رہا (اصالتاً حاضری)۔'
                  )}
                </td>
              </tr>

              {/* Column 5 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">5</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دولہا کے وکیل کے تقرر کے گواہان معہ نام و ولدیت و سکونت:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  {n.wakeelGroom?.name ? (
                    <span>1. {n.witnesses[0]?.name} ولد {n.witnesses[0]?.fatherName} | 2. {n.witnesses[1]?.name} ولد {n.witnesses[1]?.fatherName}</span>
                  ) : (
                    'دولہا اصالتاً خود حاضرِ مجلس تھا، وکیل مقرر کرنے کی حاجت نہ تھی۔'
                  )}
                </td>
              </tr>

              {/* Column 6 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">6</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دلہن اور اس کے والد کا نام معہ سکونت:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong>{b.fullName}</strong> بنت <strong>{b.fatherName}</strong>
                  <span className="block text-[9.5px] text-neutral-600 mt-0.5">
                    شناختی کارڈ: <span className="font-mono font-bold text-neutral-900">{b.cnic}</span> | 
                    موبائل: <span className="font-mono">{b.mobile}</span> | 
                    پتہ: {b.address}، {b.city || b.district}
                  </span>
                </td>
              </tr>

              {/* Column 7 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">7</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دلہن کنواری ہے، بیوہ ہے یا مطلقہ:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong className="text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {b.maritalStatus}
                  </strong>
                </td>
              </tr>

              {/* Column 8 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">8</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دلہن کی عمر و تاریخ پیدائش:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong className="font-mono text-emerald-950 font-bold">{b.age}</strong> سال 
                  {b.dob ? ` (تاریخ پیدائش بمطابق شناختی کارڈ: ${b.dob})` : ''}
                </td>
              </tr>

              {/* Column 9 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">9</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  اگر دلہن کی طرف سے وکیل مقرر ہوا ہو تو اس کا نام معہ ولدیت و پتہ:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  {n.wakeelBride?.name ? (
                    <span>
                      <strong>{n.wakeelBride.name}</strong> ولد {n.wakeelBride.fatherName} 
                      (شناختی کارڈ: <span className="font-mono">{n.wakeelBride.cnic}</span> | پتہ: {n.wakeelBride.address})
                    </span>
                  ) : (
                    'دلہن اصالتاً باحجاب حاضر و برضا و رغبت خود مجلسِ عقد میں موجود تھی۔'
                  )}
                </td>
              </tr>

              {/* Column 10 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">10</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دلہن کے وکیل کے تقرر کی تصدیق کرنے والے گواہان کے نام معہ ولدیت:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  1. <strong>{n.witnesses[0]?.name}</strong> ولد {n.witnesses[0]?.fatherName} (CNIC: <span className="font-mono">{n.witnesses[0]?.cnic}</span>)<br/>
                  2. <strong>{n.witnesses[1]?.name}</strong> ولد {n.witnesses[1]?.fatherName} (CNIC: <span className="font-mono">{n.witnesses[1]?.cnic}</span>)
                </td>
              </tr>

              {/* Column 11 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">11</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  اگر دلہن نابالغہ ہو تو اس کے ولی کا نام و ولدیت اور رشتہ:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  دلہن عاقلہ و بالغہ ہے۔ (ولی شرعی بحیثیت والد: <strong>{n.brideGuardian?.name || b.fatherName}</strong>)
                </td>
              </tr>

              {/* Column 12 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">12</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  نکاح کے باضابطہ گواہان کے نام، ولدیت معہ سکونت اور شناختی کارڈ:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800 space-y-1">
                  {n.witnesses.map((w, idx) => (
                    <div key={idx} className="border-r-2 border-emerald-700 pr-1.5">
                      گواہ {idx + 1}: <strong>{w.name}</strong> ولد {w.fatherName} | 
                      شناختی کارڈ: <span className="font-mono font-bold">{w.cnic}</span> | 
                      پتہ: {w.address}
                    </div>
                  ))}
                </td>
              </tr>

              {/* Column 13 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">13</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  تاریخ جس روز نکاح منعقد ہوا:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong className="font-mono text-emerald-900 text-xs font-bold">{n.date}</strong> عیسوی 
                  {n.hijriDate ? ` (مطابق ${n.hijriDate})` : ''} 
                  {n.time ? ` بوقت: ${n.time}` : ''}
                </td>
              </tr>

              {/* Column 14 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">14</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  مہر کی کل رقم / تفصیل:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  <strong className="font-mono text-sm text-amber-950 font-bold">
                    روپے {m.totalAgreedAmount.toLocaleString()}
                  </strong>
                  <span className="text-[9.5px] text-neutral-600 block">
                    (الفاظ میں: {numberToUrduWords(m.totalAgreedAmount)}) · نوعیت: {m.nature} ({m.type})
                    {m.metalType ? ` · دھات: ${m.metalType} (${m.totalTolaEquivalent || m.tola || 0} تولہ)` : ''}
                  </span>
                </td>
              </tr>

              {/* Column 15 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">15</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  مہر میں سے معجل کتنی ہے اور مؤجل کتنی ہے:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  معجل (فوری وصولی): <strong className="font-mono text-emerald-800 font-bold">روپے {m.muajjalAmount.toLocaleString()}</strong> 
                  <span className="text-[9.5px] text-neutral-500"> ({numberToUrduWords(m.muajjalAmount)})</span>
                  <span className="mx-2">|</span>
                  مؤجل (مؤخر / بقایا): <strong className="font-mono text-rose-800 font-bold">روپے {m.muakhkharAmount.toLocaleString()}</strong>
                  <span className="text-[9.5px] text-neutral-500"> ({numberToUrduWords(m.muakhkharAmount)})</span>
                </td>
              </tr>

              {/* Column 16 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">16</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  آیا مہر کا کچھ حصہ نکاح کے وقت ادا کر دیا گیا اور اگر کر دیا گیا تو کتنا؟
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  {m.amountReceived > 0 ? (
                    <span className="font-bold text-emerald-900">
                      روپے {m.amountReceived.toLocaleString()} بموجب رسید بوقت نکاح مجلس میں ادا کیا گیا۔
                    </span>
                  ) : (
                    'نہیں، مہر مؤجل طے پایا ہے جو بعد ازاں واجب الادا ہوگا۔'
                  )}
                </td>
              </tr>

              {/* Column 17 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">17</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  آیا مہر کے کل یا کسی حصہ کے عوض کوئی جائیداد دی گئی:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  {m.propertyDetails || 'کوئی جائیداد نہیں دی گئی۔ صرف نقد / طلائی مہر طے پایا۔'}
                </td>
              </tr>

              {/* Column 18 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">18</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  نان و نفقہ یا رہائش وغیرہ کے متعلق خاص شرائط:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  {n.specialConditions || 'روایتی شرعی نان و نفقہ اور رہائش کی ذمہ داری شوہر پر طے پائی۔'}
                </td>
              </tr>

              {/* Column 19 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">19</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  آیا شوہر نے طلاق کا حق بیوی کو تفویض کیا ہے اور کن شرائط پر؟
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800 font-bold">
                  تفویض نہیں کیا گیا۔ (یا بمطابق باہمی اتفاق رائے فریقین)
                </td>
              </tr>

              {/* Column 20 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">20</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  آیا شوہر کے طلاق دینے کے حق پر کسی قسم کی پابندی ہے؟
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800">
                  کوئی غیر شرعی پابندی عائد نہیں کی گئی۔
                </td>
              </tr>

              {/* Column 21 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">21</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  مہر اور نان و نفقہ وغیرہ کے متعلق کوئی معاہدہ یا دستاویز لکھی گئی ہو:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800 font-mono">
                  اسٹامپ پیپر نمبر: <strong>{n.stampPaperNo || 'PB-STP-2026-90412'}</strong>
                </td>
              </tr>

              {/* Column 22 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">22</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  آیا دولہا کی کوئی اور بیوی موجود ہے اور کیا اس نے ثالثی کونسل سے اجازت لی:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800 font-bold">
                  {g.maritalStatus === 'شادی شدہ (پہلی بیوی موجود)' ? 'ثالثی کونسل سے اجازت لی گئی ہے۔' : 'دولہا کنوارا ہے، کوئی دوسری بیوی موجود نہیں۔'}
                </td>
              </tr>

              {/* Column 23 */}
              <tr className="hover:bg-neutral-50/70">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">23</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  اگر دولہا کی دوسری شادی ہو تو اجازت نامہ ثالثی کونسل کا نمبر و تاریخ:
                </td>
                <td className="p-1.5 border border-neutral-300 text-neutral-800 font-mono">
                  لاگو نہیں ہوتا (N/A - غیر متعلقہ)
                </td>
              </tr>

              {/* Column 24 */}
              <tr className="hover:bg-neutral-50/70 bg-emerald-50/20">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">24</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  دستخط و نشانِ انگوٹھا فریقین، ان کے وکلاء اور گواہان:
                </td>
                <td className="p-1.5 border border-neutral-300">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[9px] pt-1 pb-1">
                    <div className="border border-neutral-400 p-1 bg-white rounded">
                      <span className="block font-bold">دستخط دولہا</span>
                      <span className="block text-[8px] text-neutral-400 mt-2 border-t border-dashed">العارض / انگوٹھا</span>
                    </div>
                    <div className="border border-neutral-400 p-1 bg-white rounded">
                      <span className="block font-bold">دستخط دلہن</span>
                      <span className="block text-[8px] text-neutral-400 mt-2 border-t border-dashed">العارضہ / انگوٹھا</span>
                    </div>
                    <div className="border border-neutral-400 p-1 bg-white rounded">
                      <span className="block font-bold">وکیل دولہا / دلہن</span>
                      <span className="block text-[8px] text-neutral-400 mt-2 border-t border-dashed">دستخط وکیل</span>
                    </div>
                    <div className="border border-neutral-400 p-1 bg-white rounded">
                      <span className="block font-bold">دستخط گواہ 1</span>
                      <span className="block text-[8px] text-neutral-400 mt-2 border-t border-dashed">شاہد عقد اول</span>
                    </div>
                    <div className="border border-neutral-400 p-1 bg-white rounded">
                      <span className="block font-bold">دستخط گواہ 2</span>
                      <span className="block text-[8px] text-neutral-400 mt-2 border-t border-dashed">شاہد عقد دوم</span>
                    </div>
                    <div className="border border-neutral-400 p-1 bg-white rounded">
                      <span className="block font-bold">دستخط ولی شرعی</span>
                      <span className="block text-[8px] text-neutral-400 mt-2 border-t border-dashed">سرپرست / والد</span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Column 25 */}
              <tr className="hover:bg-neutral-50/70 bg-emerald-50/40">
                <td className="p-1.5 border border-neutral-300 text-center font-mono font-bold text-emerald-900 bg-neutral-50">25</td>
                <td className="p-1.5 border border-neutral-300 font-bold text-neutral-900">
                  نکاح رجسٹرار کا نام، ولدیت، دفتری رجسٹریشن اور دستخط و باضابطہ مہر:
                </td>
                <td className="p-1.5 border border-neutral-300">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-emerald-950 text-xs">{settings.qaziName}</div>
                      <div className="text-[9.5px] text-emerald-800">{settings.qaziTitle}</div>
                      <div className="font-mono text-[9px] text-neutral-600">
                        لائسنس رجسٹریشن نمبر: {settings.qaziRegistrationNo}
                      </div>
                    </div>
                    <div className="text-center pl-3 flex flex-col items-center">
                      <span className="font-arabic text-emerald-900 text-sm italic font-bold">
                        محمد شاہد عطاری مدنی (عفی عنہ)
                      </span>
                      <span className="text-[8.5px] text-neutral-500 border-t border-emerald-900/30 pt-0.5 mt-0.5">
                        دستخط و مہرِ باضابطہ نکاح رجسٹرار
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legal Statutory Disclaimer */}
        <div className="mt-2 pt-2 border-t border-neutral-300 text-[8.5px] text-neutral-600 text-center font-header-urdu">
          <strong>قانوناً و شرعاً ضروری وضاحت:</strong> {settings.disclaimerText}
        </div>
      </div>
    );
  };

  // 2. Summary Card Layout (Alternative View)
  const renderNikahSummaryCard = (n: NikahRecord) => {
    return (
      <div className="space-y-4 text-xs font-urdu text-neutral-800 leading-relaxed">
        {/* Header Title Banner */}
        <div className="text-center border-y-2 border-emerald-800 py-1.5 bg-emerald-50/70">
          <h2 className="text-lg font-bold text-emerald-950 font-urdu">
            نقل رجسٹر نکاح نامہ (دفتری شرعی ریکارڈ)
          </h2>
          <p className="text-[11px] text-emerald-800 font-sans tracking-wide">
            OFFICE EXTRACT COPY OF NIKAH REGISTER · RECORD VERIFICATION COPY
          </p>
        </div>

        {/* Registration details bar */}
        <div className="grid grid-cols-4 gap-2 border border-neutral-300 p-2 bg-neutral-50/70 rounded">
          <div>
            <span className="text-neutral-500 font-sans block text-[10px]">رجسٹریشن نمبر:</span>
            <span className="font-mono font-bold text-neutral-900">{n.registrationNo}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px]">نکاح نامہ نمبر:</span>
            <span className="font-mono font-bold text-neutral-900">{n.nikahNamaNo}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px]">تاریخ نکاح:</span>
            <span className="font-mono font-bold text-neutral-900">{n.date}</span>
            {n.hijriDate && <span className="block text-[10px] text-emerald-800">{n.hijriDate}</span>}
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px]">مقام و یونین کونسل:</span>
            <span className="font-bold text-neutral-900">{n.unionCouncil}، {n.tehsil}</span>
          </div>
        </div>

        {/* Parties Details (Groom & Bride) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Groom Box */}
          <div className="border border-emerald-900/30 p-2.5 rounded bg-emerald-50/20">
            <div className="border-b border-emerald-900/20 pb-1 mb-2 font-bold text-emerald-900 flex justify-between">
              <span>کوائف دولہا (Groom)</span>
              <span className="font-mono text-[10px]">{n.groom.maritalStatus}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <p><strong>نام دولہا:</strong> {n.groom.fullName}</p>
              <p><strong>ولدیت:</strong> {n.groom.fatherName}</p>
              <p><strong>شناختی کارڈ نمبر:</strong> <span className="font-mono font-bold">{n.groom.cnic}</span></p>
              <p><strong>عمر و تاریخ پیدائش:</strong> {n.groom.age} سال ({n.groom.dob})</p>
              <p><strong>پیشہ و قومیت:</strong> {n.groom.occupation} ({n.groom.nationality})</p>
              <p><strong>موبائل رابطہ:</strong> <span className="font-mono">{n.groom.mobile}</span></p>
              <p className="line-clamp-2"><strong>مکمل رہائشی پتہ:</strong> {n.groom.address}، {n.groom.district}</p>
            </div>
          </div>

          {/* Bride Box */}
          <div className="border border-emerald-900/30 p-2.5 rounded bg-emerald-50/20">
            <div className="border-b border-emerald-900/20 pb-1 mb-2 font-bold text-emerald-900 flex justify-between">
              <span>کوائف دلہن (Bride)</span>
              <span className="font-mono text-[10px]">{n.bride.maritalStatus}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <p><strong>نام دلہن:</strong> {n.bride.fullName}</p>
              <p><strong>ولدیت:</strong> {n.bride.fatherName}</p>
              <p><strong>شناختی کارڈ نمبر:</strong> <span className="font-mono font-bold">{n.bride.cnic}</span></p>
              <p><strong>عمر و تاریخ پیدائش:</strong> {n.bride.age} سال ({n.bride.dob})</p>
              <p><strong>پیشہ و قومیت:</strong> {n.bride.occupation} ({n.bride.nationality})</p>
              <p><strong>موبائل رابطہ:</strong> <span className="font-mono">{n.bride.mobile}</span></p>
              <p className="line-clamp-2"><strong>مکمل رہائشی پتہ:</strong> {n.bride.address}، {n.bride.district}</p>
            </div>
          </div>
        </div>

        {/* Haq Mehr Section */}
        <div className="border border-amber-300 p-2.5 rounded bg-amber-50/40">
          <div className="font-bold text-amber-950 border-b border-amber-200 pb-1 mb-1.5 flex justify-between">
            <span>تفصیلاتِ حق مہر (شرعی و قانونی)</span>
            <span className="text-[10px] font-sans font-medium text-amber-800">
              نوعیت: {n.mehr.nature} · قسم: {n.mehr.type}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-neutral-600 block text-[10px]">کل طے شدہ مہر:</span>
              <span className="font-mono font-bold text-base text-amber-900">
                روپے {n.mehr.totalAgreedAmount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-600 block text-[10px]">معجل (فوری وصول):</span>
              <span className="font-mono font-bold text-emerald-800">
                روپے {n.mehr.muajjalAmount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-600 block text-[10px]">مؤجل (مؤخر / بقایا):</span>
              <span className="font-mono font-bold text-rose-800">
                روپے {n.mehr.muakhkharAmount.toLocaleString()}
              </span>
            </div>
          </div>
          {n.mehr.metalType && (
            <div className="mt-1.5 pt-1 border-t border-amber-200/60 text-[10px] text-amber-900 flex justify-between">
              <span>
                وزن دھات: {n.mehr.tola || 0} تولہ {n.mehr.masha || 0} ماشہ ({n.mehr.totalTolaEquivalent} تولہ برائے {n.mehr.metalType})
              </span>
              <span>ریٹ بوقت نکاح: روپے {n.mehr.ratePerTolaAtRegistration?.toLocaleString()} فی تولہ</span>
            </div>
          )}
        </div>

        {/* Witnesses & Wakeel Details */}
        <div className="border border-neutral-300 p-2 rounded bg-white">
          <div className="font-bold text-neutral-800 text-[11px] mb-1">
            گواہانِ عقد و شرعی وکلاء:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {n.witnesses.map((w, idx) => (
              <div key={w.id || idx} className="border-r-2 border-emerald-700 pr-1.5">
                <strong>گواہ {idx + 1}:</strong> {w.name} ولد {w.fatherName} | شناختی کارڈ: <span className="font-mono">{w.cnic}</span>
              </div>
            ))}
          </div>
          {n.wakeelBride && (
            <div className="mt-1.5 pt-1 border-t border-neutral-200 text-[10px]">
              <strong>وکیل دلہن:</strong> {n.wakeelBride.name} ولد {n.wakeelBride.fatherName} (شناختی کارڈ: {n.wakeelBride.cnic})
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (docType) {
      case 'nikah': {
        const n: NikahRecord = record;
        if (nikahPrintMode === 'official_25_columns') {
          return renderNikahOfficial25Columns(n);
        }
        return renderNikahSummaryCard(n);
      }

      case 'haqmehr': {
        const n: NikahRecord = record;
        return (
          <div className="space-y-4 text-xs font-urdu text-neutral-800 leading-relaxed">
            <div className="text-center border-y-2 border-amber-600 py-1.5 bg-amber-50">
              <h2 className="text-lg font-bold text-amber-950 font-urdu">
                اقرار نامہ و باضابطہ تصدیق نامہ حق مہر
              </h2>
              <p className="text-[11px] text-amber-900 font-sans">
                DEED OF HAQ MEHR & PAYMENT SETTLEMENT ACKNOWLEDGEMENT
              </p>
            </div>

            <div className="border border-amber-200 p-3 rounded bg-amber-50/30 space-y-2">
              <p>
                <strong>باعثِ تحریر آں کہ:</strong> مسمی <strong>{n.groom.fullName}</strong> ولد {n.groom.fatherName} (شناختی کارڈ: {n.groom.cnic})
                کا نکاح مسماۃ <strong>{n.bride.fullName}</strong> بنت {n.bride.fatherName} (شناختی کارڈ: {n.bride.cnic})
                کے ہمراہ بتاریخ {n.date} کو منعقد ہوا۔
              </p>
              <div className="p-3 bg-white border border-amber-300 rounded">
                <h4 className="font-bold text-amber-900 mb-1">تفصیلاتِ مہر شرعی:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p>نوعیت مہر: <strong>{n.mehr.nature}</strong></p>
                    <p>قسم مہر: <strong>{n.mehr.type}</strong></p>
                    {n.mehr.metalType && <p>دھات: <strong>{n.mehr.metalType}</strong></p>}
                    {n.mehr.totalTolaEquivalent && <p>کل تولہ وزن: <strong>{n.mehr.totalTolaEquivalent} تولہ</strong></p>}
                  </div>
                  <div>
                    <p>کل مالیت مہر: <strong className="text-emerald-800 font-mono text-sm">روپے {n.mehr.totalAgreedAmount.toLocaleString()}</strong></p>
                    <p>معجل (فوری ادا شدہ): <strong className="font-mono">روپے {n.mehr.muajjalAmount.toLocaleString()}</strong></p>
                    <p>مؤجل (باقی الذمہ): <strong className="font-mono text-rose-700">روپے {n.mehr.muakhkharAmount.toLocaleString()}</strong></p>
                    <p>حیثیت ادائیگی: <strong>{n.mehr.paymentStatus}</strong></p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-neutral-600">
                فریقین نے روبرو گواہان مذکورہ حق مہر کا اقرار کیا اور زوج نے بوقت نکاح معجل مہر کی بابت رسید تسلیم کی۔
              </p>
            </div>
          </div>
        );
      }

      case 'talaq': {
        const t: TalaqRecord = record;
        return (
          <div className="space-y-4 text-xs font-urdu text-neutral-800 leading-relaxed">
            <div className="text-center border-y-2 border-rose-800 py-1.5 bg-rose-50">
              <h2 className="text-lg font-bold text-rose-950 font-urdu">
                دفتری ریکارڈ و نوٹس طلاق
              </h2>
              <p className="text-[11px] text-rose-800 font-sans">
                OFFICIAL RECORD ENTRY & NOTICE OF TALAQ
              </p>
            </div>

            <div className="border border-neutral-300 p-3 bg-neutral-50 rounded space-y-2">
              <div className="flex justify-between border-b border-neutral-200 pb-1">
                <span>کیس نمبر: <strong className="font-mono">{t.caseNo}</strong></span>
                <span>تاریخ اندراج: <strong className="font-mono">{t.talaqDate}</strong></span>
                <span>قسم طلاق: <strong>{t.type}</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <h4 className="font-bold text-neutral-800">مرد (شوہر):</h4>
                  <p>{t.husbandName} | شناختی کارڈ: <span className="font-mono">{t.husbandCnic}</span></p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800">خاتون (زوجہ):</h4>
                  <p>{t.wifeName} | شناختی کارڈ: <span className="font-mono">{t.wifeCnic}</span></p>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-rose-200 rounded text-neutral-700">
                <strong>وضاحت و دفتری اندراج:</strong>
                <p className="mt-1">{t.notes || 'شوہر کی جانب سے تحریری نوٹس شرعاً و قانوناً دفتری ریکارڈ میں اندراج کر لیا گیا۔ مصالحتی کارروائی کے لیے چیئرمین یونین کونسل کو رجوع کی ہدایت کی گئی۔'}</p>
              </div>

              <div className="text-[11px] text-neutral-500">
                نوٹ: موثر طلاق سرٹیفکیٹ کا قانونی اجرا متعلقہ یونین کونسل مصالحتی کونسل سے 90 یوم کی قانونی مدت کے بعد جاری ہوتا ہے۔
              </div>
            </div>
          </div>
        );
      }

      case 'khula': {
        const k: KhulaRecord = record;
        return (
          <div className="space-y-4 text-xs font-urdu text-neutral-800 leading-relaxed">
            <div className="text-center border-y-2 border-blue-800 py-1.5 bg-blue-50">
              <h2 className="text-lg font-bold text-blue-950 font-urdu">
                دفتری ریکارڈ اندراج خلع (عدالتی ڈگری)
              </h2>
              <p className="text-[11px] text-blue-800 font-sans">
                OFFICE RECORD OF KHULA & JUDICIAL DECREE
              </p>
            </div>

            <div className="border border-neutral-300 p-3 bg-neutral-50 rounded space-y-2">
              <div className="flex justify-between border-b border-neutral-200 pb-1">
                <span>کیس نمبر: <strong className="font-mono">{k.caseNo}</strong></span>
                <span>عدالتی کیس نمبر: <strong className="font-mono">{k.courtCaseNo}</strong></span>
                <span>حالت: <strong>{k.registrationStatus}</strong></span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <h4 className="font-bold text-neutral-800">مستدعیہ (زوجہ):</h4>
                  <p>{k.wifeName} | شناختی کارڈ: <span className="font-mono">{k.wifeCnic}</span></p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800">مدعا علیہ (شوہر):</h4>
                  <p>{k.husbandName} | شناختی کارڈ: <span className="font-mono">{k.husbandCnic}</span></p>
                </div>
              </div>

              <div className="p-2.5 bg-white border border-blue-200 rounded">
                <p><strong>نام عدالت:</strong> {k.courtName}</p>
                <p><strong>تاریخِ ڈگری:</strong> <span className="font-mono">{k.courtOrderDate}</span></p>
                {k.surrenderedMehrDetails && (
                  <p className="mt-1"><strong>مہر واپسی / تصفیہ شرائط:</strong> {k.surrenderedMehrDetails}</p>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'affidavit': {
        const a: AffidavitRecord = record;
        return (
          <div className="space-y-4 text-xs font-urdu text-neutral-800 leading-relaxed">
            <div className="text-center border-y-2 border-emerald-800 py-1.5 bg-emerald-50">
              <h2 className="text-lg font-bold text-emerald-950 font-urdu">
                {a.statementType}
              </h2>
              <p className="text-[11px] text-emerald-800 font-sans">
                LEGAL AFFIDAVIT & SOLEMN STATEMENT UNDER OATH
              </p>
            </div>

            <div className="border border-neutral-300 p-3 bg-white rounded space-y-3">
              <div className="flex justify-between border-b pb-1 text-neutral-600 text-[11px]">
                <span>بیان نمبر: <strong className="font-mono">{a.affidavitNo}</strong></span>
                <span>اسٹامپ پیپر نمبر: <strong className="font-mono">{a.stampPaperNo}</strong> (مالیت {a.stampValue} روپے)</span>
                <span>بتاریخ: <strong className="font-mono">{a.date}</strong></span>
              </div>

              <p>
                میں مسمی / مسماۃ <strong>{a.personName}</strong> ولد / بنت {a.fatherName}
                ، شناختی کارڈ نمبر <strong className="font-mono">{a.cnic}</strong>
                ، موبائل نمبر <strong className="font-mono">{a.mobile}</strong>
                ، ساکن {a.address}
                ، بہوش و حواس خمسہ بلا جبر و اکراہ خدا کو حاضر و ناظر جان کر حلفاً درج ذیل بیان کرتا / کرتی ہوں:
              </p>

              <div className="p-3 bg-neutral-50 border-r-4 border-emerald-800 rounded font-medium text-neutral-900 leading-loose">
                {a.fullStatement}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <h4 className="font-bold text-neutral-800 text-[11px]">گواہ نمبر 1:</h4>
                  <p>{a.witness1Name} (شناختی کارڈ: {a.witness1Cnic})</p>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 text-[11px]">گواہ نمبر 2:</h4>
                  <p>{a.witness2Name} (شناختی کارڈ: {a.witness2Cnic})</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'fee_receipt': {
        const f: FeeReceipt = record;
        const words = numberToUrduWords(f.amount);
        return (
          <div
            className="space-y-3 text-xs font-nastaliq text-neutral-800 leading-normal"
            style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
          >
            {/* 3D Gold Ribbon Banner */}
            <div className="text-center py-1 px-3 rounded-lg bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white shadow-xs border-y border-amber-300 flex items-center justify-between">
              <span className="text-[8px] font-mono tracking-wider text-amber-200">
                OFFICIAL VOUCHER
              </span>
              <h2 className="font-header-urdu font-bold text-xs sm:text-[12.5px] text-amber-300">
                باضابطہ دفتری رسید فیس و مالیاتی اندراج
              </h2>
              <span className="text-[8px] font-mono text-amber-200">
                نقل سائل
              </span>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-3 gap-1.5 bg-neutral-50 p-1.5 rounded-lg border border-neutral-200 text-xs">
              <div>
                <span className="text-[8.5px] text-neutral-500 block">رسید نمبر:</span>
                <span className="font-mono font-bold text-emerald-950 text-xs">{f.receiptNo}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-neutral-500 block">تاریخ اجراء:</span>
                <span className="font-mono font-bold text-neutral-800 text-[11px]">{f.date}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-neutral-500 block">طریقہ ادائیگی:</span>
                <span className="font-bold text-neutral-800 text-[10.5px]">{f.paymentMethod}</span>
              </div>
            </div>

            {/* Client Particulars & Service Info */}
            <div className="border border-emerald-900/20 rounded-lg p-2.5 bg-white space-y-1.5 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-1.5 border-b border-neutral-200">
                <div>
                  <span className="text-neutral-500 block text-[8.5px]">موصول شدہ از محترم / محترمہ:</span>
                  <span className="font-bold text-neutral-900 text-[11.5px]">{f.personName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[8.5px]">شناختی کارڈ نمبر (CNIC):</span>
                  <span className="font-mono font-bold text-neutral-800 text-[11px]">{f.cnic || 'تصدیق شدہ'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div>
                  <span className="text-neutral-500 block text-[8.5px]">رابطہ فون نمبر:</span>
                  <span className="font-mono font-bold text-neutral-800 text-[10.5px]">{f.mobile || 'دستیاب نہیں'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[8.5px]">بابت سروس و خدمت:</span>
                  <span className="font-bold text-emerald-900 text-[11px]">{f.service}</span>
                </div>
              </div>

              {f.notes && (
                <div className="pt-1 text-[9.5px] text-neutral-700 bg-emerald-50/40 p-1.5 rounded border border-emerald-900/10">
                  <strong>تفصیل و شرائط:</strong> {f.notes}
                </div>
              )}
            </div>

            {/* 3D Amount Display Box with Urdu in Words */}
            <div className="bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border border-amber-400 p-2.5 rounded-xl text-center space-y-0.5 shadow-2xs">
              <span className="text-neutral-600 text-[9px] font-semibold block">
                کل وصول شدہ رقم (Total Received)
              </span>
              <div className="text-lg sm:text-xl font-mono font-extrabold text-emerald-950 tracking-tight">
                روپے {f.amount.toLocaleString()} /-
              </div>
              <div className="text-[10.5px] sm:text-[11px] font-bold text-emerald-900 font-header-urdu pt-0.5">
                (بحروف: {words})
              </div>
            </div>
          </div>
        );
      }

      default:
        return <div>دستاویز دستیاب نہیں ہے۔</div>;
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto font-urdu"
    >
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none flex flex-col max-h-[96vh]">
        {/* Action Header with prominent Back to Menu button - Clean & Light */}
        <div className="no-print bg-white text-neutral-900 px-3.5 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 shadow-2xs">
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs shadow-2xs transition-all font-header-urdu active:scale-95 border border-neutral-300"
            title="دستاویز بند کر کے واپس مینیو میں جائیں"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>← واپس مینیو میں جائیں</span>
          </button>

          {/* Center Format Switcher (When Nikah Document) */}
          {docType === 'nikah' ? (
            <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-xl border border-neutral-300">
              <button
                type="button"
                onClick={() => setNikahPrintMode('official_25_columns')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-header-urdu flex items-center gap-1 ${
                  nikahPrintMode === 'official_25_columns'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950'
                }`}
                title="باضابطہ 25 کالم قانونی فارم بمطابق مسلم فیملی لاز آرڈیننس 1961ء"
              >
                <span>📋 باضابطہ 25 کالم (کالمز کے مطابق)</span>
              </button>
              <button
                type="button"
                onClick={() => setNikahPrintMode('summary_card')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-header-urdu flex items-center gap-1 ${
                  nikahPrintMode === 'summary_card'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950'
                }`}
                title="مختصر دفتری کارڈ و خلاصہ"
              >
                <span>📜 دفتری کارڈ / خلاصہ</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Printer className="w-3.5 h-3.5 text-emerald-800" />
              <span className="font-urdu font-semibold text-xs text-neutral-800">
                پرنٹ دستاویز و A4 پی ڈی ایف منظر
              </span>
            </div>
          )}

          <div className="flex items-center flex-wrap gap-1.5">
            {/* Standard Desktop/Iframe Print */}
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 font-header-urdu"
              title="براہ راست پرنٹ یا PDF محفوظ کریں"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ کریں</span>
            </button>

            {/* Mobile Print & Share Helper */}
            <button
              onClick={() => {
                shareOrDownloadMobileDoc(
                  'modal-printable-document',
                  `Document_${docType}_${record?.registrationNo || record?.id || Date.now()}`
                );
              }}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all font-header-urdu border border-cyan-600/30"
              title="موبائل پرنٹ و شیئر (Android / iOS / PDF)"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-200" />
              <span>موبائل پرنٹ / PDF</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              type="button"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold font-header-urdu border border-neutral-300"
              title="HTML فائل ڈاؤنلوڈ"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤنلوڈ</span>
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
              title="بند کریں"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable A4 Page with Islamic Frame */}
        <div className="overflow-y-auto p-2 sm:p-5 flex-1 bg-neutral-100 print:bg-white print:p-0">
          <div
            id="modal-printable-document"
            ref={printAreaRef}
            className={`print-page bg-[#FFFDF5] p-3 sm:p-6 md:p-7 border-2 border-emerald-900 relative min-h-[750px] flex flex-col justify-between ${
              docType === 'nikah' && nikahPrintMode === 'official_25_columns'
                ? 'max-w-4xl'
                : 'max-w-3xl'
            } mx-auto shadow-md`}
            style={{
              boxShadow: '0 0 0 1px #D4AF37, 0 0 0 3px #087443',
              fontFamily: 'var(--app-font-family)',
            }}
          >
          {/* Subtle Islamic Watermark */}
          {settings.showWatermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none">
              <Emblem size={380} />
            </div>
          )}

          <div>
            {/* Compact Official Header Pad (Rendered for summary card and other documents) */}
            {!(docType === 'nikah' && nikahPrintMode === 'official_25_columns') && (
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-1.5 mb-2.5">
                <div className="w-12 text-center shrink-0">
                  <Emblem size={34} />
                </div>

                <div className="flex-1 text-center px-2">
                  <div className="text-[9px] font-arabic font-bold text-emerald-900 tracking-wider">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                  <h1 className="font-header-urdu font-bold text-[13px] sm:text-[15px] text-emerald-950 mt-0.5 leading-tight">
                    {settings.qaziName}
                  </h1>
                  <div className="text-[9.5px] font-semibold text-emerald-800 font-header-urdu leading-tight">
                    {settings.qaziTitle} · رجسٹریشن نمبر: {settings.qaziRegistrationNo}
                  </div>
                  <p className="text-[8px] text-neutral-600 font-header-urdu leading-tight mt-0.5">
                    {settings.officeAddress} · فون: {settings.contactNumber}
                  </p>
                </div>

                <div className="w-12 shrink-0 flex flex-col items-center justify-center p-0.5 border border-emerald-900/20 rounded bg-white/70">
                  <QrCode className="w-7 h-7 text-emerald-900" />
                  <span className="text-[6.5px] font-mono text-neutral-500">تصدیق</span>
                </div>
              </div>
            )}

            {/* Dynamic Body Content */}
            {renderContent()}
          </div>

          {/* Official Signatures & Seal Section (Hidden in 25-column format as column 24 and 25 are the statutory signatures & stamp) */}
          {!(docType === 'nikah' && nikahPrintMode === 'official_25_columns') && (
            <div className="mt-8 pt-4 border-t-2 border-emerald-900/40">
              <div className="grid grid-cols-3 gap-4 text-center text-xs font-urdu">
                {/* Party / Applicant Signature */}
                <div className="flex flex-col items-center justify-end h-24">
                  <div className="w-32 border-b border-neutral-500 mb-1"></div>
                  <span className="font-bold text-neutral-800">دستخط سائل / دولہا / فریق</span>
                  <span className="text-[10px] text-neutral-500">العارض / دستخط و انگوٹھا</span>
                </div>

                {/* Official Seal */}
                <div className="flex flex-col items-center justify-center">
                  {settings.showSealOnPrint && (
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-800 flex flex-col items-center justify-center p-1 text-center bg-emerald-50/50 transform -rotate-6">
                      <Stamp className="w-5 h-5 text-emerald-800 mb-0.5" />
                      <span className="text-[9px] font-bold text-emerald-950 leading-tight">
                        مہر دفتری
                      </span>
                      <span className="text-[8px] text-emerald-800 leading-tight">
                        قاضی محمد شاہد عطاری
                      </span>
                      <span className="text-[7px] text-neutral-600 font-mono">
                        DAR-UL-QAZA
                      </span>
                    </div>
                  )}
                </div>

                {/* Qazi / Registrar Signature */}
                <div className="flex flex-col items-center justify-end h-24">
                  {settings.showSignatureOnPrint && (
                    <div className="font-arabic text-emerald-900 text-sm italic font-bold mb-1">
                      محمد شاہد عطاری مدنی (عفی عنہ)
                    </div>
                  )}
                  <div className="w-36 border-b-2 border-emerald-900 mb-1"></div>
                  <span className="font-bold text-emerald-950">{settings.qaziName}</span>
                  <span className="text-[10px] text-emerald-800">{settings.qaziTitle}</span>
                </div>
              </div>

              {/* Mandatory Legal Safeguard Disclaimer */}
              <div className="mt-4 pt-2 border-t border-neutral-300 text-[9px] text-neutral-600 text-center font-urdu leading-tight">
                <strong>قانوناً و شرعاً ضروری وضاحت:</strong> {settings.disclaimerText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Prominent Navigation & Print Footer */}
        <div className="no-print bg-neutral-100 border-t border-neutral-300 p-2.5 px-4 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs shadow-xs transition-all font-header-urdu"
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
