import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Search,
  Lock,
  Download,
  Eye,
  Trash2,
  Filter,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { LegalDocument, LegalDocType, User } from '../../types';
import { storageService } from '../../services/storage';

interface LegalDocumentsViewProps {
  user: User;
}

export const LegalDocumentsView: React.FC<LegalDocumentsViewProps> = ({ user }) => {
  const [documents, setDocuments] = useState<LegalDocument[]>(() =>
    storageService.getDocuments()
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);

  const [formData, setFormData] = useState<Partial<LegalDocument>>({
    docNo: 'DOC-2026-10' + (documents.length + 4),
    title: '',
    category: 'اقرار نامہ',
    personName: '',
    cnic: '',
    date: new Date().toISOString().split('T')[0],
    isPrivate: true,
    fileSize: '1.2 MB',
    fileName: 'document_scan.pdf',
    description: 'دفتری قانونی ریکارڈ برائے محفوظ آرکائیو',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.personName) {
      alert('براہ کرم دستاویز کا عنوان اور متعلقہ فرد کا نام درج فرمائیں۔');
      return;
    }

    const now = new Date().toISOString();
    const newDoc: LegalDocument = {
      ...(formData as LegalDocument),
      id: 'doc-' + Date.now(),
      createdAt: now,
      createdBy: user.name,
    };

    const updated = [newDoc, ...documents];
    storageService.saveDocuments(updated);
    setDocuments(updated);
    storageService.logAction(
      'CREATE',
      'DOCUMENT',
      newDoc.id,
      `دستاویز اپلوڈ و اندراج: ${newDoc.title} (${newDoc.personName})`,
      user
    );
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`کیا آپ واقعی دستاویز "${title}" کو حذف کرنا چاہتے ہیں؟`)) return;
    const updated = documents.filter((d) => d.id !== id);
    storageService.saveDocuments(updated);
    setDocuments(updated);
    storageService.logAction('DELETE', 'DOCUMENT', id, `دستاویز حذف کی گئی: ${title}`, user);
  };

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.cnic && d.cnic.includes(searchTerm)) ||
      d.docNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-3.5 font-urdu">
      {/* Top Heading Box - Royal Sapphire-Teal Typography Arch */}
      <div className="bg-linear-to-r from-[#0a233a] via-[#103b5c] to-[#0c4a6e] p-3 sm:p-4 rounded-2xl border-2 border-teal-400/50 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-400 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-header-urdu text-white flex items-center gap-1.5 leading-tight">
                <span>قانونی دستاویزات و ڈیجیٹل آرکائیو (Documents)</span>
              </h2>
              <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-400/20 border border-teal-300/40 text-teal-200">
                {documents.length} دستاویزات
              </span>
            </div>
            <p className="text-[11px] text-teal-100/90 font-header-urdu mt-0.5">
              نکاح نامہ کاپیاں، اقرار نامے، رضامندی نامے، وکالت نامے اور تصدیقی ریکارڈ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-sm transition-all font-header-urdu active:scale-95 border border-teal-300/30"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-200" />
          <span>نئی دستاویز شامل کریں</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="دستاویز کا عنوان، سائل کا نام، شناختی کارڈ سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-emerald-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-neutral-300 rounded-lg p-1.5 bg-white text-neutral-800"
          >
            <option value="all">تمام زمرہ جات</option>
            <option value="نکاح نامہ نقل">نکاح نامہ نقل</option>
            <option value="حلفی بیان">حلفی بیان</option>
            <option value="وکالت نامہ">وکالت نامہ</option>
            <option value="اقرار نامہ">اقرار نامہ</option>
            <option value="رضامندی نامہ">رضامندی نامہ</option>
            <option value="دیگر دستاویزی ثبوت">دیگر دستاویزی ثبوت</option>
          </select>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3 relative group"
          >
            <div className="flex items-start justify-between border-b pb-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-800 font-bold block">
                  {d.docNo} · {d.date}
                </span>
                <h4 className="font-bold text-neutral-900 text-sm mt-0.5">{d.title}</h4>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium">
                {d.category}
              </span>
            </div>

            <div className="space-y-1 text-xs text-neutral-700">
              <p>متعلقہ فرد: <strong>{d.personName}</strong></p>
              {d.cnic && (
                <p>شناختی کارڈ: <span className="font-mono">{d.cnic}</span></p>
              )}
              {d.description && (
                <p className="text-[11px] text-neutral-500 line-clamp-1">{d.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-[11px]">
              <div className="flex items-center gap-1.5 text-neutral-500 font-mono">
                {d.isPrivate && (
                  <span className="flex items-center gap-1 text-amber-800 font-urdu text-[10px]">
                    <Lock className="w-3 h-3" />
                    محفوظ فائل
                  </span>
                )}
                <span>({d.fileSize || '1 MB'})</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewDoc(d)}
                  className="p-1 rounded hover:bg-neutral-100 text-neutral-700"
                  title="پیشگی منظر"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(d.id, d.title)}
                  className="p-1 rounded hover:bg-rose-100 text-rose-700"
                  title="حذف کریں"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl text-right">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-base text-emerald-950">{previewDoc.title}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-xs text-neutral-500 hover:text-neutral-800"
              >
                بند کریں
              </button>
            </div>
            <div className="p-4 bg-neutral-50 border rounded text-xs space-y-2">
              <p>دستاویز نمبر: <strong className="font-mono">{previewDoc.docNo}</strong></p>
              <p>زمرہ: <strong>{previewDoc.category}</strong></p>
              <p>متعلقہ سائل: <strong>{previewDoc.personName}</strong></p>
              {previewDoc.cnic && <p>شناختی کارڈ: <span className="font-mono">{previewDoc.cnic}</span></p>}
              <p>تاریخ اجرا / اندراج: <span className="font-mono">{previewDoc.date}</span></p>
              <p>فائل کا نام: <span className="font-mono">{previewDoc.fileName}</span></p>
              <p className="text-neutral-600 bg-white p-2 rounded border">{previewDoc.description}</p>
            </div>
            <div className="text-center text-xs text-emerald-800 font-bold">
              ✓ دفتری ریکارڈ میں باضابطہ تصدیق شدہ محفوظ ہے
            </div>
          </div>
        </div>
      )}

      {/* Upload/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-right">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">
              نئی دستاویز کا اندراج و اپلوڈ
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-neutral-700 font-bold">دستاویز کا عنوان:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: اقرار نامہ حق مہر و رضامندی"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">زمرہ دستاویز:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as LegalDocType })}
                    className="w-full text-xs border rounded p-2 bg-white"
                  >
                    <option value="نکاح نامہ نقل">نکاح نامہ نقل</option>
                    <option value="حلفی بیان">حلفی بیان</option>
                    <option value="اسٹام پیپر">اسٹام پیپر</option>
                    <option value="اقرار نامہ">اقرار نامہ</option>
                    <option value="رضامندی نامہ">رضامندی نامہ</option>
                    <option value="وکالت نامہ">وکالت نامہ</option>
                    <option value="شناختی کارڈ نقل">شناختی کارڈ نقل</option>
                    <option value="دیگر دستاویزی ثبوت">دیگر دستاویزی ثبوت</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">تاریخ:</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">متعلقہ فرد کا نام:</label>
                  <input
                    type="text"
                    required
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    className="w-full text-xs border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">شناختی کارڈ:</label>
                  <input
                    type="text"
                    placeholder="35202-0000000-0"
                    value={formData.cnic || ''}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700">فائل تفصیل و نوٹس:</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  دستاویز محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
