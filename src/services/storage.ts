import {
  AffidavitRecord,
  AuditLog,
  CustomFontItem,
  FeeReceipt,
  KhulaRecord,
  LegalDocument,
  NikahRecord,
  OfficeSettings,
  StampRecord,
  TalaqRecord,
  TypographySettings,
  User,
  UserRole,
  UserUploadedPdfBook,
} from '../types';
import { idbStorage } from './idbStorage';

export const DEFAULT_TYPOGRAPHY_SETTINGS: TypographySettings = {
  primaryFont: 'Jameel Noori Nastaleeq',
  arabicFont: 'Amiri',
  fontScale: 100, // percentage
  letterheadScale: 92, // slightly compact by default as requested
  receiptFontScale: 90, // compact Nastaleeq for receipts
  lineHeightScale: 1.35,
  boldHeadings: true,
};

export const CURRENT_USER: User = {
  id: 'usr-1',
  name: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  role: 'Super Admin',
  email: 'qazi.shahid@example.com',
};

export const INITIAL_SETTINGS: OfficeSettings = {
  qaziName: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  qaziTitle: 'نکاح خواں (رجسٹرار)',
  qaziRegistrationNo: 'NKH-REG-2024/786-LHR',
  contactNumber: '+92 300 1234567',
  email: 'qazi.shahid@al-nikah.pk',
  officeAddress: 'دار القضاء و نکاح رجسٹریشن کونسل، متصل جامع مسجد، بلاک ای، ماڈل ٹاؤن، لاہور',
  city: 'لاہور',
  district: 'لاہور',
  province: 'پنجاب',
  jurisdictionUC: 'یونین کونسل نمبر 112، 118، 124، ماڈل ٹاؤن / گلبرگ زون',
  officeTimings: 'صبح 09:00 تا شام 08:00 (جمعہ وقفہ: 01:00 تا 03:00)',
  showSealOnPrint: true,
  showSignatureOnPrint: true,
  showWatermark: true,
  disclaimerText: 'یہ دستاویز قاضی و نکاح رجسٹرار کے دفتری ریکارڈ پر مبنی نقل ہے۔ سرکاری اندراج کے حتمی نفاذ کے لیے یونین کونسل کمپیوٹرائزڈ رجسٹریشن تصدیق لازمی ہے۔',
  lastBackupDate: new Date().toISOString(),
};

