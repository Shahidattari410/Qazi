export type UserRole =
  | 'Super Admin'
  | 'Qazi'
  | 'Registrar'
  | 'Assistant'
  | 'Accountant'
  | 'Document Manager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export type NikahStatus = 'رجسٹرڈ' | 'زیرِ کارروائی' | 'تصدیق شدہ' | 'منسوخ';
export type PaymentStatus = 'مکمل وصول' | 'جزوی وصول' | 'وصول نہیں ہوا';
export type MetalUnit = 'تولہ' | 'ماشہ' | 'رتی' | 'گرام';
export type MetalType = '24K سونا' | '22K سونا' | '21K سونا' | '18K سونا' | 'خالص چاندی' | 'مارکیٹ چاندی';

export interface GuardianRecord {
  name: string;
  fatherName: string;
  cnic: string;
  mobile: string;
  address: string;
  relationship: 'والد' | 'والدہ' | 'ولی شرعی' | 'سرپرست قانونی' | 'دیگر';
  notes?: string;
}

export interface WitnessRecord {
  id: string;
  name: string;
  fatherName: string;
  cnic: string;
  mobile: string;
  address: string;
  verified: boolean;
  notes?: string;
}

export interface WakeelRecord {
  name: string;
  fatherName: string;
  cnic: string;
  mobile: string;
  address: string;
  representing: 'دولہا' | 'دلہن';
  appointmentDate: string;
  notes?: string;
}

export interface MehrRecord {
  type: 'نقد رقم' | 'سونا' | 'چاندی' | 'جائیداد' | 'دیگر' | 'مخلوط';
  nature: 'معجل (فوری)' | 'مؤجل (مؤخر)' | 'کچھ معجل کچھ مؤجل';
  totalAgreedAmount: number; // In PKR
  muajjalAmount: number;
  muakhkharAmount: number;
  cashAmount?: number;
  metalType?: MetalType;
  tola?: number;
  masha?: number;
  ratti?: number;
  gram?: number;
  totalTolaEquivalent?: number;
  ratePerTolaAtRegistration?: number;
  rateLocked: boolean;
  rateSource?: string;
  propertyDetails?: string;
  otherDetails?: string;
  paymentStatus: PaymentStatus;
  amountReceived: number;
  remainingAmount: number;
  paymentDate?: string;
  receiptNumber?: string;
  paymentMethod?: 'نقد' | 'بینک ٹرانسفر' | 'ایزی پیسہ / جاز کیش' | 'چیک';
  notes?: string;
}

export interface GroomRecord {
  fullName: string;
  fatherName: string;
  cnic: string;
  bForm?: string;
  dob: string;
  age: number;
  religion: string;
  maritalStatus: 'کنوارا' | 'شادی شدہ (پہلی بیوی موجود)' | 'طلاق یافتہ' | 'رنڈوا';
  mobile: string;
  address: string;
  city: string;
  tehsil: string;
  district: string;
  occupation: string;
  nationality: string;
  previousMaritalInfo?: string;
  photoUrl?: string;
  notes?: string;
}

export interface BrideRecord {
  fullName: string;
  fatherName: string;
  cnic: string;
  bForm?: string;
  dob: string;
  age: number;
  religion: string;
  maritalStatus: 'کنواری' | 'بیوہ' | 'طلاق یافتہ';
  mobile: string;
  address: string;
  city: string;
  tehsil: string;
  district: string;
  occupation: string;
  nationality: string;
  previousMaritalInfo?: string;
  photoUrl?: string;
  notes?: string;
}

