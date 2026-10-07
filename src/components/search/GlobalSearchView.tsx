import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  MapPin,
  HeartHandshake,
  Scale,
  FileText,
  Stamp,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { storageService } from '../../services/storage';

interface GlobalSearchViewProps {
  onSelectNikah: (id: string) => void;
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({ onSelectNikah }) => {
  const [query, setQuery] = useState('');
  const [recordType, setRecordType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ucFilter, setUcFilter] = useState('');

  const nikahs = storageService.getNikahs();
  const talaqs = storageService.getTalaqRecords();
  const khulas = storageService.getKhulaRecords();
  const affidavits = storageService.getAffidavits();
  const stamps = storageService.getStamps();
  const fees = storageService.getFees();

  const handleReset = () => {
    setQuery('');
    setRecordType('all');
    setDateFrom('');
    setDateTo('');
    setUcFilter('');
  };

  // Compile unified searchable items
  interface SearchResultItem {
    id: string;
    type: 'نکاح' | 'طلاق' | 'خلع' | 'حلفی بیان' | 'اسٹامپ' | 'فیس';
    refNo: string;
    title: string;
    party: string;
    cnic: string;
    date: string;
    location?: string;
    status: string;
  }

  const allItems: SearchResultItem[] = [];

  nikahs.forEach((n) => {
    allItems.push({
      id: n.id,
      type: 'نکاح',
      refNo: n.registrationNo,
      title: `${n.groom.fullName} باہمراہ ${n.bride.fullName}`,
      party: `دولہا: ${n.groom.fullName} | دلہن: ${n.bride.fullName}`,
      cnic: `${n.groom.cnic}, ${n.bride.cnic}`,
      date: n.date,
      location: `${n.unionCouncil}، ${n.tehsil}`,
      status: n.status,
    });
  });

  talaqs.forEach((t) => {
    allItems.push({
      id: t.id,
      type: 'طلاق',
      refNo: t.caseNo,
      title: `طلاق نوٹس: ${t.husbandName} بنام ${t.wifeName}`,
      party: `${t.husbandName} / ${t.wifeName}`,
      cnic: `${t.husbandCnic}, ${t.wifeCnic}`,
      date: t.talaqDate,
      location: t.unionCouncil,
      status: t.status,
    });
  });

  khulas.forEach((k) => {
    allItems.push({
      id: k.id,
      type: 'خلع',
      refNo: k.caseNo,
      title: `خلع عدالتی ڈگری: ${k.wifeName} بنام ${k.husbandName}`,
      party: `${k.wifeName} / ${k.husbandName}`,
      cnic: `${k.wifeCnic}, ${k.husbandCnic}`,
      date: k.courtOrderDate,
      location: k.unionCouncil,
      status: k.registrationStatus,
    });
  });

  affidavits.forEach((a) => {
    allItems.push({
      id: a.id,
      type: 'حلفی بیان',
      refNo: a.affidavitNo,
      title: a.statementType,
      party: a.personName,
      cnic: a.cnic,
      date: a.date,
      status: 'تصدیق شدہ',
    });
  });

  stamps.forEach((s) => {
    allItems.push({
      id: s.id,
      type: 'اسٹامپ',
      refNo: s.stampNo,
      title: `اسٹامپ پیپر (${s.stampValue} روپے)`,
      party: s.personName || s.vendor,
      cnic: s.cnic || '',
      date: s.purchaseDate,
      status: s.status,
    });
  });

  fees.forEach((f) => {
    allItems.push({
      id: f.id,
      type: 'فیس',
      refNo: f.receiptNo,
      title: f.service,
      party: `${f.personName} (روپے ${f.amount})`,
      cnic: f.cnic,
      date: f.date,
      status: f.status,
    });
  });

  // Filter
  const filtered = allItems.filter((item) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      item.refNo.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.party.toLowerCase().includes(q) ||
      item.cnic.includes(q) ||
      (item.location && item.location.toLowerCase().includes(q));

    const matchesType = recordType === 'all' || item.type === recordType;
    const matchesUc = !ucFilter || (item.location && item.location.includes(ucFilter));
    const matchesDateFrom = !dateFrom || item.date >= dateFrom;
    const matchesDateTo = !dateTo || item.date <= dateTo;

    return matchesQuery && matchesType && matchesUc && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="space-y-5 font-urdu">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-700" />
          <span>مرکزی گلوبل سرچ و تلاشِ ریکارڈ</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          شناختی کارڈ (CNIC)، نام، رجسٹریشن نمبر، یونین کونسل، فون نمبر اور اسٹامپ پیپر سے فوری تلاش
        </p>
      </div>

      {/* Search Input & Advanced Filters Panel */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute right-3.5 top-3" />
          <input
            type="text"
            placeholder="شناختی کارڈ (بغیر ڈیش یا ڈیش کے ساتھ)، نام، ریفرنس نمبر درج کریں..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pr-11 pl-4 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-emerald-800 shadow-inner"
          />
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-neutral-600 mb-1">ریکارڈ کی قسم:</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full border rounded-lg p-2 bg-white text-neutral-800"
            >
              <option value="all">تمام ریکارڈز</option>
              <option value="نکاح">نکاح رجسٹر</option>
              <option value="طلاق">طلاق ریکارڈ</option>
              <option value="خلع">خلع ڈگری</option>
              <option value="حلفی بیان">حلفی بیان</option>
              <option value="اسٹامپ">اسٹام پیپر</option>
              <option value="فیس">فیس رسیدیں</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">یونین کونسل فلٹر:</label>
            <input
              type="text"
              placeholder="مثال: 118 یا ماڈل ٹاؤن"
              value={ucFilter}
              onChange={(e) => setUcFilter(e.target.value)}
              className="w-full border rounded-lg p-2 bg-white text-neutral-800"
            />
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">تاریخ سے:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full font-mono border rounded-lg p-1.5 bg-white text-neutral-800"
            />
          </div>

          <div>
            <label className="block text-neutral-600 mb-1">تاریخ تک:</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full font-mono border rounded-lg p-1.5 bg-white text-neutral-800"
              />
              <button
                type="button"
                onClick={handleReset}
                className="p-2 border rounded-lg hover:bg-neutral-100 text-neutral-600"
                title="فلٹرز ری سیٹ کریں"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-neutral-500 px-1">
          <span>تلاش کے نتائج: <strong className="font-mono text-emerald-800">{filtered.length}</strong> ریکارڈز دستیاب ہیں</span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-200 shadow-xs">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === 'نکاح'
                        ? 'bg-emerald-100 text-emerald-900'
                        : item.type === 'طلاق'
                        ? 'bg-rose-100 text-rose-900'
                        : item.type === 'خلع'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="font-mono font-bold text-neutral-900">{item.refNo}</span>
                  <span className="text-neutral-400 font-mono">({item.date})</span>
                </div>

                <h4 className="font-bold text-sm text-neutral-900">{item.title}</h4>
                <p className="text-neutral-600">
                  متعلقہ کوائف: <strong>{item.party}</strong>
                </p>
                {item.cnic && (
                  <p className="text-[11px] text-neutral-500 font-mono">
                    شناختی کارڈ: {item.cnic}
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700">
                  {item.status}
                </span>

                {item.location && (
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{item.location}</span>
                  </span>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-neutral-500 font-urdu">
              دیے گئے معیار پر کوئی ریکارڈ نہیں ملا۔
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
