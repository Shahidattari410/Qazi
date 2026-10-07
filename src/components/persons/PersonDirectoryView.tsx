import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { NikahRecord } from '../../types';

interface PersonDirectoryViewProps {
  records: NikahRecord[];
  type: 'grooms' | 'brides' | 'witnesses' | 'wakeels';
}

export const PersonDirectoryView: React.FC<PersonDirectoryViewProps> = ({ records, type }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'grooms':
        return { urdu: 'دولہا ریکارڈ ڈائرکٹری', sub: 'تمام رجسٹرڈ دولہا کے کوائف و شناختی تفصیلات' };
      case 'brides':
        return { urdu: 'دلہن ریکارڈ ڈائرکٹری', sub: 'تمام رجسٹرڈ دلہنوں کے کوائف و ولدیت' };
      case 'witnesses':
        return { urdu: 'گواہانِ عقد ڈائرکٹری', sub: 'نکاح میں شامل تمام تصدیق شدہ شرعی گواہان' };
      case 'wakeels':
        return { urdu: 'وکلاء و شرعی نمائندگان', sub: 'عقدِ نکاح میں مقرر کردہ شرعی وکلاء کا ریکارڈ' };
    }
  };

  const info = getTitle();

  const renderContent = () => {
    if (type === 'grooms') {
      const grooms = records
        .map((r) => ({ ...r.groom, nikahId: r.id, regNo: r.registrationNo, date: r.date }))
        .filter(
          (g) =>
            g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.cnic.includes(searchTerm) ||
            g.mobile.includes(searchTerm) ||
            g.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grooms.map((g, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-2 text-xs font-urdu">
              <div className="flex items-start justify-between border-b pb-2">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{g.fullName}</h4>
                  <p className="text-[11px] text-neutral-500">ولد: {g.fatherName}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {g.maritalStatus}
                </span>
              </div>
              <div className="space-y-1 text-neutral-700">
                <p>شناختی کارڈ: <strong className="font-mono text-neutral-900">{g.cnic}</strong></p>
                <p>عمر: {g.age} سال | پیشہ: {g.occupation || 'ملازمت'}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-400" /><span className="font-mono">{g.mobile}</span></p>
                <p className="flex items-center gap-1.5 text-neutral-500"><MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" /><span className="line-clamp-1">{g.address}</span></p>
              </div>
              <div className="pt-2 border-t text-[10px] text-neutral-500 flex justify-between font-mono">
                <span>نکاح ریفرنس: {g.regNo}</span>
                <span>{g.date}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'brides') {
      const brides = records
        .map((r) => ({ ...r.bride, nikahId: r.id, regNo: r.registrationNo, date: r.date }))
        .filter(
          (b) =>
            b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.cnic.includes(searchTerm) ||
            b.mobile.includes(searchTerm) ||
            b.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brides.map((b, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-2 text-xs font-urdu">
              <div className="flex items-start justify-between border-b pb-2">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{b.fullName}</h4>
                  <p className="text-[11px] text-neutral-500">بنت: {b.fatherName}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {b.maritalStatus}
                </span>
              </div>
              <div className="space-y-1 text-neutral-700">
                <p>شناختی کارڈ: <strong className="font-mono text-neutral-900">{b.cnic}</strong></p>
                <p>عمر: {b.age} سال | پیشہ: {b.occupation || 'تعلیم / گھریلو'}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-400" /><span className="font-mono">{b.mobile}</span></p>
                <p className="flex items-center gap-1.5 text-neutral-500"><MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" /><span className="line-clamp-1">{b.address}</span></p>
              </div>
              <div className="pt-2 border-t text-[10px] text-neutral-500 flex justify-between font-mono">
                <span>نکاح ریفرنس: {b.regNo}</span>
                <span>{b.date}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'witnesses') {
      const witnessesList: any[] = [];
      records.forEach((r) => {
        r.witnesses.forEach((w) => {
          witnessesList.push({ ...w, regNo: r.registrationNo, date: r.date, groom: r.groom.fullName });
        });
      });

      const filtered = witnessesList.filter(
        (w) =>
          w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.cnic.includes(searchTerm) ||
          w.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-2 text-xs font-urdu">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{w.name}</h4>
                  <p className="text-[11px] text-neutral-500">ولد: {w.fatherName}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
                  مصدقہ گواہ
                </span>
              </div>
              <div className="space-y-1 text-neutral-700">
                <p>شناختی کارڈ: <strong className="font-mono text-neutral-900">{w.cnic}</strong></p>
                <p>رابطہ فون: <span className="font-mono">{w.mobile || 'غیر دستیاب'}</span></p>
                <p className="text-neutral-500 line-clamp-1">پتہ: {w.address || 'لاہور'}</p>
              </div>
              <div className="pt-2 border-t text-[10px] text-neutral-500 flex justify-between font-mono">
                <span>نکاح: {w.groom}</span>
                <span>{w.regNo}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'wakeels') {
      const wakeelsList: any[] = [];
      records.forEach((r) => {
        if (r.wakeelBride) {
          wakeelsList.push({ ...r.wakeelBride, regNo: r.registrationNo, date: r.date, bride: r.bride.fullName });
        }
      });

      const filtered = wakeelsList.filter(
        (wk) =>
          wk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wk.cnic.includes(searchTerm) ||
          wk.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((wk, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-2 text-xs font-urdu">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">{wk.name}</h4>
                  <p className="text-[11px] text-neutral-500">ولدیت: {wk.fatherName}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold">
                  وکیلِ {wk.representing}
                </span>
              </div>
              <div className="space-y-1 text-neutral-700">
                <p>شناختی کارڈ: <strong className="font-mono text-neutral-900">{wk.cnic}</strong></p>
                <p>رابطہ فون: <span className="font-mono">{wk.mobile}</span></p>
                <p>تاریخ تقرری: <span className="font-mono">{wk.appointmentDate}</span></p>
                {wk.notes && <p className="text-neutral-500">{wk.notes}</p>}
              </div>
              <div className="pt-2 border-t text-[10px] text-neutral-500 flex justify-between font-mono">
                <span>موکل: {wk.bride}</span>
                <span>{wk.regNo}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-5">
      <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-urdu text-emerald-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            <span>{info.urdu}</span>
          </h2>
          <p className="text-xs text-neutral-500 font-urdu mt-0.5">{info.sub}</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="نام، شناختی کارڈ یا فون سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs font-urdu border border-neutral-300 rounded-lg focus:outline-emerald-800"
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};
