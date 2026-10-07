import React, { useState } from 'react';
import {
  Stamp,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertOctagon,
  FileText,
} from 'lucide-react';
import { StampRecord, StampStatus, User } from '../../types';
import { storageService } from '../../services/storage';

interface StampPaperViewProps {
  user: User;
}

export const StampPaperView: React.FC<StampPaperViewProps> = ({ user }) => {
  const [stamps, setStamps] = useState<StampRecord[]>(() => storageService.getStamps());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<StampRecord>>({
    stampNo: '',
    stampValue: 100,
    vendor: 'ملک اصغر اسٹامپ فروش، کچہری لاہور',
    purchaseDate: new Date().toISOString().split('T')[0],
    purpose: 'اندراج نکاح نامہ و بیان حلفی',
    status: 'Unused',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanStampNo = formData.stampNo?.trim().toUpperCase();
    if (!cleanStampNo) {
      setErrorMsg('اسٹامپ نمبر درج کرنا لازمی ہے۔');
      return;
    }

    // Prevent duplicate stamp number check
    const duplicate = stamps.find(
      (s) => s.stampNo.trim().toUpperCase() === cleanStampNo
    );
    if (duplicate) {
      setErrorMsg(`یہ اسٹامپ نمبر "${cleanStampNo}" پہلے سے ریکارڈ میں موجود ہے! دہرا اندراج ممنوع ہے۔`);
      return;
    }

    const now = new Date().toISOString();
    const newRecord: StampRecord = {
      ...(formData as StampRecord),
      id: 'stp-' + Date.now(),
      stampNo: cleanStampNo,
      createdAt: now,
      createdBy: user.name,
    };

    const updated = [newRecord, ...stamps];
    storageService.saveStamps(updated);
    setStamps(updated);
    storageService.logAction(
      'CREATE',
      'STAMP',
      newRecord.id,
      `نیا اسٹامپ پیپر شامل کیا گیا: ${newRecord.stampNo} (مالیت ${newRecord.stampValue} روپے)`,
      user
    );
    setIsModalOpen(false);
    setFormData({
      stampNo: '',
      stampValue: 100,
      vendor: 'ملک اصغر اسٹامپ فروش، کچہری لاہور',
      purchaseDate: new Date().toISOString().split('T')[0],
      purpose: 'اندراج نکاح نامہ و بیان حلفی',
      status: 'Unused',
    });
  };

  const handleStatusChange = (id: string, newStatus: StampStatus) => {
    const updated = stamps.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
    storageService.saveStamps(updated);
    setStamps(updated);
    storageService.logAction(
      'UPDATE',
      'STAMP',
      id,
      `اسٹامپ پیپر کی حالت تبدیل کی گئی: ${newStatus}`,
      user
    );
  };

  const filtered = stamps.filter((s) => {
    const matchesSearch =
      s.stampNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.personName && s.personName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.relatedCase && s.relatedCase.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unusedCount = stamps.filter((s) => s.status === 'Unused').length;
  const usedCount = stamps.filter((s) => s.status === 'Used').length;

  return (
    <div className="space-y-5 font-urdu">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
            <Stamp className="w-5 h-5 text-amber-600" />
            <span>اسٹامپ پیپر انوینٹری و استعمال رجسٹر</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            دستیاب اسٹاک: {unusedCount} | استعمال شدہ: {usedCount} | ڈپلیکیٹ نمبر روک تھام کا تحفظ
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>نیا اسٹامپ پیپر شامل کریں</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="اسٹامپ نمبر، سائل، کیس نمبر، یا فروشندہ سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-emerald-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-neutral-300 rounded-lg p-1.5 bg-white text-neutral-800"
          >
            <option value="all">تمام حالتیں</option>
            <option value="Unused">دستیاب (Unused)</option>
            <option value="Used">استعمال شدہ (Used)</option>
            <option value="Cancelled">منسوخ شدہ (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-100 border-b font-bold text-neutral-800">
              <tr>
                <th className="p-3">اسٹامپ نمبر</th>
                <th className="p-3">مالیت</th>
                <th className="p-3">فروشندہ (Vendor)</th>
                <th className="p-3">تاریخ خریداری</th>
                <th className="p-3">منسلک کیس / سائل</th>
                <th className="p-3">حالت</th>
                <th className="p-3 text-center">تبدیل حالت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-urdu">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-mono font-bold text-emerald-950">{s.stampNo}</td>
                  <td className="p-3 font-mono text-neutral-800">روپے {s.stampValue}</td>
                  <td className="p-3">{s.vendor}</td>
                  <td className="p-3 font-mono">{s.purchaseDate}</td>
                  <td className="p-3">
                    {s.relatedCase ? (
                      <div>
                        <span className="font-mono text-emerald-800 font-bold block">{s.relatedCase}</span>
                        <span className="text-[10px] text-neutral-500">{s.personName}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-400">غیر استعمال شدہ</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.status === 'Unused'
                          ? 'bg-emerald-100 text-emerald-900'
                          : s.status === 'Used'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {s.status === 'Unused' ? 'دستیاب' : s.status === 'Used' ? 'استعمال شدہ' : 'منسوخ'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <select
                      value={s.status}
                      onChange={(e) => handleStatusChange(s.id, e.target.value as StampStatus)}
                      className="text-[11px] border border-neutral-300 rounded p-1 bg-white"
                    >
                      <option value="Unused">دستیاب</option>
                      <option value="Used">استعمال شدہ</option>
                      <option value="Cancelled">منسوخ</option>
                    </select>
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
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-right">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">
              نیا اسٹامپ پیپر شامل کریں
            </h3>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-300 text-rose-900 p-2.5 rounded text-xs flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0 text-rose-700" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-neutral-700 font-bold">
                  اسٹامپ پیپر سیریل نمبر:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: PB-STP-2026-99101"
                  value={formData.stampNo}
                  onChange={(e) => setFormData({ ...formData, stampNo: e.target.value })}
                  className="w-full font-mono text-xs border border-neutral-300 rounded p-2 focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700 font-bold">مالیت (روپے):</label>
                  <input
                    type="number"
                    required
                    value={formData.stampValue}
                    onChange={(e) => setFormData({ ...formData, stampValue: parseInt(e.target.value) || 100 })}
                    className="w-full font-mono text-xs border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700 font-bold">تاریخ خریداری:</label>
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700">اسٹامپ فروش (Vendor):</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-neutral-700">مقصد برائے اسٹاک:</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full text-xs border rounded p-2"
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
                  className="px-4 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  اسٹامپ محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
