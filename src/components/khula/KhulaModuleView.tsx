import React, { useState } from 'react';
import {
  Scale,
  PlusCircle,
  Search,
  Printer,
  FileCheck2,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { KhulaRecord, KhulaStatus, User } from '../../types';
import { storageService } from '../../services/storage';

interface KhulaModuleViewProps {
  user: User;
  onOpenPrint: (record: KhulaRecord) => void;
}

export const KhulaModuleView: React.FC<KhulaModuleViewProps> = ({ user, onOpenPrint }) => {
  const [records, setRecords] = useState<KhulaRecord[]>(() => storageService.getKhulaRecords());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<KhulaRecord>>({
    caseNo: 'KHL-2026-0' + (records.length + 9),
    wifeName: '',
    wifeCnic: '',
    husbandName: '',
    husbandCnic: '',
    applicationDate: new Date().toISOString().split('T')[0],
    courtCaseNo: 'Family Suit # ',
    courtName: 'عدالتِ جناب فیملی جج صاحب، لاہور',
    courtOrderDate: new Date().toISOString().split('T')[0],
    courtOrderDocument: 'ڈگری فسخ نکاح بدستور خلع برائے دفتری ریکارڈ',
    unionCouncil: 'یونین کونسل 124',
    tehsil: 'ماڈل ٹاؤن',
    district: 'لاہور',
    registrationStatus: 'حکم موصول',
    surrenderedMehrDetails: '25 فیصد حق مہر کی رقم واپس ادا کی گئی۔',
    notes: 'معزز فیملی کورٹ کی مصدقہ ڈگری دفتر میں جمع کروائی گئی۔ دفتری ریکارڈ میں اندراج مکمل ہے۔',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wifeName || !formData.husbandName) {
      alert('براہ کرم سائلہ اور مدعا علیہ کا نام درج فرمائیں۔');
      return;
    }

    const now = new Date().toISOString();
    const newRecord: KhulaRecord = {
      ...(formData as KhulaRecord),
      id: 'khl-' + Date.now(),
      createdAt: now,
      updatedAt: now,
      createdBy: user.name,
    };

    const updated = [newRecord, ...records];
    storageService.saveKhulaRecords(updated);
    setRecords(updated);
    storageService.logAction(
      'CREATE',
      'KHULA',
      newRecord.id,
      `خلع عدالتی ڈگری دفتری اندراج: ${newRecord.caseNo} (${newRecord.wifeName})`,
      user
    );
    setIsModalOpen(false);
  };

  const filtered = records.filter(
    (r) =>
      r.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.wifeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.husbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.courtCaseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.wifeCnic.includes(searchTerm)
  );

  return (
    <div className="space-y-3.5 font-urdu">
      {/* Top Heading Box - Royal Sapphire-Cobalt Typography Arch */}
      <div className="bg-linear-to-r from-[#0a1b38] via-[#163366] to-[#12427a] p-3 sm:p-4 rounded-2xl border-2 border-cyan-400/50 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-400 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-white flex items-center gap-1.5 leading-tight">
                <span>خلع و عدالتی ڈگری ریکارڈ مینجمنٹ</span>
              </h2>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/40 text-cyan-200">
                {records.length} ریکارڈز
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/90 font-header-urdu mt-0.5">
              عدالتی ڈگریوں کا دفتری اندراج، مہر واپسی کا تصفیہ اور یونین کونسل مصالحتی ریکارڈ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-sm transition-all font-header-urdu active:scale-95 border border-cyan-300/30"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-200" />
          <span>نیا خلع ریکارڈ درج کریں</span>
        </button>
      </div>

      {/* Distinction clarification notice */}
      <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-3 text-xs text-blue-950">
        <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">قانوناً ناگزیر تفریق (Important Legal Distinction):</span>
          <p className="opacity-90">
            خلع کا باضابطہ قانونی حکم فیملی کورٹ جاری کرتی ہے۔ یہ ریکارڈ محض قاضی رجسٹرار کے پاس شرعی و دفتری اندراج اور بعد ازاں یونین کونسل تصدیق کے لیے رکھا جاتا ہے۔
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="کیس نمبر، سائلہ، شوہر، شناختی کارڈ یا عدالتی نمبر سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-blue-800"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">کل کیسز: {filtered.length}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-100 border-b font-bold text-neutral-800">
              <tr>
                <th className="p-3">کیس نمبر</th>
                <th className="p-3">سائلہ (زوجہ)</th>
                <th className="p-3">مدعا علیہ (شوہر)</th>
                <th className="p-3">معزز عدالت و کیس نمبر</th>
                <th className="p-3">تاریخ ڈگری</th>
                <th className="p-3">حالت</th>
                <th className="p-3 text-center">پرنٹ و ایکشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-mono font-bold text-blue-900">{r.caseNo}</td>
                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{r.wifeName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{r.wifeCnic}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{r.husbandName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{r.husbandCnic}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-neutral-800">{r.courtName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{r.courtCaseNo}</div>
                  </td>
                  <td className="p-3 font-mono">{r.courtOrderDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-900">
                      {r.registrationStatus}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onOpenPrint(r)}
                      className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] inline-flex items-center gap-1 font-medium"
                    >
                      <Printer className="w-3.5 h-3.5 text-neutral-600" />
                      <span>ریکارڈ پرنٹ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl text-right">
            <h3 className="font-bold text-base text-blue-950 border-b pb-2">
              نیا دفتری اندراج خلع و عدالتی ڈگری
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
                  <label className="block mb-1 text-neutral-700">عدالتی سوٹ نمبر:</label>
                  <input
                    type="text"
                    required
                    value={formData.courtCaseNo}
                    onChange={(e) => setFormData({ ...formData, courtCaseNo: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">نام سائلہ (خاتون):</label>
                  <input
                    type="text"
                    required
                    value={formData.wifeName}
                    onChange={(e) => setFormData({ ...formData, wifeName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">شناختی کارڈ سائلہ:</label>
                  <input
                    type="text"
                    required
                    value={formData.wifeCnic}
                    onChange={(e) => setFormData({ ...formData, wifeCnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">نام مدعا علیہ (شوہر):</label>
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
                    value={formData.husbandCnic}
                    onChange={(e) => setFormData({ ...formData, husbandCnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">نام معزز عدالت:</label>
                  <input
                    type="text"
                    required
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">تاریخ فیصلہ / ڈگری:</label>
                  <input
                    type="date"
                    required
                    value={formData.courtOrderDate}
                    onChange={(e) => setFormData({ ...formData, courtOrderDate: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700">تفصیلات واپسی حق مہر:</label>
                <input
                  type="text"
                  value={formData.surrenderedMehrDetails || ''}
                  onChange={(e) => setFormData({ ...formData, surrenderedMehrDetails: e.target.value })}
                  placeholder="مثال: 25 فیصد مہر معجل کی واپسی بحکم عدالت"
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
                  className="px-4 py-1.5 rounded bg-blue-800 hover:bg-blue-900 text-white font-bold"
                >
                  خلع ریکارڈ محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
