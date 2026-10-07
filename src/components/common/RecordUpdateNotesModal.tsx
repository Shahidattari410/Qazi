import React, { useState } from 'react';
import {
  FileEdit,
  X,
  Save,
  Trash2,
  Plus,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { NikahRecord, NikahStatus, TalaqRecord, KhulaRecord, User } from '../../types';
import { storageService } from '../../services/storage';

interface RecordUpdateNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordType: 'nikah' | 'talaq' | 'khula' | 'affidavit';
  record: any;
  user: User;
  onRecordUpdated: () => void;
}

export const RecordUpdateNotesModal: React.FC<RecordUpdateNotesModalProps> = ({
  isOpen,
  onClose,
  recordType,
  record,
  user,
  onRecordUpdated,
}) => {
  if (!isOpen || !record) return null;

  const [currentStatus, setCurrentStatus] = useState<string>(
    record.status || record.registrationStatus || 'رجسٹرڈ'
  );
  const [newNote, setNewNote] = useState<string>('');
  const [existingNotes, setExistingNotes] = useState<string>(
    record.qaziNotes || record.notes || ''
  );
  const [specialConditions, setSpecialConditions] = useState<string>(
    record.specialConditions || record.surrenderedMehrDetails || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const timestamp = new Date().toLocaleDateString('ur-PK') + ' ' + new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' });
    const formattedNote = `\n[${timestamp} - ${user.name} (${user.role})]: ${newNote.trim()}`;
    const updated = (existingNotes ? existingNotes + '\n' : '') + formattedNote;
    setExistingNotes(updated);
    setNewNote('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (recordType === 'nikah') {
      const nikahs = storageService.getNikahs();
      const updatedList = nikahs.map((n) =>
        n.id === record.id
          ? {
              ...n,
              status: currentStatus as NikahStatus,
              qaziNotes: existingNotes,
              specialConditions,
              updatedAt: now,
              updatedBy: user.name,
            }
          : n
      );
      storageService.saveNikahs(updatedList);
      storageService.logAction('UPDATE', 'NIKAH', record.id, `نکاح ریکارڈ میں نوٹس و حیثیت اپڈیٹ: ${record.registrationNo}`, user);
    } else if (recordType === 'talaq') {
      const talaqs = storageService.getTalaqRecords();
      const updatedList = talaqs.map((t) =>
        t.id === record.id
          ? {
              ...t,
              status: currentStatus as any,
              notes: existingNotes,
              updatedAt: now,
            }
          : t
      );
      storageService.saveTalaqRecords(updatedList);
      storageService.logAction('UPDATE', 'TALAQ', record.id, `طلاق ریکارڈ میں ریمارکس اپڈیٹ: ${record.caseNo}`, user);
    } else if (recordType === 'khula') {
      const khulas = storageService.getKhulaRecords();
      const updatedList = khulas.map((k) =>
        k.id === record.id
          ? {
              ...k,
              registrationStatus: currentStatus as any,
              notes: existingNotes,
              surrenderedMehrDetails: specialConditions,
              updatedAt: now,
            }
          : k
      );
      storageService.saveKhulaRecords(updatedList);
      storageService.logAction('UPDATE', 'KHULA', record.id, `خلع کیس میں نوٹس اپڈیٹ: ${record.caseNo}`, user);
    } else if (recordType === 'affidavit') {
      const affidavits = storageService.getAffidavits();
      const updatedList = affidavits.map((a) =>
        a.id === record.id
          ? {
              ...a,
              fullStatement: specialConditions || a.fullStatement,
            }
          : a
      );
      storageService.saveAffidavits(updatedList);
      storageService.logAction('UPDATE', 'AFFIDAVIT', record.id, `حلفی بیان میں ترمیم و نوٹس: ${record.affidavitNo}`, user);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onRecordUpdated();
      onClose();
    }, 1000);
  };

  const handleDelete = () => {
    const refNo = record.registrationNo || record.caseNo || record.affidavitNo || 'ریکارڈ';
    if (!confirm(`کیا آپ واقعی اس ریکارڈ "${refNo}" کو حذف کرنا چاہتے ہیں؟ یہ کارروائی آڈٹ لاگ میں درج ہو گی۔`)) {
      return;
    }

    if (recordType === 'nikah') {
      const nikahs = storageService.getNikahs().filter((n) => n.id !== record.id);
      storageService.saveNikahs(nikahs);
      storageService.logAction('DELETE', 'NIKAH', record.id, `نکاح ریکارڈ حذف کیا گیا: ${refNo}`, user);
    } else if (recordType === 'talaq') {
      const talaqs = storageService.getTalaqRecords().filter((t) => t.id !== record.id);
      storageService.saveTalaqRecords(talaqs);
      storageService.logAction('DELETE', 'TALAQ', record.id, `طلاق ریکارڈ حذف کیا گیا: ${refNo}`, user);
    } else if (recordType === 'khula') {
      const khulas = storageService.getKhulaRecords().filter((k) => k.id !== record.id);
      storageService.saveKhulaRecords(khulas);
      storageService.logAction('DELETE', 'KHULA', record.id, `خلع ریکارڈ حذف کیا گیا: ${refNo}`, user);
    } else if (recordType === 'affidavit') {
      const affidavits = storageService.getAffidavits().filter((a) => a.id !== record.id);
      storageService.saveAffidavits(affidavits);
      storageService.logAction('DELETE', 'AFFIDAVIT', record.id, `حلفی بیان حذف کیا گیا: ${refNo}`, user);
    }

    onRecordUpdated();
    onClose();
  };

  const refTitle = record.registrationNo || record.caseNo || record.affidavitNo;
  const partyTitle =
    (record.groom ? `${record.groom.fullName} باہمراہ ${record.bride.fullName}` : '') ||
    (record.husbandName ? `${record.husbandName} بنام ${record.wifeName}` : '') ||
    (record.personName || '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-urdu">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-right">
        {/* Header */}
        <div className="bg-emerald-950 text-white px-5 py-3 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-amber-300" />
            <h3 className="font-header-urdu font-bold text-sm text-white">
              ریکارڈ اپڈیٹ، ریمارکس و نوٹس کا اندراج
            </h3>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1 text-emerald-300 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs text-neutral-800">
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>تبدیلیاں کامیابی سے ریکارڈ میں محفوظ کر دی گئیں۔</span>
            </div>
          )}

          {/* Record info bar */}
          <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
            <span className="font-mono font-bold text-emerald-900 block text-sm">{refTitle}</span>
            <span className="text-neutral-600 font-bold">{partyTitle}</span>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-neutral-700 font-bold mb-1 font-header-urdu">
              حیثیتِ ریکارڈ (Status):
            </label>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full text-xs border rounded-lg p-2 bg-white font-medium"
            >
              <option value="رجسٹرڈ">رجسٹرڈ (Registered)</option>
              <option value="زیرِ کارروائی">زیرِ کارروائی (In Progress)</option>
              <option value="تصدیق شدہ">تصدیق شدہ (Verified)</option>
              <option value="نوٹس جاری">نوٹس جاری (Notice Issued)</option>
              <option value="حکم موصول">حکم موصول (Decree Received)</option>
              <option value="مکمل">مکمل (Completed)</option>
              <option value="منسوخ">منسوخ (Cancelled)</option>
            </select>
          </div>

          {/* Add a new dated official note */}
          <div className="space-y-1.5 pt-2 border-t">
            <label className="block text-neutral-700 font-bold font-header-urdu">
              نیا دفتری نوٹ / ریمارکس شامل کریں:
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder="مثلاً: سائل نے اصل بیان جمع کروا دیا، یونین کونسل نوٹس موصول ہوا..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 text-xs border rounded-lg p-2 focus:ring-1 focus:ring-emerald-800"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 self-end py-2"
              >
                شامل کریں
              </button>
            </div>
          </div>

          {/* Existing Notes Log */}
          <div>
            <label className="block text-neutral-700 font-bold mb-1 font-header-urdu">
              دفتری نوٹس و تاریخچہ (History Notes):
            </label>
            <textarea
              rows={4}
              value={existingNotes}
              onChange={(e) => setExistingNotes(e.target.value)}
              className="w-full text-xs border rounded-lg p-2 bg-neutral-50/50 leading-relaxed font-mono"
            />
          </div>

          {/* Bottom Actions: Save, Delete, Cancel */}
          <div className="pt-3 border-t flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 flex items-center gap-1 font-bold text-xs"
              title="ریکارڈ حذف کریں"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ریکارڈ حذف کریں</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border text-neutral-600 hover:bg-neutral-100 text-xs"
              >
                بند کریں
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>محفوظ کریں</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
