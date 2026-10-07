import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Search,
  Printer,
  Stamp,
  UserCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AffidavitRecord, AffidavitType, User } from '../../types';
import { storageService } from '../../services/storage';

interface AffidavitModuleViewProps {
  user: User;
  onOpenPrint: (record: AffidavitRecord) => void;
}

const TEMPLATES: Record<AffidavitType, string> = {
  'بیان حلفی برائے نکاح و مجرد ہونا':
    'میں حلفاً اقرار کرتا ہوں کہ میں شرعاً و قانوناً بالکل مجرد (Unmarried) ہوں، میرا اس سے قبل کوئی نکاح قائم نہیں ہے اور نہ ہی میرے خلاف کوئی قانونی یا شرعی رکاوٹ مانع عقد موجود ہے۔ یہ بیان مکمل ہوش و حواس میں دیا۔',
  'بیان حلفی برائے رضامندی والدین / ولی':
    'میں بحیثیت والد و ولی شرعی اپنی بیٹی کے نکاح باہمراہ مذکورہ سائل اپنی مکمل رضا و خوشنودی اور بلا جبر و اکراہ کرنے کا حلفیہ اقرار کرتا ہوں اور مجھے اس نکاح پر کوئی شرعی یا قانونی اعتراض نہیں ہے۔',
  'بیان حلفی برائے درستگی کوائف':
    'میں حلفاً بیان کرتا ہوں کہ میرے سابقہ دستاویزات میں درج نام / تاریخ پیدائش میں سہواً غلطی واقع ہو گئی تھی، میرا اصل اور درست نام اور کوائف درج ذیل کے مطابق تسلیم کیے جائیں۔',
  'بیان حلفی برائے گمشدگی نکاح نامہ':
    'میں حلفاً بیان کرتا ہوں کہ میرا اصل نکاح نامہ دورانِ نقل مکانی ضائع / گم ہو چکا ہے، جس کا کوئی غلط استعمال نہیں کیا گیا، اس حلف نامے کی بنیاد پر دفتری ریکارڈ سے نقل مصدقہ جاری کی جائے۔',
  'اقرار نامہ حق مہر':
    'فریقین روبرو گواہان اقرار کرتے ہیں کہ حق مہر کی رقم باہمی رضامندی سے طے پائی اور اس کی ادائیگی بمطابق شرائط طے شدہ دفتری ریکارڈ کے مطابق ادا کر دی گئی ہے۔',
  'دیگر حلفی بیان':
    'میں خدا کو حاضر و ناظر جان کر حلفاً بیان کرتا ہوں کہ مندرجہ بالا تمام بیانات میرے علم و یقین کے مطابق بالکل درست ہیں۔',
};

