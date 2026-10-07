import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Building2, User, Phone, MapPin } from 'lucide-react';
import { OfficeSettings, User as AppUser } from '../../types';
import { storageService } from '../../services/storage';

interface SettingsViewProps {
  user: AppUser;
  onSettingsUpdated: (settings: OfficeSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onSettingsUpdated }) => {
  const [settings, setSettings] = useState<OfficeSettings>(() => storageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    storageService.logAction('UPDATE', 'SETTINGS', 'office', 'دفتری ترتیبات تبدیل کی گئیں', user);
    onSettingsUpdated(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-urdu">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-700" />
          <span>دفتری ترتیبات و قوائدِ لائسنس (Office Settings)</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          قاضی و رجسٹرار کی شناخت، لائسنس رجسٹریشن، رابطہ اور قانونی نوٹس کی ترتیبات
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>ترتیبات کامیابی سے محفوظ ہو گئیں۔</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5 text-xs">
        <h3 className="text-sm font-bold text-emerald-900 border-b pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-700" />
          <span>بنیادی شناخت و رجسٹرار لائسنس</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-bold mb-1">
              نام قاضی و رجسٹرار (برائے تمام دستاویزات):
            </label>
            <input
              type="text"
              required
              value={settings.qaziName}
              onChange={(e) => setSettings({ ...settings, qaziName: e.target.value })}
              className="w-full text-xs border rounded-lg p-2 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">
              عنوان و عہدہ:
            </label>
            <input
              type="text"
              required
              value={settings.qaziTitle}
              onChange={(e) => setSettings({ ...settings, qaziTitle: e.target.value })}
              className="w-full text-xs border rounded-lg p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-700 font-bold mb-1">
              رجسٹریشن و لائسنس نمبر:
            </label>
            <input
              type="text"
              required
              value={settings.qaziRegistrationNo}
              onChange={(e) => setSettings({ ...settings, qaziRegistrationNo: e.target.value })}
              className="w-full font-mono text-xs border rounded-lg p-2 font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">رابطہ فون نمبر:</label>
            <input
              type="text"
              value={settings.contactNumber}
              onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
              className="w-full font-mono text-xs border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">دفتری ای میل:</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full font-mono text-xs border rounded-lg p-2"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-emerald-900 border-b pb-2 pt-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>پتہ، دائرہ اختیار و دفتری اوقات</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 mb-1">مکمل دفتری پتہ:</label>
            <input
              type="text"
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
              className="w-full text-xs border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-neutral-700 mb-1">دائرہ اختیار یونین کونسل زون:</label>
            <input
              type="text"
              value={settings.jurisdictionUC}
              onChange={(e) => setSettings({ ...settings, jurisdictionUC: e.target.value })}
              className="w-full text-xs border rounded-lg p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-700 mb-1">دفتری اوقات کار:</label>
          <input
            type="text"
            value={settings.officeTimings}
            onChange={(e) => setSettings({ ...settings, officeTimings: e.target.value })}
            className="w-full text-xs border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-neutral-700 font-bold mb-1">
            دستاویزات کے نچلے حصے پر قانونی انتباہ و وضاحت (Disclaimer):
          </label>
          <textarea
            rows={2}
            value={settings.disclaimerText}
            onChange={(e) => setSettings({ ...settings, disclaimerText: e.target.value })}
            className="w-full text-xs border rounded-lg p-2 leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>ترتیبات محفوظ کریں</span>
          </button>
        </div>
      </form>
    </div>
  );
};
