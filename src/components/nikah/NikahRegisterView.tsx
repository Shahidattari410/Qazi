import React, { useState } from 'react';
import {
  HeartHandshake,
  Search,
  Filter,
  Printer,
  Edit3,
  Trash2,
  FileCheck,
  PlusCircle,
  Eye,
  MapPin,
  Calendar,
  Shield,
  Download,
  BookOpen,
  FileEdit,
  FileSpreadsheet,
  AlertCircle,
  X,
} from 'lucide-react';
import { NikahRecord, NikahStatus, User } from '../../types';
import { storageService } from '../../services/storage';
import { RecordUpdateNotesModal } from '../common/RecordUpdateNotesModal';

interface NikahRegisterViewProps {
  records: NikahRecord[];
  onRefresh: () => void;
  onOpenNew: () => void;
  onEdit: (record: NikahRecord) => void;
  onOpenPrint: (record: NikahRecord) => void;
  onOpenOfficialForm25?: () => void;
  onNavigate?: (view: string) => void;
  user: User;
}

export const NikahRegisterView: React.FC<NikahRegisterViewProps> = ({
  records,
  onRefresh,
  onOpenNew,
  onEdit,
  onOpenPrint,
  onOpenOfficialForm25,
  onNavigate,
  user,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<NikahRecord | null>(null);
  const [recordForNotesUpdate, setRecordForNotesUpdate] = useState<NikahRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<NikahRecord | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nikahNamaNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.groom.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.groom.cnic.includes(searchTerm) ||
      r.bride.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bride.cnic.includes(searchTerm) ||
      r.unionCouncil.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const confirmDeleteRecord = () => {
    if (!recordToDelete) return;
    const updated = records.filter((r) => r.id !== recordToDelete.id);
    storageService.saveNikahs(updated);
    storageService.logAction(
      'DELETE',
      'NIKAH',
      recordToDelete.id,
      `نکاح ریکارڈ حذف کیا گیا: ${recordToDelete.registrationNo} (${recordToDelete.groom.fullName} باہمراہ ${recordToDelete.bride.fullName})`,
      user
    );
    setRecordToDelete(null);
    onRefresh();
  };

  const handleDelete = (record: NikahRecord) => {
    setRecordToDelete(record);
  };

  return (
    <div className="space-y-3.5 font-urdu">
      {/* Clean, Light & Compact Top Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 shadow-2xs text-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-emerald-950 flex items-center gap-1.5 leading-tight tracking-normal">
                <span>نکاح رجسٹر و دفتری شرعی ریکارڈ</span>
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                {records.length} ریکارڈز
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-header-urdu mt-0.5">
              باضابطہ 25 کالم عائلی و شرعی نکاح رجسٹر · دار القضاء پورٹل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenOfficialForm25 && (
            <button
              onClick={onOpenOfficialForm25}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold font-header-urdu shadow-2xs transition-all active:scale-95 border border-neutral-300"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
              <span>فارم دوم (25 کالم)</span>
            </button>
          )}

          <button
            onClick={onOpenNew}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold font-header-urdu shadow-2xs transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>نیا نکاح درج کریں</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="نام، شناختی کارڈ (CNIC)، نکاح نمبر یا یونین کونسل سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-sm font-header-urdu border border-neutral-300 rounded-lg focus:outline-emerald-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto font-header-urdu">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-neutral-300 rounded-lg p-2 bg-white text-neutral-800"
          >
            <option value="all">تمام حالتیں</option>
            <option value="رجسٹرڈ">رجسٹرڈ</option>
            <option value="زیرِ کارروائی">زیرِ کارروائی</option>
            <option value="تصدیق شدہ">تصدیق شدہ</option>
            <option value="منسوخ">منسوخ</option>
          </select>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-emerald-950 text-emerald-100 font-header-urdu font-semibold">
              <tr>
                <th className="p-3">رجسٹریشن نمبر</th>
                <th className="p-3">نکاح نامہ نمبر</th>
                <th className="p-3">دولہا (Groom)</th>
                <th className="p-3">دلہن (Bride)</th>
                <th className="p-3">تاریخ و یونین کونسل</th>
                <th className="p-3">طے شدہ مہر</th>
                <th className="p-3">حالت</th>
                <th className="p-3 text-center">کارروائی و نوٹس</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-urdu">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="p-3">
                    <span className="font-mono font-bold text-neutral-900 block">
                      {r.registrationNo}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {r.stampPaperNo || 'اسٹامپ غیر منسلک'}
                    </span>
                  </td>

                  <td className="p-3 font-mono text-neutral-700">{r.nikahNamaNo}</td>

                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{r.groom.fullName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      ولدیت: {r.groom.fatherName} | {r.groom.cnic}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{r.bride.fullName}</div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      بنت: {r.bride.fatherName} | {r.bride.cnic}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-mono text-neutral-900">{r.date}</div>
                    <div className="text-[10px] text-emerald-700">{r.unionCouncil}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-mono font-bold text-amber-950">
                      روپے {r.mehr.totalAgreedAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {r.mehr.nature} ({r.mehr.paymentStatus})
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        r.status === 'رجسٹرڈ'
                          ? 'bg-emerald-100 text-emerald-900'
                          : r.status === 'تصدیق شدہ'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedRecordForDetail(r)}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900"
                        title="تفصیلات دیکھیں"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setRecordForNotesUpdate(r)}
                        className="p-1 rounded hover:bg-amber-100 text-amber-800"
                        title="نوٹس و ریمارکس / حیثیت تبدیل کریں"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenPrint(r)}
                        className="p-1 rounded hover:bg-emerald-100 text-emerald-800"
                        title="باضابطہ 25 کالم نکاح نامہ پرنٹ کریں (کالمز کے مطابق)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(r)}
                        className="p-1 rounded hover:bg-blue-100 text-blue-800"
                        title="مکمل فارم میں ترمیم کریں"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(r)}
                        className="p-1 rounded hover:bg-rose-100 text-rose-700"
                        title="ریکارڈ حذف کریں"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-neutral-500 font-urdu">
            کوئی نکاح ریکارڈ تلاش کے معیار پر پورا نہیں اترا۔
          </div>
        )}
      </div>

      {/* Record Update Notes Modal */}
      {recordForNotesUpdate && (
        <RecordUpdateNotesModal
          isOpen={!!recordForNotesUpdate}
          onClose={() => setRecordForNotesUpdate(null)}
          recordType="nikah"
          record={recordForNotesUpdate}
          user={user}
          onRecordUpdated={onRefresh}
        />
      )}

      {/* Detail Slideover / Modal */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-urdu">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-emerald-950 font-header-urdu">
                  تفصیلی ریکارڈ: {selectedRecordForDetail.registrationNo}
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  نکاح نامہ نمبر: {selectedRecordForDetail.nikahNamaNo}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="p-1 rounded text-neutral-500 hover:bg-neutral-100"
              >
                بند کریں
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-50 p-3 rounded space-y-1">
                <h4 className="font-bold text-emerald-900 border-b pb-1 font-header-urdu">دولہا کوائف</h4>
                <p>نام: {selectedRecordForDetail.groom.fullName}</p>
                <p>ولدیت: {selectedRecordForDetail.groom.fatherName}</p>
                <p>شناختی کارڈ: <span className="font-mono">{selectedRecordForDetail.groom.cnic}</span></p>
                <p>عمر: {selectedRecordForDetail.groom.age} سال</p>
                <p>رابطہ: <span className="font-mono">{selectedRecordForDetail.groom.mobile}</span></p>
                <p>پتہ: {selectedRecordForDetail.groom.address}</p>
              </div>

              <div className="bg-neutral-50 p-3 rounded space-y-1">
                <h4 className="font-bold text-emerald-900 border-b pb-1 font-header-urdu">دلہن کوائف</h4>
                <p>نام: {selectedRecordForDetail.bride.fullName}</p>
                <p>ولدیت: {selectedRecordForDetail.bride.fatherName}</p>
                <p>شناختی کارڈ: <span className="font-mono">{selectedRecordForDetail.bride.cnic}</span></p>
                <p>عمر: {selectedRecordForDetail.bride.age} سال</p>
                <p>رابطہ: <span className="font-mono">{selectedRecordForDetail.bride.mobile}</span></p>
                <p>پتہ: {selectedRecordForDetail.bride.address}</p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs space-y-1">
              <h4 className="font-bold text-amber-950 border-b border-amber-200 pb-1 font-header-urdu">تفصیلاتِ حق مہر</h4>
              <p>طے شدہ رقم: <strong className="font-mono">روپے {selectedRecordForDetail.mehr.totalAgreedAmount.toLocaleString()}</strong></p>
              <p>معجل: <strong className="font-mono">روپے {selectedRecordForDetail.mehr.muajjalAmount.toLocaleString()}</strong> | مؤجل: <strong className="font-mono">روپے {selectedRecordForDetail.mehr.muakhkharAmount.toLocaleString()}</strong></p>
              <p>حیثیت: <strong>{selectedRecordForDetail.mehr.paymentStatus}</strong></p>
            </div>

            {selectedRecordForDetail.qaziNotes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs space-y-1">
                <h4 className="font-bold text-blue-950 font-header-urdu">دفتری ریمارکس و نوٹس:</h4>
                <p className="text-neutral-700 whitespace-pre-line font-mono text-[11px]">{selectedRecordForDetail.qaziNotes}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => {
                  const rec = selectedRecordForDetail;
                  setSelectedRecordForDetail(null);
                  onOpenPrint(rec);
                }}
                className="px-4 py-1.5 rounded bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 font-header-urdu"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>نکاح نامہ پرنٹ کریں</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Record In-App Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-neutral-300 text-right">
            <div className="bg-rose-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-rose-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-300" />
                <h4 className="font-header-urdu font-bold text-sm text-white">
                  نکاح ریکارڈ حذف کرنے کی تصدیق
                </h4>
              </div>
              <button
                onClick={() => setRecordToDelete(null)}
                className="text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2 text-xs font-urdu text-neutral-800 leading-relaxed">
              <p className="font-bold text-rose-900">
                کیا آپ واقعی نکاح ریکارڈ نمبر &ldquo;{recordToDelete.registrationNo}&rdquo; کو حذف کرنا چاہتے ہیں؟
              </p>
              <p className="text-neutral-600 text-[11px]">
                دولہا: {recordToDelete.groom.fullName} باہمراہ دلہن: {recordToDelete.bride.fullName}
              </p>
              <p className="text-neutral-500 text-[10.5px]">
                یہ عمل واپس نہیں کیا جا سکے گا اور تمام متعلقہ ڈیٹا مستقل طور پر رجسٹر سے خارج ہو جائے گا۔
              </p>
            </div>

            <div className="bg-neutral-50 px-5 py-3 flex items-center justify-end gap-2.5 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-1.5 rounded-lg text-neutral-700 hover:bg-neutral-200 text-xs font-header-urdu"
              >
                منسوخ کریں
              </button>
              <button
                type="button"
                onClick={confirmDeleteRecord}
                className="px-5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs font-header-urdu"
              >
                ہاں، حذف کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
