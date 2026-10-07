import React, { useState } from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  Download,
  Calendar,
  Building,
  UserCheck,
  Shield,
  Stamp,
  BookOpen,
  ArrowRight,
  Eye,
  Share2,
} from 'lucide-react';
import { NikahRecord, OfficeSettings } from '../../types';
import { storageService } from '../../services/storage';
import { Emblem } from '../common/Emblem';
import { triggerReliablePrint, shareOrDownloadMobileDoc } from '../../utils/urduUtils';

interface OfficialNikahNamaFormViewProps {
  onBack?: () => void;
}

export const OfficialNikahNamaFormView: React.FC<OfficialNikahNamaFormViewProps> = ({ onBack }) => {
  const nikahs = storageService.getNikahs();
  const settings = storageService.getSettings();

  const [selectedNikahId, setSelectedNikahId] = useState<string>(
    nikahs.length > 0 ? nikahs[0].id : ''
  );

  const currentNikah = nikahs.find((n) => n.id === selectedNikahId) || nikahs[0];

  const handlePrintForm = () => {
    triggerReliablePrint('official-nikah-nama-form-25');
  };

  const handleMobilePrintOrShare = () => {
    shareOrDownloadMobileDoc(
      'official-nikah-nama-form-25',
      `NikahNama_Form_II_${currentNikah?.registrationNo || 'Form'}`
    );
  };

  if (!currentNikah) {
    return (
      <div className="p-8 text-center text-neutral-500 font-urdu">
        کوئی نکاح ریکارڈ موجود نہیں ہے۔ براہ کرم پہلے نکاح درج فرمائیں۔
      </div>
    );
  }

  const g = currentNikah.groom;
  const b = currentNikah.bride;
  const m = currentNikah.mehr;

  return (
    <div className="space-y-4 font-urdu">
      {/* Top Banner & Selector - Clean, Light & Compact */}
      <div className="no-print bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs text-neutral-900 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs shadow-2xs transition-all font-header-urdu active:scale-95 border border-neutral-300"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>← واپس</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-emerald-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>اصلی نکاح نامہ (فارم دوم - 25 کالم باضابطہ قانونی فارم)</span>
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-header-urdu mt-0.5">
              مسلم فیملی لاز آرڈیننس 1961ء (قاعدہ 8 و 10) · کالمز کے عین مطابق
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded-xl border border-neutral-300 text-xs font-header-urdu">
            <span className="text-emerald-900 font-bold text-xs">نکاح:</span>
            <select
              value={selectedNikahId}
              onChange={(e) => setSelectedNikahId(e.target.value)}
              className="text-xs border-0 bg-transparent text-neutral-900 font-mono focus:outline-hidden"
            >
              {nikahs.map((n) => (
                <option key={n.id} value={n.id} className="text-neutral-900">
                  {n.registrationNo} — {n.groom.fullName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrintForm}
            type="button"
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all font-header-urdu"
            title="براہ راست 25 کالم فارم پرنٹ کریں"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>پرنٹ 25 کالم</span>
          </button>

          <button
            onClick={handleMobilePrintOrShare}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all font-header-urdu border border-cyan-600/30"
            title="موبائل پرنٹ و شیئر (Android / iOS / PDF)"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-200" />
            <span>موبائل پرنٹ / PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable 25-Column Official Form Container */}
      <div className="bg-neutral-100 p-2 sm:p-5 rounded-2xl overflow-x-auto print:p-0 print:bg-white">
        <div
          id="official-nikah-nama-form-25"
          className="print-page bg-[#FFFDF5] p-4 sm:p-7 rounded-xl border-2 border-emerald-900 mx-auto max-w-4xl shadow-xl space-y-3 text-sm leading-relaxed"
          style={{
            boxShadow: '0 0 0 1px #D4AF37, 0 0 0 3px #087443',
            fontFamily: 'var(--app-font-family)',
          }}
        >
          {/* Compact Header of Form II */}
          <div className="border-b border-emerald-900/60 pb-2 text-center space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono border border-emerald-800 px-2 py-0.5 rounded text-emerald-900">
                رجسٹریشن نمبر: {currentNikah.registrationNo}
              </span>
              <Emblem size={34} />
              <span className="text-[9px] font-mono border border-emerald-800 px-2 py-0.5 rounded text-emerald-900">
                جلد نمبر: {currentNikah.nikahNamaNo}
              </span>
            </div>

            <div className="text-[9.5px] font-arabic font-bold text-emerald-900 tracking-wider">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h1 className="font-header-urdu font-extrabold text-base sm:text-lg text-emerald-950 leading-tight">
              فارم دوم (نکاح نامہ)
            </h1>
            <p className="text-[9.5px] font-bold text-emerald-900 font-header-urdu leading-tight">
              بمطابق قواعد مغربی پاکستان مجریہ زیر دفعہ 5 مسلم فیملی لاز آرڈیننس 1961ء (قاعدہ 8 و 10)
            </p>
            <p className="text-[8.5px] text-neutral-600 font-header-urdu leading-tight">
              دفتر قاضی و نکاح رجسٹرار: {settings.qaziName} ({settings.qaziTitle}) · لائسنس نمبر: {settings.qaziRegistrationNo}
            </p>
          </div>

          {/* 25-Column Classical Table */}
          <div className="border border-emerald-900 overflow-hidden rounded bg-white">
            <table className="w-full text-right text-[11px] border-collapse">
              <thead>
                <tr className="bg-emerald-900 text-white font-header-urdu font-bold">
                  <th className="p-2 border border-emerald-800 text-center w-12">کالم</th>
                  <th className="p-2 border border-emerald-800 w-1/3">سوال / کوائف نامہ</th>
                  <th className="p-2 border border-emerald-800">تفصیلات و جوابات فریقین</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/20 font-urdu">
                {/* Column 1 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">1</td>
                  <td className="p-2 border border-neutral-300 font-bold">نام وارڈ / یونین کونسل، قصبہ، تحصیل و ضلع جس میں شادی واقع ہوئی:</td>
                  <td className="p-2 border border-neutral-300">{currentNikah.unionCouncil}، تحصیل {currentNikah.tehsil}، ضلع {currentNikah.district} (بمقام: {currentNikah.place})</td>
                </tr>

                {/* Column 2 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">2</td>
                  <td className="p-2 border border-neutral-300 font-bold">دولہا اور اس کے باپ کا نام معہ سکونت:</td>
                  <td className="p-2 border border-neutral-300">
                    <strong>{g.fullName}</strong> ولد <strong>{g.fatherName}</strong> | شناختی کارڈ: <span className="font-mono">{g.cnic}</span> | پتہ: {g.address}
                  </td>
                </tr>

                {/* Column 3 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">3</td>
                  <td className="p-2 border border-neutral-300 font-bold">دولہا کی عمر:</td>
                  <td className="p-2 border border-neutral-300 font-mono font-bold">{g.age} سال (تاریخ پیدائش: {g.dob})</td>
                </tr>

                {/* Column 4 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">4</td>
                  <td className="p-2 border border-neutral-300 font-bold">اگر دولہا کی طرف سے وکیل مقرر ہوا ہو تو اس کا نام معہ ولدیت و سکونت:</td>
                  <td className="p-2 border border-neutral-300">{currentNikah.wakeelGroom?.name ? `${currentNikah.wakeelGroom.name} ولد ${currentNikah.wakeelGroom.fatherName}` : 'دولہا اصالتاً خود حاضر مجلس عقد رہا۔'}</td>
                </tr>

                {/* Column 5 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">5</td>
                  <td className="p-2 border border-neutral-300 font-bold">دولہا کے وکیل کے تقرر کے گواہان معہ نام و ولدیت و سکونت:</td>
                  <td className="p-2 border border-neutral-300">دولہا خود بالمشافہ حاضر تھا۔</td>
                </tr>

                {/* Column 6 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">6</td>
                  <td className="p-2 border border-neutral-300 font-bold">دلہن اور اس کے والد کا نام معہ سکونت:</td>
                  <td className="p-2 border border-neutral-300">
                    <strong>{b.fullName}</strong> بنت <strong>{b.fatherName}</strong> | شناختی کارڈ: <span className="font-mono">{b.cnic}</span> | پتہ: {b.address}
                  </td>
                </tr>

                {/* Column 7 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">7</td>
                  <td className="p-2 border border-neutral-300 font-bold">دلہن کنواری ہے، بیوہ ہے یا مطلقہ:</td>
                  <td className="p-2 border border-neutral-300 font-bold text-emerald-900">{b.maritalStatus}</td>
                </tr>

                {/* Column 8 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">8</td>
                  <td className="p-2 border border-neutral-300 font-bold">دلہن کی عمر:</td>
                  <td className="p-2 border border-neutral-300 font-mono font-bold">{b.age} سال (تاریخ پیدائش: {b.dob})</td>
                </tr>

                {/* Column 9 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">9</td>
                  <td className="p-2 border border-neutral-300 font-bold">اگر دلہن کی طرف سے وکیل مقرر ہوا ہو تو اس کا نام معہ ولدیت و پتہ:</td>
                  <td className="p-2 border border-neutral-300">
                    {currentNikah.wakeelBride?.name ? (
                      <span><strong>{currentNikah.wakeelBride.name}</strong> ولد {currentNikah.wakeelBride.fatherName} (شناختی کارڈ: <span className="font-mono">{currentNikah.wakeelBride.cnic}</span>)</span>
                    ) : (
                      'دلہن اصالتاً باحجاب حاضر و راضی تھی۔'
                    )}
                  </td>
                </tr>

                {/* Column 10 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">10</td>
                  <td className="p-2 border border-neutral-300 font-bold">دلہن کے وکیل کے تقرر کی تصدیق کرنے والے گواہان کے نام معہ ولدیت:</td>
                  <td className="p-2 border border-neutral-300">
                    1. {currentNikah.witnesses[0]?.name} ولد {currentNikah.witnesses[0]?.fatherName} | 2. {currentNikah.witnesses[1]?.name} ولد {currentNikah.witnesses[1]?.fatherName}
                  </td>
                </tr>

                {/* Column 11 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">11</td>
                  <td className="p-2 border border-neutral-300 font-bold">اگر دلہن نابالغہ ہو تو اس کے ولی کا نام و ولدیت اور رشتہ:</td>
                  <td className="p-2 border border-neutral-300">دلہن بالغہ و عاقلہ ہے (ولی شرعی بحیثیت والد: {currentNikah.brideGuardian?.name || b.fatherName})</td>
                </tr>

                {/* Column 12 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">12</td>
                  <td className="p-2 border border-neutral-300 font-bold">نکاح کے گواہان کے نام، ولدیت معہ سکونت اور شناختی کارڈ:</td>
                  <td className="p-2 border border-neutral-300 space-y-1">
                    {currentNikah.witnesses.map((w, idx) => (
                      <div key={idx}>
                        گواہ {idx + 1}: <strong>{w.name}</strong> ولد {w.fatherName} (شناختی کارڈ: <span className="font-mono">{w.cnic}</span>)
                      </div>
                    ))}
                  </td>
                </tr>

                {/* Column 13 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">13</td>
                  <td className="p-2 border border-neutral-300 font-bold">تاریخ جس روز نکاح منعقد ہوا:</td>
                  <td className="p-2 border border-neutral-300 font-mono font-bold text-emerald-900">
                    {currentNikah.date} عیسوی ({currentNikah.hijriDate || '1448ھ'})
                  </td>
                </tr>

                {/* Column 14 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">14</td>
                  <td className="p-2 border border-neutral-300 font-bold">مہر کی رقم / تفصیل:</td>
                  <td className="p-2 border border-neutral-300 font-mono font-bold text-amber-950">
                    روپے {m.totalAgreedAmount.toLocaleString()} ({m.type} - {m.metalType || 'نقد رقم'})
                  </td>
                </tr>

                {/* Column 15 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">15</td>
                  <td className="p-2 border border-neutral-300 font-bold">مہر میں سے معجل کتنی ہے اور مؤجل کتنی ہے:</td>
                  <td className="p-2 border border-neutral-300">
                    معجل: <strong className="font-mono text-emerald-800">روپے {m.muajjalAmount.toLocaleString()}</strong> |
                    مؤجل: <strong className="font-mono text-rose-800">روپے {m.muakhkharAmount.toLocaleString()}</strong>
                  </td>
                </tr>

                {/* Column 16 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">16</td>
                  <td className="p-2 border border-neutral-300 font-bold">آیا مہر کا کچھ حصہ نکاح کے وقت ادا کر دیا گیا اور اگر کر دیا گیا تو کتنا؟</td>
                  <td className="p-2 border border-neutral-300 font-bold text-emerald-900">
                    {m.amountReceived > 0 ? `روپے ${m.amountReceived.toLocaleString()} بموجب رسید بوقت نکاح ادا کیا گیا۔` : 'نہیں، مؤجل طے پایا۔'}
                  </td>
                </tr>

                {/* Column 17 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">17</td>
                  <td className="p-2 border border-neutral-300 font-bold">آیا مہر کے کل یا کسی حصہ کے عوض کوئی جائیداد دی گئی:</td>
                  <td className="p-2 border border-neutral-300">{m.propertyDetails || 'کوئی جائیداد نہیں دی گئی۔ صرف نقد / طلائی مہر طے پایا۔'}</td>
                </tr>

                {/* Column 18 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">18</td>
                  <td className="p-2 border border-neutral-300 font-bold">نان و نفقہ یا رہائش وغیرہ کے متعلق خاص شرائط:</td>
                  <td className="p-2 border border-neutral-300">{currentNikah.specialConditions || 'روایتی شرعی نان و نفقہ اور رہائش کی ذمہ داری شوہر پر طے پائی۔'}</td>
                </tr>

                {/* Column 19 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">19</td>
                  <td className="p-2 border border-neutral-300 font-bold">آیا شوہر نے طلاق کا حق بیوی کو تفویض کیا ہے اور کن شرائط پر؟</td>
                  <td className="p-2 border border-neutral-300 font-bold">تفویض نہیں کیا گیا۔ (یا بمطابق باہمی اتفاق رائے)</td>
                </tr>

                {/* Column 20 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">20</td>
                  <td className="p-2 border border-neutral-300 font-bold">آیا شوہر کے طلاق دینے کے حق پر کسی قسم کی پابندی ہے؟</td>
                  <td className="p-2 border border-neutral-300">کوئی غیر شرعی پابندی نہیں۔</td>
                </tr>

                {/* Column 21 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">21</td>
                  <td className="p-2 border border-neutral-300 font-bold">مہر اور نان و نفقہ وغیرہ کے متعلق کوئی معاہدہ یا دستاویز لکھی گئی ہو:</td>
                  <td className="p-2 border border-neutral-300 font-mono">اسٹامپ پیپر نمبر: {currentNikah.stampPaperNo || 'PB-STP-2026-90412'}</td>
                </tr>

                {/* Column 22 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">22</td>
                  <td className="p-2 border border-neutral-300 font-bold">آیا دولہا کی کوئی اور بیوی موجود ہے اور کیا اس نے ثالثی کونسل سے اجازت لی:</td>
                  <td className="p-2 border border-neutral-300 font-bold">دولہا کنوارا ہے، کوئی دوسری بیوی موجود نہیں۔</td>
                </tr>

                {/* Column 23 */}
                <tr className="hover:bg-neutral-50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">23</td>
                  <td className="p-2 border border-neutral-300 font-bold">اگر دولہا کی دوسری شادی ہو تو اجازت نامہ ثالثی کونسل کا نمبر و تاریخ:</td>
                  <td className="p-2 border border-neutral-300 font-mono">لاگو نہیں ہوتا (N/A)</td>
                </tr>

                {/* Column 24 */}
                <tr className="hover:bg-neutral-50 bg-neutral-50/50">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">24</td>
                  <td className="p-2 border border-neutral-300 font-bold">دستخط دولہا، دلہن، ان کے وکلاء اور گواہان:</td>
                  <td className="p-2 border border-neutral-300">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1 pb-1">
                      <div className="border p-1 bg-white rounded">دستخط دولہا</div>
                      <div className="border p-1 bg-white rounded">دستخط دلہن</div>
                      <div className="border p-1 bg-white rounded">دستخط گواہ 1</div>
                      <div className="border p-1 bg-white rounded">دستخط گواہ 2</div>
                    </div>
                  </td>
                </tr>

                {/* Column 25 */}
                <tr className="hover:bg-neutral-50 bg-emerald-50/30">
                  <td className="p-2 border border-neutral-300 text-center font-mono font-bold text-emerald-900">25</td>
                  <td className="p-2 border border-neutral-300 font-bold">نکاح رجسٹرار کا نام، ولدیت، دفتری رجسٹریشن اور دستخط و مہر:</td>
                  <td className="p-2 border border-neutral-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{settings.qaziName}</strong> ({settings.qaziTitle})
                        <span className="block font-mono text-[10px] text-neutral-600">
                          لائسنس رجسٹریشن: {settings.qaziRegistrationNo}
                        </span>
                      </div>
                      <div className="text-center pl-4">
                        <span className="font-arabic text-emerald-900 text-xs italic font-bold block">
                          محمد شاہد عطاری مدنی (عفی عنہ)
                        </span>
                        <span className="text-[9px] text-neutral-500">دستخط و مہرِ نکاح رجسٹرار</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mandatory Safeguard Disclaimer */}
          <div className="text-center pt-2 border-t border-neutral-300 text-[9px] text-neutral-600 font-header-urdu">
            {settings.disclaimerText}
          </div>
        </div>
      </div>
    </div>
  );
};