export const INITIAL_NIKAH_RECORDS: NikahRecord[] = [
  {
    id: 'nkh-2026-001',
    registrationNo: 'QZ-LHR-2026-001',
    nikahNamaNo: 'BK-14-PG-89',
    date: '2026-09-15',
    hijriDate: '03 ربیع الاول 1448ھ',
    time: '08:30 شام',
    place: 'شاہی بینکوئٹ ہال، فیروزپور روڈ، ماڈل ٹاؤن، لاہور',
    unionCouncil: 'یونین کونسل 118',
    tehsil: 'ماڈل ٹاؤن',
    district: 'لاہور',
    registrarName: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    registrarLicenseNo: 'NKH-REG-2024/786-LHR',
    status: 'رجسٹرڈ',
    groom: {
      fullName: 'محمد اسامہ اکرم',
      fatherName: 'محمد اکرم چوہدری',
      cnic: '35202-8492019-3',
      dob: '1998-04-12',
      age: 28,
      religion: 'اسلام',
      maritalStatus: 'کنوارا',
      mobile: '0302-4589123',
      address: 'مکان نمبر 42، اسٹریٹ 3، بلاک سی، ماڈل ٹاؤن، لاہور',
      city: 'لاہور',
      tehsil: 'ماڈل ٹاؤن',
      district: 'لاہور',
      occupation: 'سافٹ ویئر انجینئر',
      nationality: 'پاکستانی',
      notes: 'پہلا نکاح ہے، تمام دستاویزات مکمل و تصدیق شدہ ہیں۔',
    },
    bride: {
      fullName: 'فاطمہ زہراء',
      fatherName: 'عبدالرشید انصاری',
      cnic: '35202-9182344-6',
      dob: '2001-08-20',
      age: 25,
      religion: 'اسلام',
      maritalStatus: 'کنواری',
      mobile: '0321-7654321',
      address: 'مکان نمبر 108، گلی نمبر 7، گلبرگ III، لاہور',
      city: 'لاہور',
      tehsil: 'گلبرگ',
      district: 'لاہور',
      occupation: 'لیکچرر (تعلیم)',
      nationality: 'پاکستانی',
      notes: 'تمام تصدیقات مکمل ہیں۔',
    },
    groomGuardian: {
      name: 'محمد اکرم چوہدری',
      fatherName: 'چوہدری بشیر احمد',
      cnic: '35202-1234567-1',
      mobile: '0300-8451234',
      address: 'مکان نمبر 42، بلاک سی، ماڈل ٹاؤن، لاہور',
      relationship: 'والد',
    },
    brideGuardian: {
      name: 'عبدالرشید انصاری',
      fatherName: 'حاجی غلام محمد انصاری',
      cnic: '35202-7654321-3',
      mobile: '0300-9876543',
      address: 'مکان نمبر 108، گلبرگ III، لاہور',
      relationship: 'والد',
    },
    witnesses: [
      {
        id: 'wit-1',
        name: 'حافظ طارق محمود',
        fatherName: 'حاجی محمد یوسف',
        cnic: '35202-6543210-9',
        mobile: '0312-3456789',
        address: 'مکان 15، نیو گارڈن ٹاؤن، لاہور',
        verified: true,
      },
      {
        id: 'wit-2',
        name: 'سید حسنین رضوی',
        fatherName: 'سید اختر حسین رضوی',
        cnic: '35201-4321098-7',
        mobile: '0333-8765432',
        address: 'مکان 88، شادمان کالونی، لاہور',
        verified: true,
      },
    ],
    wakeelBride: {
      name: 'محمد حامد انصاری (بھائی)',
      fatherName: 'عبدالرشید انصاری',
      cnic: '35202-5432109-1',
      mobile: '0301-2345678',
      address: 'مکان نمبر 108، گلبرگ III، لاہور',
      representing: 'دلہن',
      appointmentDate: '2026-09-15',
      notes: 'دلہن کی مکمل باضابطہ شرعی وکالت و اجازت نامہ حاصل ہے۔',
    },
    mehr: {
      type: 'سونا',
      nature: 'کچھ معجل کچھ مؤجل',
      totalAgreedAmount: 744187, // 2 Tola + 7.5 Masha
      muajjalAmount: 500000,
      muakhkharAmount: 244187,
      metalType: '24K سونا',
      tola: 2,
      masha: 7.5,
      ratti: 0,
      gram: 0,
      totalTolaEquivalent: 2.625,
      ratePerTolaAtRegistration: 283500,
      rateLocked: true,
      rateSource: 'پاکستان صرافہ مارکیٹ (باقاعدہ مقررہ ریٹ)',
      paymentStatus: 'جزوی وصول',
      amountReceived: 500000,
      remainingAmount: 244187,
      paymentDate: '2026-09-15',
      receiptNumber: 'RCPT-2026-091',
      paymentMethod: 'نقد',
      notes: '2 تولہ اور 7.5 ماشہ سونا بوقت نکاح ادا کر دیا گیا، بقیہ رقم مؤجل ہے۔',
    },
    stampPaperNo: 'PB-STP-2026-90412',
    specialConditions: 'نان و نفقہ کی بر وقت فراہمی اور شرعی حقوق کی پابندی طے پائی۔',
    createdAt: '2026-09-15T21:00:00Z',
    updatedAt: '2026-09-15T21:30:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    updatedBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'nkh-2026-002',
    registrationNo: 'QZ-LHR-2026-002',
    nikahNamaNo: 'BK-14-PG-90',
    date: '2026-09-28',
    hijriDate: '16 ربیع الاول 1448ھ',
    time: '04:00 سہ پہر',
    place: 'جامع مسجد دارالقضاء، ماڈل ٹاؤن، لاہور',
    unionCouncil: 'یونین کونسل 112',
    tehsil: 'ماڈل ٹاؤن',
    district: 'لاہور',
    registrarName: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    registrarLicenseNo: 'NKH-REG-2024/786-LHR',
    status: 'رجسٹرڈ',
    groom: {
      fullName: 'سعد بلال خالد',
      fatherName: 'خالد سلیم ملک',
      cnic: '35201-1928374-5',
      dob: '1996-11-05',
      age: 29,
      religion: 'اسلام',
      maritalStatus: 'کنوارا',
      mobile: '0322-9871234',
      address: 'فلیٹ 4-B، شاہ جمال، لاہور',
      city: 'لاہور',
      tehsil: 'لاہور کینٹ',
      district: 'لاہور',
      occupation: 'بینک منیجر',
      nationality: 'پاکستانی',
    },
    bride: {
      fullName: 'مریم نور',
      fatherName: 'نور محمد صابری',
      cnic: '35202-9988776-2',
      dob: '2000-02-14',
      age: 26,
      religion: 'اسلام',
      maritalStatus: 'کنواری',
      mobile: '0345-6677889',
      address: 'مکان 20، گلی 4، ڈیفنس فیز 5، لاہور',
      city: 'لاہور',
      tehsil: 'کینٹ',
      district: 'لاہور',
      occupation: 'فارماسسٹ',
      nationality: 'پاکستانی',
    },
    witnesses: [
      {
        id: 'wit-3',
        name: 'علی احمد ملک',
        fatherName: 'خالد سلیم ملک',
        cnic: '35201-7788990-1',
        mobile: '0321-4455667',
        address: 'شاہ جمال، لاہور',
        verified: true,
      },
      {
        id: 'wit-4',
        name: 'وقاص نور صابری',
        fatherName: 'نور محمد صابری',
        cnic: '35202-3344556-9',
        mobile: '0300-5566778',
        address: 'ڈیفنس فیز 5، لاہور',
        verified: true,
      },
    ],
    mehr: {
      type: 'چاندی',
      nature: 'معجل (فوری)',
      totalAgreedAmount: 175875, // 52.5 Tola Silver (Shariah Mehr Fatimi)
      muajjalAmount: 175875,
      muakhkharAmount: 0,
      metalType: 'خالص چاندی',
      tola: 52,
      masha: 6,
      ratti: 0,
      totalTolaEquivalent: 52.5,
      ratePerTolaAtRegistration: 3350,
      rateLocked: true,
      rateSource: 'مہر فاطمی شرعی حساب (52.5 تولہ خالص چاندی)',
      paymentStatus: 'مکمل وصول',
      amountReceived: 175875,
      remainingAmount: 0,
      paymentDate: '2026-09-28',
      receiptNumber: 'RCPT-2026-102',
      paymentMethod: 'نقد',
      notes: 'سنت نبوی کے مطابق مہر فاطمی بر وقت مجلس نکاح میں نقد پیش کیا گیا۔',
    },
    stampPaperNo: 'PB-STP-2026-90413',
    createdAt: '2026-09-28T17:00:00Z',
    updatedAt: '2026-09-28T17:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    updatedBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_TALAQ_RECORDS: TalaqRecord[] = [
  {
    id: 'tlq-2026-001',
    caseNo: 'TLQ-2026-014',
    linkedNikahNo: 'QZ-LHR-2022-108',
    husbandName: 'شاہد اقبال بٹ',
    husbandCnic: '35202-3847291-5',
    wifeName: 'عائشہ بی بی',
    wifeCnic: '35202-5829103-8',
    nikahDate: '2022-03-10',
    talaqDate: '2026-08-01',
    noticeDate: '2026-08-05',
    type: 'طلاقِ بائن',
    unionCouncil: 'یونین کونسل 118',
    tehsil: 'ماڈل ٹاؤن',
    district: 'لاہور',
    status: 'نوٹس جاری',
    arbitrationCouncilNoticeSent: true,
    notes: 'تحریری طلاق نامہ بمطابق شرع جاری کیا گیا۔ چیئرمین یونین کونسل مصالحتی کونسل کو باضابطہ نوٹس ارسال کر دیا گیا۔',
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-05T10:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_KHULA_RECORDS: KhulaRecord[] = [
  {
    id: 'khl-2026-001',
    caseNo: 'KHL-2026-008',
    linkedNikahNo: 'QZ-LHR-2021-067',
    wifeName: 'زینب شبیر',
    wifeCnic: '35201-9283741-2',
    husbandName: 'نوید احمد شیخ',
    husbandCnic: '35201-8374619-3',
    applicationDate: '2026-05-10',
    courtCaseNo: 'Family Suit # 412/2026',
    courtName: 'عدالتِ جناب فیملی جج ماڈل ٹاؤن، لاہور',
    courtOrderDate: '2026-07-20',
    courtOrderDocument: 'ڈگری فسخ نکاح بدستور خلع برائے ریکارڑ',
    unionCouncil: 'یونین کونسل 124',
    tehsil: 'ماڈل ٹاؤن',
    district: 'لاہور',
    registrationStatus: 'حکم موصول',
    completionDate: '2026-08-15',
    surrenderedMehrDetails: 'عدالتی فیصلے کے تحت 25 فیصد حق مہر کی رقم واپس ادا کی گئی۔',
    notes: 'معزز عدالت کی ڈگری کی تصدیق شدہ نقل دفتر میں جمع کروائی گئی ہے اور دفتری ریکارڈ میں اندراج کر لیا گیا ہے۔',
    createdAt: '2026-07-25T11:00:00Z',
    updatedAt: '2026-08-15T12:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_AFFIDAVITS: AffidavitRecord[] = [
  {
    id: 'aff-2026-001',
    affidavitNo: 'AFF-2026-045',
    personName: 'محمد عثمان جاوید',
    fatherName: 'جاوید اقبال',
    cnic: '35202-6152431-7',
    mobile: '0300-4123890',
    address: 'مکان 55، مین مارکیٹ گلبرگ، لاہور',
    statementType: 'بیان حلفی برائے نکاح و مجرد ہونا',
    fullStatement:
      'میں مسمی محمد عثمان جاوید حلفاً بیان کرتا ہوں کہ میں شرعاً و قانوناً بالکل مجرد (Unmarried) ہوں، میرا اس سے قبل کوئی نکاح کسی خاتون کے ساتھ قائم نہیں ہے اور نہ ہی میرے خلاف کوئی قانونی رکاوٹ موجود ہے۔ یہ بیان مکمل ہوش و حواس میں دیا۔',
    stampPaperNo: 'PB-STP-2026-88120',
    stampValue: 100,
    date: '2026-09-20',
    witness1Name: 'عمران ریاض',
    witness1Cnic: '35202-1122334-5',
    witness2Name: 'سلمان بٹ',
    witness2Cnic: '35202-9988112-3',
    hasSignature: true,
    hasThumb: true,
    hasQaziSeal: true,
    attachedDocName: 'شناختی کارڈ کاپی مصدقہ',
    createdAt: '2026-09-20T14:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'aff-2026-002',
    affidavitNo: 'AFF-2026-046',
    personName: 'عبدالشکور قادری',
    fatherName: 'حاجی محمد دین',
    cnic: '35201-5544332-1',
    mobile: '0333-4198273',
    address: 'محلہ مدینہ ٹاؤن، فیروزپور روڈ، لاہور',
    statementType: 'بیان حلفی برائے رضامندی والدین / ولی',
    fullStatement:
      'میں مسمی عبدالشکور بحیثیت والد و ولی شرعی اپنی دختر مسماۃ حفصہ بتول کے نکاح باہمراہ مسمی طلحہ فاروق اپنی مکمل رضا و خوشنودی سے کرنے کا اقرار کرتا ہوں اور اس پر کوئی جبر یا دباؤ نہیں ہے۔',
    stampPaperNo: 'PB-STP-2026-88121',
    stampValue: 100,
    date: '2026-09-25',
    witness1Name: 'محمد جمیل',
    witness1Cnic: '35201-1239874-5',
    witness2Name: 'ارشد علی',
    witness2Cnic: '35201-7651234-9',
    hasSignature: true,
    hasThumb: true,
    hasQaziSeal: true,
    createdAt: '2026-09-25T15:30:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_STAMPS: StampRecord[] = [
  {
    id: 'stp-1',
    stampNo: 'PB-STP-2026-90412',
    stampValue: 100,
    vendor: 'ملک اصغر اسٹامپ فروش، کچہری لاہور',
    purchaseDate: '2026-09-10',
    usageDate: '2026-09-15',
    relatedCase: 'QZ-LHR-2026-001',
    relatedDocType: 'نکاح نامہ',
    personName: 'محمد اسامہ اکرم',
    cnic: '35202-8492019-3',
    purpose: 'اندراج و اقرار نامہ نکاح و حق مہر',
    status: 'Used',
    createdAt: '2026-09-10T09:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'stp-2',
    stampNo: 'PB-STP-2026-90413',
    stampValue: 100,
    vendor: 'ملک اصغر اسٹامپ فروش، کچہری لاہور',
    purchaseDate: '2026-09-10',
    usageDate: '2026-09-28',
    relatedCase: 'QZ-LHR-2026-002',
    relatedDocType: 'نکاح نامہ',
    personName: 'سعد بلال خالد',
    cnic: '35201-1928374-5',
    purpose: 'اندراج نکاح و مہر فاطمی',
    status: 'Used',
    createdAt: '2026-09-10T09:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'stp-3',
    stampNo: 'PB-STP-2026-90414',
    stampValue: 100,
    vendor: 'ملک اصغر اسٹامپ فروش، کچہری لاہور',
    purchaseDate: '2026-09-10',
    purpose: 'پیشگی اسٹاک برائے حلفی بیانات و نکاح نامہ',
    status: 'Unused',
    createdAt: '2026-09-10T09:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'stp-4',
    stampNo: 'PB-STP-2026-90415',
    stampValue: 100,
    vendor: 'ملک اصغر اسٹامپ فروش، کچہری لاہور',
    purchaseDate: '2026-09-10',
    purpose: 'پیشگی اسٹاک برائے اسٹامپ پیپر',
    status: 'Unused',
    createdAt: '2026-09-10T09:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-1',
    docNo: 'DOC-2026-101',
    title: 'نکاح نامہ نقل مصدقہ - محمد اسامہ اکرم',
    category: 'نکاح نامہ نقل',
    relatedRecordType: 'نکاح',
    relatedRecordId: 'nkh-2026-001',
    personName: 'محمد اسامہ اکرم',
    cnic: '35202-8492019-3',
    date: '2026-09-15',
    isPrivate: true,
    fileSize: '1.4 MB',
    fileName: 'nikah_nama_osama_akram.pdf',
    createdAt: '2026-09-15T21:30:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'doc-2',
    docNo: 'DOC-2026-102',
    title: 'بیان حلفی برائے مجرد ہونا - عثمان جاوید',
    category: 'حلفی بیان',
    relatedRecordType: 'حلفی بیان',
    relatedRecordId: 'aff-2026-001',
    personName: 'محمد عثمان جاوید',
    cnic: '35202-6152431-7',
    date: '2026-09-20',
    isPrivate: true,
    fileSize: '820 KB',
    fileName: 'affidavit_usman_javed.pdf',
    createdAt: '2026-09-20T14:15:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'doc-3',
    docNo: 'DOC-2026-103',
    title: 'وکالت نامہ برائے نکاح - محمد حامد انصاری',
    category: 'وکالت نامہ',
    relatedRecordType: 'نکاح',
    relatedRecordId: 'nkh-2026-001',
    personName: 'محمد حامد انصاری',
    cnic: '35202-5432109-1',
    date: '2026-09-15',
    isPrivate: true,
    fileSize: '950 KB',
    fileName: 'wakalat_nama_hamid.pdf',
    createdAt: '2026-09-15T19:00:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_FEES: FeeReceipt[] = [
  {
    id: 'fee-1',
    receiptNo: 'RCPT-2026-091',
    service: 'نکاح رجسٹریشن و نکاح خوانی',
    personName: 'محمد اسامہ اکرم',
    cnic: '35202-8492019-3',
    mobile: '0302-4589123',
    amount: 15000,
    date: '2026-09-15',
    paymentMethod: 'نقد',
    status: 'وصول شدہ',
    qaziShare: 10000,
    officeExpense: 5000,
    notes: 'نکاح خوانی و قانونی دفتری اندراج فیس وصول ہوئی۔',
    createdAt: '2026-09-15T21:40:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'fee-2',
    receiptNo: 'RCPT-2026-102',
    service: 'نکاح رجسٹریشن و نکاح خوانی',
    personName: 'سعد بلال خالد',
    cnic: '35201-1928374-5',
    mobile: '0322-9871234',
    amount: 15000,
    date: '2026-09-28',
    paymentMethod: 'نقد',
    status: 'وصول شدہ',
    qaziShare: 10000,
    officeExpense: 5000,
    notes: 'مسجد میں منعقد نکاح خوانی فیس۔',
    createdAt: '2026-09-28T17:15:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
  {
    id: 'fee-3',
    receiptNo: 'RCPT-2026-105',
    service: 'حلفی بیان و تصدیق',
    personName: 'محمد عثمان جاوید',
    cnic: '35202-6152431-7',
    mobile: '0300-4123890',
    amount: 2500,
    date: '2026-09-20',
    paymentMethod: 'ایزی پیسہ',
    status: 'وصول شدہ',
    notes: 'اسٹامپ پیپر و بیان حلفی کی تیاری و تصدیق۔',
    createdAt: '2026-09-20T14:30:00Z',
    createdBy: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'CREATE',
    entityType: 'NIKAH',
    entityId: 'nkh-2026-001',
    entityDescription: 'نیا نکاح ریکارڈ: محمد اسامہ اکرم باہمراہ فاطمہ زہراء (QZ-LHR-2026-001)',
    userName: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    userRole: 'Super Admin',
    timestamp: '2026-09-15T21:00:00Z',
  },
  {
    id: 'log-2',
    action: 'CREATE',
    entityType: 'FEE',
    entityId: 'fee-1',
    entityDescription: 'رسید فیس جاری برائے نکاح خوانی: رقم 15,000 روپے (RCPT-2026-091)',
    userName: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    userRole: 'Super Admin',
    timestamp: '2026-09-15T21:40:00Z',
  },
  {
    id: 'log-3',
    action: 'CREATE',
    entityType: 'NIKAH',
    entityId: 'nkh-2026-002',
    entityDescription: 'نیا نکاح ریکارڈ: سعد بلال خالد باہمراہ مریم نور (QZ-LHR-2026-002)',
    userName: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    userRole: 'Super Admin',
    timestamp: '2026-09-28T17:00:00Z',
  },
];

const STORAGE_KEYS = {
  NIKAH: 'qazi_app_nikah_records_v1',
  TALAQ: 'qazi_app_talaq_records_v1',
  KHULA: 'qazi_app_khula_records_v1',
  AFFIDAVIT: 'qazi_app_affidavit_records_v1',
  STAMP: 'qazi_app_stamp_records_v1',
  DOCUMENTS: 'qazi_app_documents_v1',
  FEES: 'qazi_app_fees_v1',
  AUDIT: 'qazi_app_audit_logs_v1',
  SETTINGS: 'qazi_app_settings_v1',
  USER: 'qazi_app_user_v1',
  CUSTOM_FONTS: 'qazi_app_custom_fonts_v1',
  TYPOGRAPHY_SETTINGS: 'qazi_app_typography_settings_v1',
  USER_PDF_BOOKS: 'qazi_app_user_pdf_books_v1',
};

// Storage Service Wrapper
export const storageService = {
  getNikahs(): NikahRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.NIKAH);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.NIKAH, JSON.stringify(INITIAL_NIKAH_RECORDS));
      return INITIAL_NIKAH_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_NIKAH_RECORDS;
    }
  },

  saveNikahs(records: NikahRecord[]) {
    localStorage.setItem(STORAGE_KEYS.NIKAH, JSON.stringify(records));
  },

  getTalaqRecords(): TalaqRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.TALAQ);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TALAQ, JSON.stringify(INITIAL_TALAQ_RECORDS));
      return INITIAL_TALAQ_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TALAQ_RECORDS;
    }
  },

  saveTalaqRecords(records: TalaqRecord[]) {
    localStorage.setItem(STORAGE_KEYS.TALAQ, JSON.stringify(records));
  },

  getKhulaRecords(): KhulaRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.KHULA);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.KHULA, JSON.stringify(INITIAL_KHULA_RECORDS));
      return INITIAL_KHULA_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_KHULA_RECORDS;
    }
  },

  saveKhulaRecords(records: KhulaRecord[]) {
    localStorage.setItem(STORAGE_KEYS.KHULA, JSON.stringify(records));
  },

  getAffidavits(): AffidavitRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.AFFIDAVIT);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.AFFIDAVIT, JSON.stringify(INITIAL_AFFIDAVITS));
      return INITIAL_AFFIDAVITS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_AFFIDAVITS;
    }
  },

  saveAffidavits(records: AffidavitRecord[]) {
    localStorage.setItem(STORAGE_KEYS.AFFIDAVIT, JSON.stringify(records));
  },

  getStamps(): StampRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.STAMP);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STAMP, JSON.stringify(INITIAL_STAMPS));
      return INITIAL_STAMPS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STAMPS;
    }
  },

  saveStamps(records: StampRecord[]) {
    localStorage.setItem(STORAGE_KEYS.STAMP, JSON.stringify(records));
  },

  getDocuments(): LegalDocument[] {
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
      return INITIAL_DOCUMENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  saveDocuments(records: LegalDocument[]) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(records));
  },

  getFees(): FeeReceipt[] {
    const data = localStorage.getItem(STORAGE_KEYS.FEES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(INITIAL_FEES));
      return INITIAL_FEES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_FEES;
    }
  },

  saveFees(records: FeeReceipt[]) {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(records));
  },

  getAuditLogs(): AuditLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  logAction(
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    entityDescription: string,
    user: User,
    details?: string
  ) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      action,
      entityType,
      entityId,
      entityDescription,
      userName: user.name,
      userRole: user.role,
      timestamp: new Date().toISOString(),
      details,
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    const trimmed = logs.slice(0, 200);
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(trimmed));
  },

  getSettings(): OfficeSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: OfficeSettings) {
    settings.lastBackupDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getUser(): User {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) {
      return CURRENT_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return CURRENT_USER;
    }
  },

  saveUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getTypographySettings(): TypographySettings {
    const data = localStorage.getItem(STORAGE_KEYS.TYPOGRAPHY_SETTINGS);
    if (!data) return DEFAULT_TYPOGRAPHY_SETTINGS;
    try {
      return { ...DEFAULT_TYPOGRAPHY_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_TYPOGRAPHY_SETTINGS;
    }
  },

  saveTypographySettings(settings: TypographySettings) {
    localStorage.setItem(STORAGE_KEYS.TYPOGRAPHY_SETTINGS, JSON.stringify(settings));
  },

  _customFontsCache: null as CustomFontItem[] | null,
  _userPdfBooksCache: null as UserUploadedPdfBook[] | null,

  getCustomFonts(): CustomFontItem[] {
    if (this._customFontsCache) return this._customFontsCache;
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_FONTS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      this._customFontsCache = parsed;
      return parsed;
    } catch {
      return [];
    }
  },

  saveCustomFonts(fonts: CustomFontItem[]) {
    this._customFontsCache = fonts;
    // Persist full font data (including large base64 DataURLs) to IndexedDB
    idbStorage.saveStoredCustomFonts(fonts).catch((err) => {
      console.warn('Error saving fonts to IndexedDB:', err);
    });

    // Safely store metadata in localStorage, catching any QuotaExceededError
    try {
      const metaOnly = fonts.map((f) => ({
        id: f.id,
        name: f.name,
        fileName: f.fileName,
        format: f.format,
        uploadedAt: f.uploadedAt,
        fileSizeKb: f.fileSizeKb,
        fontData: f.fontData && f.fontData.length < 50000 ? f.fontData : '',
      }));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_FONTS, JSON.stringify(metaOnly));
    } catch (quotaErr) {
      console.warn('LocalStorage quota safe fallback: full font retained in IndexedDB');
      try {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_FONTS);
      } catch {}
    }
  },

  getUserPdfBooks(): UserUploadedPdfBook[] {
    if (this._userPdfBooksCache) return this._userPdfBooksCache;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PDF_BOOKS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      this._userPdfBooksCache = parsed;
      return parsed;
    } catch {
      return [];
    }
  },

  saveUserPdfBooks(books: UserUploadedPdfBook[]) {
    this._userPdfBooksCache = books;
    idbStorage.saveStoredUserPdfBooks(books).catch((err) => {
      console.warn('Error saving PDF books to IndexedDB:', err);
    });

    try {
      const metaOnly = books.map((b) => ({
        id: b.id,
        title: b.title,
        fileName: b.fileName,
        category: b.category,
        author: b.author,
        uploadedAt: b.uploadedAt,
        fileSizeKb: b.fileSizeKb,
        description: b.description,
        pdfDataUrl: b.pdfDataUrl && b.pdfDataUrl.length < 50000 ? b.pdfDataUrl : '',
      }));
      localStorage.setItem(STORAGE_KEYS.USER_PDF_BOOKS, JSON.stringify(metaOnly));
    } catch (quotaErr) {
      console.warn('LocalStorage quota safe fallback: full PDF book retained in IndexedDB');
      try {
        localStorage.removeItem(STORAGE_KEYS.USER_PDF_BOOKS);
      } catch {}
    }
  },

  // Export full JSON database
  exportAllData(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      nikahs: this.getNikahs(),
      talaq: this.getTalaqRecords(),
      khula: this.getKhulaRecords(),
      affidavits: this.getAffidavits(),
      stamps: this.getStamps(),
      documents: this.getDocuments(),
      fees: this.getFees(),
      auditLogs: this.getAuditLogs(),
    };
    return JSON.stringify(payload, null, 2);
  },

  // Restore database
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.nikahs) this.saveNikahs(data.nikahs);
      if (data.talaq) this.saveTalaqRecords(data.talaq);
      if (data.khula) this.saveKhulaRecords(data.khula);
      if (data.affidavits) this.saveAffidavits(data.affidavits);
      if (data.stamps) this.saveStamps(data.stamps);
      if (data.documents) this.saveDocuments(data.documents);
      if (data.fees) this.saveFees(data.fees);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // Reset to initial clean state
  resetToSampleData() {
    localStorage.setItem(STORAGE_KEYS.NIKAH, JSON.stringify(INITIAL_NIKAH_RECORDS));
    localStorage.setItem(STORAGE_KEYS.TALAQ, JSON.stringify(INITIAL_TALAQ_RECORDS));
    localStorage.setItem(STORAGE_KEYS.KHULA, JSON.stringify(INITIAL_KHULA_RECORDS));
    localStorage.setItem(STORAGE_KEYS.AFFIDAVIT, JSON.stringify(INITIAL_AFFIDAVITS));
    localStorage.setItem(STORAGE_KEYS.STAMP, JSON.stringify(INITIAL_STAMPS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(INITIAL_FEES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
  },
};