export interface NikahRecord {
  id: string;
  registrationNo: string;
  nikahNamaNo: string;
  date: string;
  hijriDate?: string;
  time: string;
  place: string;
  unionCouncil: string;
  tehsil: string;
  district: string;
  registrarName: string;
  registrarLicenseNo: string;
  status: NikahStatus;
  groom: GroomRecord;
  bride: BrideRecord;
  groomGuardian?: GuardianRecord;
  brideGuardian?: GuardianRecord;
  witnesses: WitnessRecord[];
  wakeelGroom?: WakeelRecord;
  wakeelBride?: WakeelRecord;
  mehr: MehrRecord;
  specialConditions?: string;
  qaziNotes?: string;
  stampPaperNo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type TalaqStatus = 'زیرِ کارروائی' | 'نوٹس جاری' | 'کارروائی مکمل' | 'رجسٹریشن مکمل' | 'صلح / منسوخ';

export interface TalaqRecord {
  id: string;
  caseNo: string;
  linkedNikahNo?: string;
  husbandName: string;
  husbandCnic: string;
  wifeName: string;
  wifeCnic: string;
  nikahDate?: string;
  talaqDate: string;
  noticeDate?: string;
  type: 'طلاقِ احسن' | 'طلاقِ حسن' | 'طلاقِ بائن' | 'طلاقِ مغلظہ (ثلاثہ)';
  unionCouncil: string;
  tehsil: string;
  district: string;
  status: TalaqStatus;
  arbitrationCouncilNoticeSent: boolean;
  notes?: string;
  attachedDocs?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type KhulaStatus = 'درخواست' | 'عدالتی کارروائی' | 'حکم موصول' | 'UC کارروائی' | 'مکمل';

export interface KhulaRecord {
  id: string;
  caseNo: string;
  linkedNikahNo?: string;
  wifeName: string;
  wifeCnic: string;
  husbandName: string;
  husbandCnic: string;
  applicationDate: string;
  courtCaseNo: string;
  courtName: string;
  courtOrderDate: string;
  courtOrderDocument?: string;
  unionCouncil: string;
  tehsil: string;
  district: string;
  registrationStatus: KhulaStatus;
  completionDate?: string;
  surrenderedMehrDetails?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type AffidavitType =
  | 'بیان حلفی برائے نکاح و مجرد ہونا'
  | 'بیان حلفی برائے رضامندی والدین / ولی'
  | 'بیان حلفی برائے درستگی کوائف'
  | 'بیان حلفی برائے گمشدگی نکاح نامہ'
  | 'اقرار نامہ حق مہر'
  | 'دیگر حلفی بیان';

export interface AffidavitRecord {
  id: string;
  affidavitNo: string;
  personName: string;
  fatherName: string;
  cnic: string;
  mobile: string;
  address: string;
  statementType: AffidavitType;
  fullStatement: string;
  stampPaperNo: string;
  stampValue: number;
  date: string;
  witness1Name: string;
  witness1Cnic: string;
  witness2Name: string;
  witness2Cnic: string;
  hasSignature: boolean;
  hasThumb: boolean;
  hasQaziSeal: boolean;
  attachedDocName?: string;
  createdAt: string;
  createdBy: string;
}

export type StampStatus = 'Unused' | 'Used' | 'Cancelled';

export interface StampRecord {
  id: string;
  stampNo: string;
  stampValue: number;
  vendor: string;
  purchaseDate: string;
  usageDate?: string;
  relatedCase?: string;
  relatedDocType?: string;
  personName?: string;
  cnic?: string;
  purpose: string;
  status: StampStatus;
  scanUrl?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export type LegalDocType =
  | 'حلفی بیان'
  | 'اسٹام پیپر'
  | 'اقرار نامہ'
  | 'رضامندی نامہ'
  | 'وکالت نامہ'
  | 'نکاح نامہ نقل'
  | 'طلاق نوٹس نقل'
  | 'عدالتی ڈگری خلع نقل'
  | 'شناختی کارڈ نقل'
  | 'رسید'
  | 'دیگر دستاویزی ثبوت';

export interface LegalDocument {
  id: string;
  docNo: string;
  title: string;
  category: LegalDocType;
  relatedRecordType?: 'نکاح' | 'طلاق' | 'خلع' | 'حلفی بیان' | 'اسٹامپ' | 'عمومی';
  relatedRecordId?: string;
  personName: string;
  cnic?: string;
  date: string;
  isPrivate: boolean;
  description?: string;
  fileSize?: string;
  fileName?: string;
  createdAt: string;
  createdBy: string;
}

export interface FeeReceipt {
  id: string;
  receiptNo: string;
  service: 'نکاح رجسٹریشن و نکاح خوانی' | 'تیاری دستاویزات و کاپی' | 'حلفی بیان و تصدیق' | 'طلاق نوٹس دفتری اندراج' | 'خلع عدالتی ریکارڈ اندراج' | 'حق مہر مشاورت و ریکارڈ' | 'دیگر خدمات';
  personName: string;
  cnic: string;
  mobile: string;
  amount: number;
  date: string;
  paymentMethod: 'نقد' | 'بینک ٹرانسفر' | 'ایزی پیسہ' | 'جاز کیش';
  status: 'وصول شدہ' | 'زیر التواء' | 'منسوخ';
  qaziShare?: number;
  officeExpense?: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PRINT' | 'EXPORT' | 'RESTORE' | 'LOGIN';
  entityType: 'NIKAH' | 'TALAQ' | 'KHULA' | 'AFFIDAVIT' | 'STAMP' | 'FEE' | 'DOCUMENT' | 'SETTINGS' | 'SYSTEM';
  entityId: string;
  entityDescription: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
  details?: string;
}

export interface OfficeSettings {
  qaziName: string;
  qaziTitle: string;
  qaziRegistrationNo: string;
  contactNumber: string;
  email: string;
  officeAddress: string;
  city: string;
  district: string;
  province: string;
  jurisdictionUC: string;
  officeTimings: string;
  showSealOnPrint: boolean;
  showSignatureOnPrint: boolean;
  showWatermark: boolean;
  disclaimerText: string;
  lastBackupDate?: string;
}

export interface MetalRateData {
  gold24KPerTola: number;
  gold22KPerTola: number;
  gold21KPerTola: number;
  gold18KPerTola: number;
  silverPurePerTola: number;
  silverMarketPerTola: number;
  source: string;
  isLive: boolean;
  lastUpdated: string;
  currency: string;
}

export interface CustomFontItem {
  id: string;
  name: string;
  fileName: string;
  fontData: string; // base64 or object URL
  format: 'truetype' | 'opentype' | 'woff' | 'woff2';
  uploadedAt: string;
  fileSizeKb: number;
}

export interface TypographySettings {
  primaryFont: string;
  arabicFont: string;
  fontScale: number; // 80 to 140
  letterheadScale: number; // 75 to 125
  receiptFontScale: number; // 75 to 125
  lineHeightScale: number; // 1.2 to 1.8
  boldHeadings: boolean;
}

export interface UserUploadedPdfBook {
  id: string;
  title: string;
  subtitle?: string;
  category: 'نکاح' | 'طلاق' | 'خلع' | 'عائلی قوانین' | 'فقہی فتاویٰ' | 'رہنمائے رجسٹرار' | 'دیگر کتب';
  author: string;
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  description?: string;
  pdfDataUrl: string;
  pageCount?: number;
}
