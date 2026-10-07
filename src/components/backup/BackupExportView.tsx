import React, { useState } from 'react';
import {
  DatabaseBackup,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { OfficeSettings, User } from '../../types';
import { storageService } from '../../services/storage';

interface BackupExportViewProps {
  user: User;
  onRefreshData: () => void;
}

export const BackupExportView: React.FC<BackupExportViewProps> = ({ user, onRefreshData }) => {
  const [settings, setSettings] = useState<OfficeSettings>(() => storageService.getSettings());
  const [jsonInput, setJsonInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qazi_office_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const updatedSettings = { ...settings, lastBackupDate: new Date().toISOString() };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
    storageService.logAction('EXPORT', 'SYSTEM', 'all', 'مکمل ڈیٹا بیس بیک اپ ڈاؤنلوڈ کیا گیا', user);

    setStatusMsg({
      type: 'success',
      text: 'مکمل ڈیٹا بیک اپ فائل کامیابی سے ڈاؤنلوڈ ہو گئی۔',
    });
  };

  const handleRestore = () => {
    if (!jsonInput.trim()) {
      setStatusMsg({ type: 'error', text: 'براہ کرم بیک اپ JSON ڈیٹا چسپاں (paste) فرمائیں۔' });
      return;
    }

    if (!confirm('کیا آپ واقعی اس بیک اپ کو بحال کرنا چاہتے ہیں؟ موجودہ ڈیٹا تبدیل ہو جائے گا۔')) {
      return;
    }

    const ok = storageService.importData(jsonInput);
    if (ok) {
      storageService.logAction('RESTORE', 'SYSTEM', 'all', 'ڈیٹا بیس بیک اپ بحال کیا گیا', user);
      setStatusMsg({ type: 'success', text: 'ڈیٹا بیس کامیابی سے بحال ہو گئی ہے۔' });
      setJsonInput('');
      onRefreshData();
    } else {
      setStatusMsg({ type: 'error', text: 'بیک اپ فائل غیر درست ہے یا فارمیٹ میں خرابی ہے۔' });
    }
  };

  const handleResetToSample = () => {
    if (!confirm('کیا آپ واقعی سسٹم کو ابتدائی نمونہ ڈیٹا پر ری سیٹ کرنا چاہتے ہیں؟')) {
      return;
    }
    storageService.resetToSampleData();
    storageService.logAction('RESTORE', 'SYSTEM', 'all', 'ابتدائی نمونہ ڈیٹا پر ری سیٹ کیا گیا', user);
    setStatusMsg({ type: 'success', text: 'تمام ریکارڈز ابتدائی نمونہ ڈیٹا پر ری سیٹ ہو گئے۔' });
    onRefreshData();
  };

  return (
    <div className="space-y-6 font-urdu">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <DatabaseBackup className="w-5 h-5 text-emerald-700" />
          <span>ڈیٹا بیک اپ، ایکسپورٹ و سسٹم بحالی</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          تمام نکاح نامہ جات، گواہان، حق مہر، طلاق و خلع اور مالیاتی ریکارڈز کا محفوظ بیک اپ
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Info card on backup date */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span>آخری بیک اپ تاریخ:</span>
          <strong className="font-mono text-emerald-900">
            {settings.lastBackupDate ? new Date(settings.lastBackupDate).toLocaleString('ur-PK') : 'کوئی نہیں'}
          </strong>
        </div>

        <span className="text-neutral-500 font-mono text-[11px]">
          فارمیٹ: JSON + UTF-8
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-200">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">مکمل بیک اپ ڈاؤنلوڈ (Export)</h3>
              <p className="text-xs text-neutral-500">تمام ٹیبلز اور دستاویزاتی ریکارڈز پر مشتمل سنگل فائل</p>
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            اس فائل میں آپ کے تمام نکاح نامہ جات، فریقین کے کوائف، گواہان، حق مہر کی ادائیگیاں، طلاق و خلع اور فیس رسیدیں محفوظ ہوں گی، جسے بوقت ضرورت کسی بھی کمپیوٹر پر بحال کیا جا سکتا ہے۔
          </p>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>بیک اپ فائل ڈاؤنلوڈ کریں (.JSON)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-800 border border-amber-200">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">بیک اپ بحال کریں (Restore)</h3>
              <p className="text-xs text-neutral-500">سابقہ محفوظ شدہ JSON بیک اپ سے ڈیٹا کی واپسی</p>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="یہاں بیک اپ JSON کوڈ چسپاں (Paste) فرمائیں..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full font-mono text-xs border rounded-lg p-2.5 bg-neutral-50"
          />

          <button
            onClick={handleRestore}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>ڈیٹا بیک اپ بحال کریں</span>
          </button>
        </div>
      </div>

      {/* Reset to sample data */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5 flex items-center justify-between text-xs">
        <div>
          <h4 className="font-bold text-neutral-900">ابتدائی نمونہ ڈیٹا پر ری سیٹ (Reset Demo Data)</h4>
          <p className="text-neutral-500 text-[11px]">
            اگر آپ سسٹم کو ابتدائی آزمائشی ریکارڈز پر واپس لانا چاہتے ہیں۔
          </p>
        </div>

        <button
          onClick={handleResetToSample}
          className="px-4 py-2 rounded-lg border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ری سیٹ کریں</span>
        </button>
      </div>
    </div>
  );
};