export const AffidavitModuleView: React.FC<AffidavitModuleViewProps> = ({ user, onOpenPrint }) => {
  const [records, setRecords] = useState<AffidavitRecord[]>(() => storageService.getAffidavits());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stamps = storageService.getStamps().filter((s) => s.status === 'Unused');

  const [formData, setFormData] = useState<Partial<AffidavitRecord>>({
    affidavitNo: 'AFF-2026-0' + (records.length + 47),
    personName: '',
    fatherName: '',
    cnic: '',
    mobile: '',
    address: '',
    statementType: 'بیان حلفی برائے نکاح و مجرد ہونا',
    fullStatement: TEMPLATES['بیان حلفی برائے نکاح و مجرد ہونا'],
    stampPaperNo: stamps.length > 0 ? stamps[0].stampNo : 'PB-STP-2026-88125',
    stampValue: 100,
    date: new Date().toISOString().split('T')[0],
    witness1Name: '',
    witness1Cnic: '',
    witness2Name: '',
    witness2Cnic: '',
    hasSignature: true,
    hasThumb: true,
    hasQaziSeal: true,
  });

  const handleTypeChange = (type: AffidavitType) => {
    setFormData({
      ...formData,
      statementType: type,
      fullStatement: TEMPLATES[type] || '',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.personName || !formData.cnic) {
      alert('براہ کرم سائل کا نام اور شناختی کارڈ درج فرمائیں۔');
      return;
    }

    const now = new Date().toISOString();
    const newRecord: AffidavitRecord = {
      ...(formData as AffidavitRecord),
      id: 'aff-' + Date.now(),
      createdAt: now,
      createdBy: user.name,
    };

    const updated = [newRecord, ...records];
    storageService.saveAffidavits(updated);
    setRecords(updated);
    storageService.logAction(
      'CREATE',
      'AFFIDAVIT',
      newRecord.id,
      `نیا بیان حلفی: ${newRecord.affidavitNo} (${newRecord.personName})`,
      user
    );
    setIsModalOpen(false);
  };

  const filtered = records.filter(
    (r) =>
      r.affidavitNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cnic.includes(searchTerm) ||
      r.statementType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 font-urdu">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>حلفی بیانات و تصدیق نامہ جات (Affidavits)</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            مجرد ہونے کا بیان، رضامندی ولی، درستگی کوائف اور گمشدگی نکاح نامہ کے مصدقہ بیانات
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>نیا بیان حلفی تیار کریں</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="بیان نمبر، سائل کا نام، شناختی کارڈ سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-emerald-800"
          />
        </div>
        <span className="text-xs text-neutral-500 font-mono">کل بیانات: {filtered.length}</span>
      </div>

      {/* Grid of Affidavits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between border-b pb-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-800 font-bold block">
                  {a.affidavitNo} · {a.date}
                </span>
                <h4 className="font-bold text-neutral-900 text-sm mt-0.5">{a.statementType}</h4>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                اسٹامپ: {a.stampPaperNo} ({a.stampValue} روپے)
              </span>
            </div>

            <div className="space-y-1 text-xs text-neutral-700">
              <p>سائل: <strong>{a.personName}</strong> ولد {a.fatherName}</p>
              <p>شناختی کارڈ: <span className="font-mono font-bold text-neutral-900">{a.cnic}</span></p>
              <p className="line-clamp-2 text-neutral-600 bg-neutral-50 p-2 rounded text-[11px] leading-relaxed">
                "{a.fullStatement}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t text-[11px]">
              <span className="text-neutral-500">
                گواہان: {a.witness1Name || 'درج نہیں'} | {a.witness2Name || 'درج نہیں'}
              </span>

              <button
                onClick={() => onOpenPrint(a)}
                className="px-3 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>A4 پرنٹ کریں</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl text-right max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-emerald-950 border-b pb-2">
              تیاری و باضابطہ تصدیق بیان حلفی
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">بیان حلفی نمبر:</label>
                  <input
                    type="text"
                    required
                    value={formData.affidavitNo}
                    onChange={(e) => setFormData({ ...formData, affidavitNo: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">تاریخ:</label>
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
                <label className="block mb-1 text-neutral-700 font-bold">قسمِ بیان حلفی:</label>
                <select
                  value={formData.statementType}
                  onChange={(e) => handleTypeChange(e.target.value as AffidavitType)}
                  className="w-full text-xs border rounded p-1.5 bg-white font-medium"
                >
                  <option value="بیان حلفی برائے نکاح و مجرد ہونا">بیان حلفی برائے نکاح و مجرد ہونا</option>
                  <option value="بیان حلفی برائے رضامندی والدین / ولی">بیان حلفی برائے رضامندی والدین / ولی</option>
                  <option value="بیان حلفی برائے درستگی کوائف">بیان حلفی برائے درستگی کوائف</option>
                  <option value="بیان حلفی برائے گمشدگی نکاح نامہ">بیان حلفی برائے گمشدگی نکاح نامہ</option>
                  <option value="اقرار نامہ حق مہر">اقرار نامہ حق مہر</option>
                  <option value="دیگر حلفی بیان">دیگر حلفی بیان</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">نام سائل:</label>
                  <input
                    type="text"
                    required
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">ولدیت:</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">شناختی کارڈ سائل:</label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">رابطہ فون:</label>
                  <input
                    type="text"
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-neutral-700">اسٹامپ پیپر نمبر:</label>
                  <input
                    type="text"
                    required
                    value={formData.stampPaperNo}
                    onChange={(e) => setFormData({ ...formData, stampPaperNo: e.target.value })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-neutral-700">مالیت اسٹامپ (روپے):</label>
                  <input
                    type="number"
                    value={formData.stampValue}
                    onChange={(e) => setFormData({ ...formData, stampValue: parseInt(e.target.value) || 100 })}
                    className="w-full font-mono text-xs border rounded p-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-neutral-700 font-bold">مکمل متنِ بیان حلفی:</label>
                <textarea
                  rows={4}
                  required
                  value={formData.fullStatement}
                  onChange={(e) => setFormData({ ...formData, fullStatement: e.target.value })}
                  className="w-full text-xs border rounded p-2 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="نام گواہ نمبر 1"
                  value={formData.witness1Name || ''}
                  onChange={(e) => setFormData({ ...formData, witness1Name: e.target.value })}
                  className="text-xs border rounded p-1.5"
                />
                <input
                  type="text"
                  placeholder="شناختی کارڈ گواہ 1"
                  value={formData.witness1Cnic || ''}
                  onChange={(e) => setFormData({ ...formData, witness1Cnic: e.target.value })}
                  className="font-mono text-xs border rounded p-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="نام گواہ نمبر 2"
                  value={formData.witness2Name || ''}
                  onChange={(e) => setFormData({ ...formData, witness2Name: e.target.value })}
                  className="text-xs border rounded p-1.5"
                />
                <input
                  type="text"
                  placeholder="شناختی کارڈ گواہ 2"
                  value={formData.witness2Cnic || ''}
                  onChange={(e) => setFormData({ ...formData, witness2Cnic: e.target.value })}
                  className="font-mono text-xs border rounded p-1.5"
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
                  بیان حلفی محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
