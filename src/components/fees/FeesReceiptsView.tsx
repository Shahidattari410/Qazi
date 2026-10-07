import React, { useState } from 'react';
import {
  Receipt,
  PlusCircle,
  Search,
  Printer,
  DollarSign,
  Calendar,
  Wallet,
  CheckCircle,
  Trash2,
  FileEdit,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { FeeReceipt, User } from '../../types';
import { storageService } from '../../services/storage';
import { ReceiptPrintView } from './ReceiptPrintView';

interface FeesReceiptsViewProps {
  user: User;
  onOpenPrint: (receipt: FeeReceipt) => void;
  onNavigate?: (view: string) => void;
}

export const FeesReceiptsView: React.FC<FeesReceiptsViewProps> = ({ user, onOpenPrint, onNavigate }) => {
  const [fees, setFees] = useState<FeeReceipt[]>(() => storageService.getFees());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<FeeReceipt | null>(null);
  const [selectedReceiptFor3DPrint, setSelectedReceiptFor3DPrint] = useState<FeeReceipt | null>(null);

  const settings = storageService.getSettings();

  const [formData, setFormData] = useState<Partial<FeeReceipt>>({
    receiptNo: 'RCPT-2026-10' + (fees.length + 6),
    service: 'نکاح رجسٹریشن و نکاح خوانی',
    personName: '',
    cnic: '',
    mobile: '',
    amount: 15000,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'نقد',
    status: 'وصول شدہ',
    notes: 'نکاح رجسٹریشن و دفتری اندراج فیس',
  });

  const handleOpenNew = () => {
    setEditingReceipt(null);
    setFormData({
      receiptNo: 'RCPT-2026-10' + (fees.length + 7),
      service: 'نکاح رجسٹریشن و نکاح خوانی',
      personName: '',
      cnic: '',
      mobile: '',
      amount: 15000,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'نقد',
      status: 'وصول شدہ',
      notes: 'نکاح رجسٹریشن و دفتری اندراج فیس',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (receipt: FeeReceipt) => {
    setEditingReceipt(receipt);
    setFormData({
      receiptNo: receipt.receiptNo,
      service: receipt.service,
      personName: receipt.personName,
      cnic: receipt.cnic,
      mobile: receipt.mobile,
      amount: receipt.amount,
      date: receipt.date,
      paymentMethod: receipt.paymentMethod,
      status: receipt.status,
      notes: receipt.notes,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.personName || !formData.amount) {
      alert('براہ کرم سائل کا نام اور رقم درج فرمائیں۔');
      return;
    }

    const now = new Date().toISOString();

    if (editingReceipt) {
      const updated = fees.map((f) =>
        f.id === editingReceipt.id
          ? {
              ...f,
              ...(formData as FeeReceipt),
              updatedAt: now,
            }
          : f
      );
      storageService.saveFees(updated);
      setFees(updated);
      storageService.logAction(
        'UPDATE',
        'FEE',
        editingReceipt.id,
        `رسید فیس ترمیم و تجدید: ${formData.receiptNo} (${formData.personName})`,
        user
      );
    } else {
      const newFee: FeeReceipt = {
        ...(formData as FeeReceipt),
        id: 'fee-' + Date.now(),
        createdAt: now,
        createdBy: user.name,
      };

      const updated = [newFee, ...fees];
      storageService.saveFees(updated);
      setFees(updated);
      storageService.logAction(
        'CREATE',
        'FEE',
        newFee.id,
        `رسید فیس جاری: ${newFee.receiptNo} (${newFee.personName} - روپے ${newFee.amount})`,
        user
      );
    }

    setIsModalOpen(false);
    setEditingReceipt(null);
  };

  const handleDeleteReceipt = (receipt: FeeReceipt) => {
    if (!confirm(`کیا آپ واقعی رسید نمبر "${receipt.receiptNo}" کو حذف کرنا چاہتے ہیں؟`)) return;
    const updated = fees.filter((f) => f.id !== receipt.id);
    storageService.saveFees(updated);
    setFees(updated);
    storageService.logAction('DELETE', 'FEE', receipt.id, `رسید فیس حذف کی گئی: ${receipt.receiptNo}`, user);
  };

  const filtered = fees.filter(
    (f) =>
      f.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cnic.includes(searchTerm) ||
      f.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = fees
    .filter((f) => f.status === 'وصول شدہ')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-3.5 font-urdu">
      {/* Clean, Light & Compact Top Heading Box */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 shadow-2xs text-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-emerald-950 flex items-center gap-1.5 leading-tight">
                <span>فیس مینجمنٹ، باضابطہ رسیدیں و اکاؤنٹس</span>
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                {fees.length} رسیدیں
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-header-urdu mt-0.5">
              کل وصول شدہ آمدن: <strong className="font-mono text-emerald-950">روپے {totalCollected.toLocaleString()}</strong> | تصدیق شدہ مالی واؤچرز
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 text-xs font-bold font-header-urdu transition-all active:scale-95 shadow-2xs"
            >
              <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
              <span>← ڈیش بورڈ</span>
            </button>
          )}

          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs transition-all font-header-urdu active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>نئی رسید جاری کریں</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="رسید نمبر، سائل، شناختی کارڈ یا سروس سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-emerald-800 font-header-urdu"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">اندراجات: {filtered.length}</span>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-100 border-b font-bold text-neutral-800 font-header-urdu">
              <tr>
                <th className="p-3">رسید نمبر</th>
                <th className="p-3">سروس / خدمت</th>
                <th className="p-3">سائل (فرد کا نام)</th>
                <th className="p-3">رقم (روپے)</th>
                <th className="p-3">طریقہ ادائیگی</th>
                <th className="p-3">تاریخ</th>
                <th className="p-3">حالت</th>
                <th className="p-3 text-center">3D پرنٹ و ایکشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-urdu">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-mono font-bold text-emerald-950">{f.receiptNo}</td>
                  <td className="p-3 font-medium text-neutral-800">{f.service}</td>
                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{f.personName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">{f.cnic}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-900 text-sm">
                    روپے {f.amount.toLocaleString()}
                  </td>
                  <td className="p-3">{f.paymentMethod}</td>
                  <td className="p-3 font-mono">{f.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-900">
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedReceiptFor3DPrint(f)}
                        className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-all font-header-urdu"
                        title="3D نکاح رسید اور پرنٹ"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>3D رسید پرنٹ</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-1 rounded text-blue-700 hover:bg-blue-50"
                        title="رسید میں ترمیم و نوٹس اپڈیٹ کریں"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteReceipt(f)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        title="رسید حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3D Receipt Print Modal */}
      {selectedReceiptFor3DPrint && (
        <ReceiptPrintView
          isOpen={!!selectedReceiptFor3DPrint}
          onClose={() => setSelectedReceiptFor3DPrint(null)}
          receipt={selectedReceiptFor3DPrint}
          settings={settings}
        />
      )}

      {/* New Receipt Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-right">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2 font-header-urdu">
              نئی دفتری رسید فیس کا اجراء
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-header-urdu">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700 font-bold">رسید نمبر:</label>
                  <input
                    type="text"
                    required
                    value={formData.receiptNo}
                    onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700 font-bold">تاریخ:</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700 font-bold">سروس منتخب کریں:</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value as any })}
                  className="w-full text-xs border rounded p-1.5 bg-white"
                >
                  <option value="نکاح رجسٹریشن و نکاح خوانی">نکاح رجسٹریشن و نکاح خوانی</option>
                  <option value="تیاری دستاویزات و کاپی">تیاری دستاویزات و کاپی</option>
                  <option value="حلفی بیان و تصدیق">حلفی بیان و تصدیق</option>
                  <option value="طلاق نوٹس دفتری اندراج">طلاق نوٹس دفتری اندراج</option>
                  <option value="خلع عدالتی ریکارڈ اندراج">خلع عدالتی ریکارڈ اندراج</option>
                  <option value="حق مہر مشاورت و ریکارڈ">حق مہر مشاورت و ریکارڈ</option>
                  <option value="دیگر خدمات">دیگر خدمات</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700 font-bold">سائل کا نام:</label>
                  <input
                    type="text"
                    required
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">شناختی کارڈ:</label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700 font-bold">رقم (روپے):</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs font-bold border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">طریقہ ادائیگی:</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full text-xs border rounded p-1.5 bg-white"
                  >
                    <option value="نقد">نقد</option>
                    <option value="بینک ٹرانسفر">بینک ٹرانسفر</option>
                    <option value="ایزی پیسہ">ایزی پیسہ</option>
                    <option value="جاز کیش">جاز کیش</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700">تفصیل یا نوٹس:</label>
                <input
                  type="text"
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
                  className="px-4 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  رسید محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
