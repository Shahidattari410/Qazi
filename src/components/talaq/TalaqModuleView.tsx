import React, { useState } from 'react';
import {
  Scale,
  PlusCircle,
  Search,
  Printer,
  FileText,
  AlertTriangle,
  Building2,
  Calendar,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { TalaqRecord, TalaqStatus, User } from '../../types';
import { storageService } from '../../services/storage';

interface TalaqModuleViewProps {
  user: User;
  onOpenPrint: (record: TalaqRecord) => void;
}

export const TalaqModuleView: React.FC<TalaqModuleViewProps> = ({ user, onOpenPrint }) => {
  const [records, setRecords] = useState<TalaqRecord[]>(() => storageService.getTalaqRecords());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<TalaqRecord>>({
    caseNo: 'TLQ-2026-0' + (records.length + 15),
    husbandName: '',
    husbandCnic: '',
    wifeName: '',
    wifeCnic: '',
    talaqDate: new Date().toISOString().split('T')[0],
    noticeDate: new Date().toISOString().split('T')[0],
    type: 'طلاقِ بائن',
    unionCouncil: 'یونین کونسل 118',
    tehsil: 'ماڈل ٹاؤن',
    district: 'لاہور',
    status: 'نوٹس جاری',
    arbitrationCouncilNoticeSent: true,
    notes: 'تحریری طلاق نامہ بمطابق شرع جاری کیا گیا۔ مصالحتی کونسل کو باضابطہ نوٹس ارسال ہے۔',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.husbandName || !formData.wifeName) {
      alert('براہ کرم شوہر اور زوجہ کا نام درج فرمائیں۔');
      return;
    }

    const now = new Date().toISOString();
    const newRecord: TalaqRecord = {
      ...(formData as TalaqRecord),
      id: 'tlq-' + Date.now(),
      createdAt: now,
      updatedAt: now,
      createdBy: user.name,
    };

    const updated = [newRecord, ...records];
    storageService.saveTalaqRecords(updated);
    setRecords(updated);
    storageService.logAction(
      'CREATE',
      'TALAQ',
      newRecord.id,
      `طلاق کا دفتری اندراج: ${newRecord.caseNo} (${newRecord.husbandName})`,
      user
    );
    setIsModalOpen(false);
  };

  const filtered = records.filter(
    (r) =>
      r.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.husbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.wifeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.husbandCnic.includes(searchTerm) ||
      r.wifeCnic.includes(searchTerm)
  );

  return (
    <div className="space-y-3.5 font-urdu">
      {/* Top Heading Box - Royal Sapphire-Crimson Typography Arch */}
      <div className="bg-linear-to-r from-[#2a0815] via-[#4a1224] to-[#122240] p-3 sm:p-4 rounded-2xl border-2 border-rose-400/50 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-400 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-white flex items-center gap-1.5 leading-tight">
                <span>طلاق ریکارڈ و مصالحتی نوٹسز مینجمنٹ</span>
              </h2>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-400/20 border border-rose-300/40 text-rose-200">
                {records.length} ریکارڈز
              </span>
            </div>
            <p className="text-[11px] text-rose-200/90 font-header-urdu mt-0.5">
              دفتری شرعی اندراج، نوٹس چیئرمین یونین کونسل مصالحتی کونسل اور عدت ریکارڈ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white text-xs font-bold shadow-sm transition-all font-header-urdu active:scale-95 border border-rose-300/30"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-200" />
          <span>نیا طلاق ریکارڈ درج کریں</span>
        </button>
      </div>

      {/* Legal Safeguard Warning Box */}
      <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl flex items-start gap-3 text-xs text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">شرعی و قانونی رہنما اصول برائے طلاق ریکارڈ:</span>
          <p className="opacity-90">
            یہ قاضی دفتر کا ریکارڈ ہے، حتمی اور موثر طلاق کا سرٹیفکیٹ عائلی قوانین 1961 کے تحت متعلقہ یونین کونسل مصالحتی کارروائی کے 90 یوم بعد جاری کرتی ہے۔
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="کیس نمبر، شوہر یا بیوی کا نام، شناختی کارڈ سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-rose-800"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">کل ریکارڈز: {filtered.length}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-100 border-b font-bold text-neutral-800">
              <tr>
                <th className="p-3">کیس نمبر</th>
                <th className="p-3">شوہر (طلاق دہندہ)</th>
                <th className="p-3">مطلقہ خاتون (زوجہ)</th>
                <th className="p-3">تاریخ طلاق و نوٹس</th>
                <th className="p-3">قسم طلاق</th>
                <th className="p-3">حالت</th>
                <th className="p-3 text-center">پرنٹ و ایکشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-mono font-bold text-rose-900">{r.caseNo}</td>
                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{r.husbandName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{r.husbandCnic}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{r.wifeName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{r.wifeCnic}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-mono text-neutral-900">{r.talaqDate}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">نوٹس: {r.noticeDate}</div>
                  </td>
                  <td className="p-3 font-medium text-neutral-800">{r.type}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onOpenPrint(r)}
                      className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] inline-flex items-center gap-1 font-medium"
                    >
                      <Printer className="w-3.5 h-3.5 text-neutral-600" />
                      <span>نوٹس پرنٹ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Talaq Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl text-right">
            <h3 className="font-bold text-base text-rose-950 border-b pb-2">
              نیا دفتری اندراج طلاق و نوٹس مصالحتی کونسل
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">کیس نمبر:</label>
                  <input
                    type="text"
                    required
                    value={formData.caseNo}
                    onChange={(e) => setFormData({ ...formData, caseNo: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">منسلک نکاح نمبر (اگر ہو):</label>
                  <input
                    type="text"
                    placeholder="اختیاری"
                    value={formData.linkedNikahNo || ''}
                    onChange={(e) => setFormData({ ...formData, linkedNikahNo: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">نام شوہر:</label>
                  <input
                    type="text"
                    required
                    value={formData.husbandName}
                    onChange={(e) => setFormData({ ...formData, husbandName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">شناختی کارڈ شوہر:</label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.husbandCnic}
                    onChange={(e) => setFormData({ ...formData, husbandCnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">نام خاتون (زوجہ):</label>
                  <input
                    type="text"
                    required
                    value={formData.wifeName}
                    onChange={(e) => setFormData({ ...formData, wifeName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">شناختی کارڈ زوجہ:</label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.wifeCnic}
                    onChange={(e) => setFormData({ ...formData, wifeCnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">تاریخِ طلاق:</label>
                  <input
                    type="date"
                    required
                    value={formData.talaqDate}
                    onChange={(e) => setFormData({ ...formData, talaqDate: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">تاریخِ نوٹس:</label>
                  <input
                    type="date"
                    value={formData.noticeDate}
                    onChange={(e) => setFormData({ ...formData, noticeDate: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">قسمِ طلاق:</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full text-xs border rounded p-1.5 bg-white"
                  >
                    <option value="طلاقِ بائن">طلاقِ بائن</option>
                    <option value="طلاقِ احسن">طلاقِ احسن</option>
                    <option value="طلاقِ حسن">طلاقِ حسن</option>
                    <option value="طلاقِ مغلظہ (ثلاثہ)">طلاقِ مغلظہ (ثلاثہ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700">دفتری نوٹس و تفصیل:</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs border rounded p-1.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded text-neutral-600 hover:bg-neutral-100"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-rose-800 hover:bg-rose-900 text-white font-bold"
                >
                  ریکارڈ محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
