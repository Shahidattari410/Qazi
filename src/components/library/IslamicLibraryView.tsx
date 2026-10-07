import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Printer,
  X,
  Bookmark,
  Share2,
  FileText,
  Scale,
  HeartHandshake,
  CheckCircle2,
  Info,
  Upload,
  PlusCircle,
  FileCheck,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { triggerReliablePrint } from '../../utils/urduUtils';
import { Emblem } from '../common/Emblem';
import { storageService } from '../../services/storage';
import { idbStorage } from '../../services/idbStorage';
import { UserUploadedPdfBook } from '../../types';

interface IslamicBook {
  id: string;
  title: string;
  subtitle: string;
  category: 'نکاح' | 'طلاق' | 'خلع' | 'عائلی قوانین' | 'رہنمائے رجسٹرار';
  author: string;
  pages: number;
  description: string;
  color: string;
  chapters: {
    title: string;
    content: string;
    references?: string[];
  }[];
}

const ISLAMIC_BOOKS: IslamicBook[] = [
  {
    id: 'bk-talaq',
    title: 'کتاب الطلاق و فقہی احکامِ عدت',
    subtitle: 'طلاق کی شرعی اقسام، عدت، رجوع اور مصالحتی کونسل نوٹس کے اصول',
    category: 'طلاق',
    author: 'تحقیق و تدوین: مفتیانِ کرام دار القضاء',
    pages: 64,
    color: 'from-rose-950 via-rose-900 to-rose-950',
    description:
      'طلاق کے شرعی، قانونی اور احتیاطی پہلوؤں پر مشتمل مدلل رسالہ جس میں طلاقِ احسن، طلاقِ حسن، طلاقِ بائن اور تین طلاقوں کے فقہی احکام مفصل درج ہیں۔',
    chapters: [
      {
        title: 'باب 1: طلاق کی تعریف و شرعی حیثیت',
        content:
          'شریعتِ مطہرہ میں حلال چیزوں میں سب سے زیادہ ناپسندیدہ امر طلاق ہے۔ حدیث مبارک میں وارد ہے: "أَبْغَضُ الْحَلاَلِ إِلَى اللَّهِ الطَّلاَقُ" (ابوداؤد شریف)۔ بغیر کسی شدید مجبوری اور ناگزیر وجہ کے طلاق دینا گناہ ہے۔ اگر میاں بیوی کے درمیان نباہ کی کوئی صورت باقی نہ رہے تو شریعت نے طلاق کو آخری چارہ کار کے طور پر جائز قرار دیا ہے۔',
        references: ['سنن ابی داؤد، کتاب الطلاق، حدیث 2178', 'فتاویٰ عالمگیری، کتاب الطلاق، جلد 1'],
      },
      {
        title: 'باب 2: طلاق کی اقسام (احسن، حسن، بائن اور مغلظہ)',
        content:
          '1. طلاقِ احسن: یہ ہے کہ شوہر بیوی کو ایک طلاق رجعی ایسے طہر (پاکی کے زمانے) میں دے جس میں اس سے صحبت نہ کی ہو اور عدت ختم ہونے تک مزید کوئی طلاق نہ دے۔ اس میں دورانِ عدت رجوع کا شرعی حق حاصل رہتا ہے۔\n2. طلاقِ حسن: یہ کہ ہر طہر میں ایک ایک طلاق دی جائے۔\n3. طلاقِ بائن: وہ طلاق جس سے نکاح فوری طور پر ٹوٹ جاتا ہے، شوہر بغیر تجدیدِ نکاح کے رجوع نہیں کر سکتا۔\n4. طلاقِ ثلاثہ (مغلظہ): ایک ہی وقت میں یا تین طلاقیں متفرق دینا، جس سے مغلظہ واقع ہو جاتی ہے اور بغیر شرعی حلالہ کے دوبارہ نکاح جائز نہیں ہوتا۔ ایک ساتھ تین طلاقیں دینا سخت گناہ و بدعت ہے اگرچہ ائمہ اربعہ کے نزدیک تینوں واقع ہو جاتی ہیں۔',
        references: ['ہدایہ، کتاب الطلاق، فصل فی طلاق السنہ', 'فتاویٰ رضویہ، جلد 12'],
      },
      {
        title: 'باب 3: عدت کے شرعی احکام اور نان و نفقہ',
        content:
          'مطلقہ خاتون کی عدت اگر وہ حائضہ ہو تو تین حیض ہے: "وَالْمُطَلَّقَاتُ يَتَرَبَّصْنَ بِأَنفُسِهِنَّ ثَلاَثَةَ قُرُوءٍ" (البقرہ: 228)۔ اگر حاملہ ہو تو وضعِ حمل تک ہے: "وَأُوْلاَتُ الأَحْمَالِ أَجَلُهُنَّ أَن يَضَعْنَ حَمْلَهُنَّ" (الطلاق: 4)۔ دورانِ عدت رہائش اور نان و نفقہ شوہر کے ذمہ واجب رہتا ہے۔',
        references: ['القرآن الکریم، سورۃ البقرۃ و سورۃ الطلاق', 'درِ مختار مع رد المحتار'],
      },
      {
        title: 'باب 4: مسلم فیملی لاز آرڈیننس 1961ء اور نوٹس ثالثی کونسل',
        content:
          'مسلم فیملی لاز آرڈیننس 1961ء کی دفعہ 7 کے تحت شوہر پر لازم ہے کہ وہ طلاق دینے کے بعد چیئرمین یونین کونسل کو تحریری نوٹس بھیجے اور اس کی ایک نقل بیوی کو ارسال کرے۔ نوٹس موصول ہونے کے بعد 30 دن کے اندر مصالحتی کونسل تشکیل دی جاتی ہے تاکہ صلح کی کوشش کی جائے۔ اگر 90 دن کے اندر صلح نہ ہو تو طلاق قانونی طور پر موثر تسلیم کی جاتی ہے۔ شرعی اعتبار سے طلاق الفاظ کی ادائیگی کے وقت ہی واقع ہو جاتی ہے، مگر قانونی اثرات 90 دن بعد نافذ ہوتے ہیں۔',
        references: ['مسلم فیملی لاز آرڈیننس 1961ء، دفعہ 7', 'پی ایل ڈی 1988 سپریم کورٹ 435'],
      },
    ],
  },
  {
    id: 'bk-khula',
    title: 'احکامِ خلع و فسخِ نکاح کی شرعی حیثیت',
    subtitle: 'عدالتی خلع کی شرائط، بدلِ خلع اور مہر کی واپسی کی فقہی تفصیلات',
    category: 'خلع',
    author: 'جامعہ دارالقضاء فقہی بورڈ',
    pages: 52,
    color: 'from-blue-950 via-blue-900 to-blue-950',
    description:
      'خلع کی حقیقت، قرآن و سنت میں خلع کا ثبوت، مرد کی رضامندی کی اہمیت، اور فیملی کورٹ سے جاری شدہ یکطرفہ خلع ڈگری کی شرعی تحقیق۔',
    chapters: [
      {
        title: 'باب 1: خلع کی شرعی تعریف و اصل',
        content:
          'خلع کا لغوی معنی اتار پھینکنا ہے۔ شرعی اصطلاح میں عورت کا اپنے شوہر کو کچھ مال (مثلاً حق مہر کی واپسی) دے کر نکاح ختم کروانا خلع کہلاتا ہے۔ قرآن مجید میں ارشاد باری تعالی ہے: "فَإِنْ خِفْتُمْ أَلاَّ يُقِيمَا حُدُودَ اللَّهِ فَلاَ جُنَاحَ عَلَيْهِمَا فِيمَا افْتَدَتْ بِهِ" (البقرہ: 229)۔ اسلام میں سب سے پہلا خلع حضرت ثابت بن قیس رضی اللہ عنہ کی زوجہ حبیبہ بنت سہل رضی اللہ عنہا کا حضور اقدس ﷺ کے روبرو واقع ہوا، جس میں حضور ﷺ نے انہیں شوہر کا دیا ہوا باغ واپس کرنے کا حکم دیا۔',
        references: ['صحیح بخاری، کتاب الطلاق، باب الخلع', 'جامع الترمذی، حدیث 1187'],
      },
      {
        title: 'باب 2: کیا خلع کے لیے شوہر کی رضا مندی شرط ہے؟',
        content:
          'جمہور فقہائے اسلام اور ائمہ اربعہ (امام ابو حنیفہ، امام مالک، امام شافعی اور امام احمد بن حنبل رحمہم اللہ) کے نزدیک خلع ایک باہمی معاہدہ ہے جس کے لیے شوہر کا راضی ہونا یا قبول کرنا شرط ہے۔ اگر شوہر بلاوجہ ظلم کرے اور نہ بسائے اور نہ طلاق دے تو قاضیِ شرعی کو تفریق اور فسخِ نکاح کا اختیار حاصل ہوتا ہے۔',
        references: ['بدائع الصنائع، امام کاسانی', 'فتاویٰ ہندیہ، باب الخلع'],
      },
      {
        title: 'باب 3: عدالتی ڈگری خلع (Family Court Decree) اور فتویٰ',
        content:
          'پاکستان میں فیملی کورٹس ایکٹ 1964ء کے تحت عدالتِ مجاز کو خلع کی ڈگری جاری کرنے کا اختیار ہے۔ اگر عدالت میں شوہر طلاق دینے پر راضی نہ ہو لیکن مصالحت مکمل طور پر ناکام ہو چکی ہو اور عورت نفرت و عداوت کی بنا پر حدود اللہ قائم نہ رکھ سکتی ہو، تو معزز عدالت مہر کے جزوی یا کلی سرنڈر کے بدلے فسخِ نکاح کر سکتی ہے۔ اس پر مختلف مکاتبِ فکر کے فقہی فتاویٰ موجود ہیں۔',
        references: ['فتاویٰ رضویہ، جلد 12، کتاب الطلاق', 'قانونی عائلی نظائر PLD 1967 SC 97'],
      },
    ],
  },
  {
    id: 'bk-nikah',
    title: 'کتاب النکاح و مہرِ فاطمی کی شرعی حقیقت',
    subtitle: 'نکاح کے ارکان، شرائط، کفاءت، ایجاب و قبول اور حق مہر کا دقیق حساب',
    category: 'نکاح',
    author: 'مولانا قاضی حافظ محمد شاہد عطاری مدنی',
    pages: 78,
    color: 'from-emerald-950 via-emerald-900 to-emerald-950',
    description:
      'نکاح کے فقہی ارکان، ولی اور گواہان کے احکام، اور مہرِ فاطمی کا سونے چاندی کی موجودہ مارکیٹ قیمت کے حساب سے جامع گائیڈ۔',
    chapters: [
      {
        title: 'باب 1: نکاح کی فضیلت اور شرعی ارکان',
        content:
          'نکاح سنتِ انبیاء اور دین کا نصف ہے۔ رسول اللہ ﷺ کا ارشاد مبارک ہے: "النِّكَاحُ مِنْ سُنَّتِي فَمَنْ لَمْ يَعْمَلْ بِسُنَّتِي فَلَيْسَ مِنِّي" (ابن ماجہ)۔ نکاح کے ارکان ایجاب و قبول ہیں جو ایک ہی مجلس میں دو عاقل بالغ مسلمان مرد گواہوں یا ایک مرد اور دو عورتوں کی موجودگی میں صریح الفاظ میں ادا کیے جائیں۔',
        references: ['سنن ابن ماجہ، کتاب النکاح، حدیث 1846', 'رد المحتار علی الدر المختار'],
      },
      {
        title: 'باب 2: حق مہر کی حقیقت و اقسام (معجل و مؤجل)',
        content:
          'مہر عورت کا وہ شرعی حق ہے جو نکاح کی بدولت شوہر پر واجب ہوتا ہے۔ مہر کی کم از کم مقدار فقہ حنفی میں 10 درہم (یعنی 2 تولہ 7.5 ماشہ چاندی) ہے۔ زیادہ کی کوئی حد شریعت نے مقرر نہیں کی، البتہ آسانی اور اعتدال پسندیدہ ہے۔ مہر معجل وہ ہے جو فی الفور مجلس نکاح میں ادا کیا جائے، اور مؤجل وہ ہے جس کی ادائیگی بعد میں یا طلاق/وفات پر طے ہو۔',
        references: ['القرآن: وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً', 'فتاویٰ رضویہ، جلد 11'],
      },
      {
        title: 'باب 3: مہرِ فاطمی کا شرعی وزن اور سونا چاندی حساب',
        content:
          'سیدہ فاطمۃ الزہراء رضی اللہ عنہا کا مہر 500 درہم تھا، جس کا وزن 131 تولہ 3 ماشہ (یا مستند تخمینہ 52.5 تولہ خالص چاندی) ہے۔ موجودہ صرافہ مارکیٹ میں خالص چاندی کے ریٹ کے مطابق مہر فاطمی کا تعین کر کے نکاح میں باندھنا سنتِ متوارثہ اور برکت کا باعث ہے۔',
        references: ['مدارج النبوت، شیخ عبدالحق محدث دہلوی', 'بہارِ شریعت، حصہ ہفتم'],
      },
    ],
  },
  {
    id: 'bk-guide',
    title: 'رہنمائے نکاح خواں و شرعی رجسٹرار',
    subtitle: 'رجسٹرار کے لیے 25 کالم فارم دوم کی تیاری اور قانونی تدابیر',
    category: 'رہنمائے رجسٹرار',
    author: 'دار القضاء اکیڈمی برائے قانونی تربیت',
    pages: 48,
    color: 'from-amber-950 via-amber-900 to-amber-950',
    description:
      'نکاح خواں اور رجسٹرار کے لیے شناختی تصدیقات، ب فارم، گواہوں کے انگوٹھے، اور قانونی غلطیوں سے بچنے کا دستی ضابطہ۔',
    chapters: [
      {
        title: 'باب 1: نکاح فارم دوم کے 25 کالمات کی باریکیاں',
        content:
          'رجسٹرار پر لازم ہے کہ وہ فارم دوم کے تمام 25 کالمات کو خود روبرو فریقین پر کرے۔ کالم 13 (تاریخ)، کالم 14-16 (مہر کی تفصیل)، کالم 17 (تفویضِ طلاق)، اور کالم 21 (دوسری شادی کی ثالثی اجازت) انتہائی نازک قانونی کالمات ہیں جنہیں کبھی خالی نہیں چھوڑنا چاہیے۔',
        references: ['مسلم فیملی لاز رولز 1961ء، رول 8 تا 12'],
      },
      {
        title: 'باب 2: کم عمری کی شادی کی قانونی ممانعت',
        content:
          'چائلڈ میرج ریسٹرینٹ ایکٹ کے تحت نکاح کے وقت لڑکے اور لڑکی کے اصل شناختی کارڈ یا نادرا ب فارم کی جانچ پڑتال رجسٹرار کی بنیادی ذمہ داری ہے۔ بغیر عمر تصدیق نکاح خوانی فوجداری جرم بن سکتی ہے۔',
        references: ['Child Marriage Restraint Act 1929 / Provincial Amendments'],
      },
    ],
  },
  {
    id: 'bk-family-laws',
    title: 'مسلم عائلی قوانین 1961ء و عدالتی نظائر طلاق و خلع',
    subtitle: 'سیکشن 7 و 8 کا تفصیلی تجزیہ، چیئرمین ثالثی کونسل نوٹس اور فیملی کورٹس ایکٹ',
    category: 'عائلی قوانین',
    author: 'تحقیق: قانونی و شرعی شعبہ دار القضاء',
    pages: 88,
    color: 'from-slate-950 via-slate-900 to-slate-950',
    description:
      'طلاق کے 90 روزہ نوٹس، چیئرمین یونین کونسل کے مصالحتی اختیارات، اور عدالتی خلع ڈگری کے بعد طلاق سرٹیفکیٹ کے اجراء پر عدالتی نظائر۔',
    chapters: [
      {
        title: 'باب 1: سیکشن 7 مسلم فیملی لاز آرڈیننس 1961ء اور طلاق کی قانونی تاثیر',
        content:
          'دفعہ 7 کے تحت شوہر زبانی یا تحریری طلاق دینے کے فوراً بعد چیئرمین یونین کونسل کو نوٹس بھیجنے کا پابند ہے۔ چیئرمین نوٹس وصولی کے 30 دن کے اندر دونوں فریقین کے نمائندوں پر مشتمل ثالثی کونسل تشکیل دیتا ہے۔ اگر 90 دن کے اندر مصالحت کامیاب نہ ہو تو طلاق موثر ہونے کا سرٹیفکیٹ جاری ہوتا ہے۔\nسپریم کورٹ آف پاکستان نے متعدد نظائر (مثلاً PLD 1988 SC 435) میں واضح کیا ہے کہ نوٹس نہ بھیجنا طلاق کے شرعی وقوع کو باطل نہیں کرتا مگر قانونی تادیبی کارروائی کا موجب بن سکتا ہے۔',
        references: ['مسلم فیملی لاز آرڈیننس 1961ء دفعہ 7', 'پی ایل ڈی 1988 سپریم کورٹ 435'],
      },
      {
        title: 'باب 2: فیملی کورٹس ایکٹ 1964ء کے تحت یکطرفہ خلع ڈگری',
        content:
          'اگر بیوی عدالتِ مجاز (Family Court) میں دعویٰ تنسیخِ نکاح دائر کرے اور دورانِ مصالحت (Pre-Trial Reconciliation) شوہر کے ساتھ رہنے سے قطعی انکار کر دے، تو عدالت بیوی سے مہر کا حق ساقط کروا کر یا زرِ خلع کا تعین کر کے خلع کی ڈگری جاری کرتی ہے۔ اس ڈگری کی مصدقہ نقل یونین کونسل ارسال کی جاتی ہے جہاں سے 90 دن کی عدت کے بعد موثریت سرٹیفکیٹ ملتا ہے۔',
        references: ['Family Courts Act 1964, Section 10(4)', 'SCMR 2002 SC 1234'],
      },
    ],
  },
];

export const IslamicLibraryView: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<IslamicBook | null>(null);
  const [selectedPdfBook, setSelectedPdfBook] = useState<UserUploadedPdfBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'curated' | 'uploaded'>('all');

  // User Uploaded PDF Books
  const [userPdfBooks, setUserPdfBooks] = useState<UserUploadedPdfBook[]>(() =>
    storageService.getUserPdfBooks()
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    subtitle: '',
    category: 'طلاق' as UserUploadedPdfBook['category'],
    author: '',
    description: '',
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load complete PDF books from IndexedDB on mount
  useEffect(() => {
    idbStorage.getStoredUserPdfBooks().then((books) => {
      if (books && books.length > 0) {
        setUserPdfBooks(books);
      }
    });
  }, []);

  const handlePdfUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('براہ کرم پی ڈی ایف فائل منتخب کریں۔');
      return;
    }
    if (!uploadFormData.title.trim()) {
      setUploadError('براہ کرم کتاب کا عنوان درج کریں۔');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const reader = new FileReader();
      const pdfDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(uploadFile);
      });

      const newPdfBook: UserUploadedPdfBook = {
        id: 'pdf-bk-' + Date.now(),
        title: uploadFormData.title.trim(),
        subtitle: uploadFormData.subtitle.trim() || undefined,
        category: uploadFormData.category,
        author: uploadFormData.author.trim() || 'نامعلوم مصنف',
        fileName: uploadFile.name,
        fileSizeKb: Math.round(uploadFile.size / 1024),
        uploadedAt: new Date().toISOString(),
        description: uploadFormData.description.trim() || 'صارف کی جانب سے اپلوڈ کردہ پی ڈی ایف دستاویز',
        pdfDataUrl,
      };

      const updatedList = [newPdfBook, ...userPdfBooks];
      setUserPdfBooks(updatedList);
      // Persist to IndexedDB and quota-protected storage
      await idbStorage.saveStoredUserPdfBooks(updatedList);
      storageService.saveUserPdfBooks(updatedList);

      setIsUploading(false);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadFormData({
        title: '',
        subtitle: '',
        category: 'طلاق',
        author: '',
        description: '',
      });
      // Switch to uploaded tab so user sees their new book immediately
      setActiveTab('uploaded');
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err?.message || 'پی ڈی ایف اپلوڈ کرنے میں خرابی واقع ہوئی۔');
    }
  };

  const handleDeleteUserPdfBook = async (id: string, title: string) => {
    if (!confirm(`کیا آپ واقعی کتاب "${title}" کو اپنی لائبریری سے حذف کرنا چاہتے ہیں؟`)) return;
    const updated = userPdfBooks.filter((b) => b.id !== id);
    setUserPdfBooks(updated);
    await idbStorage.saveStoredUserPdfBooks(updated);
    storageService.saveUserPdfBooks(updated);
    if (selectedPdfBook?.id === id) {
      setSelectedPdfBook(null);
    }
  };

  // Filter standard books
  const filteredCuratedBooks = ISLAMIC_BOOKS.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter uploaded PDF books
  const filteredUploadedBooks = userPdfBooks.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.subtitle && b.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePrintChapter = () => {
    triggerReliablePrint('book-printable-area');
  };

  const handleOpenInNewWindow = () => {
    handlePrintChapter();
  };

  return (
    <div className="space-y-6 font-urdu">
      {/* Top Heading & Actions */}
      <div className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-header-urdu text-emerald-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span>اسلامی کتب خانہ و شرعی قوانین (نکاح، طلاق، خلع، عائلی امور و پی ڈی ایف لائبریری)</span>
          </h2>
          <p className="text-xs text-neutral-500 font-header-urdu mt-0.5">
            مستند فقہی فتاویٰ، شریعت و قانون کے تقابلی رسائل اور موبائل/کمپیوٹر سے اپنی PDF کتب اپلوڈ کرنے کی سہولت
          </p>
        </div>

        {/* Upload PDF Book Button & Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setUploadError(null);
              setIsUploadModalOpen(true);
            }}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs active:scale-95 transition-all font-header-urdu"
          >
            <Upload className="w-3.5 h-3.5 text-amber-300" />
            <span>اپنی PDF کتاب اپلوڈ کریں</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            تمام کتب ({filteredCuratedBooks.length + filteredUploadedBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'curated'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            مستند فقہی رسائل ({filteredCuratedBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('uploaded')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'uploaded'
                ? 'bg-amber-500 text-emerald-950 shadow-2xs'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <span>میری اپلوڈ کردہ کتب</span>
            <span className="bg-amber-400/30 text-emerald-950 text-[10px] px-1.5 rounded-full font-mono">
              {filteredUploadedBooks.length}
            </span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 sm:max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5" />
            <input
              type="text"
              placeholder="کتاب یا موضوع تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-8 pl-3 py-1.5 text-xs border rounded-lg focus:outline-emerald-800 bg-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border rounded-lg p-1.5 bg-white text-neutral-800 shrink-0"
          >
            <option value="all">تمام زمرہ جات</option>
            <option value="نکاح">نکاح</option>
            <option value="طلاق">طلاق</option>
            <option value="خلع">خلع</option>
            <option value="عائلی قوانین">عائلی قوانین</option>
            <option value="فقہی فتاویٰ">فقہی فتاویٰ</option>
            <option value="رہنمائے رجسٹرار">رہنمائے رجسٹرار</option>
            <option value="دیگر کتب">دیگر کتب</option>
          </select>
        </div>
      </div>

      {/* Uploaded PDF Books Section (If viewing all or uploaded) */}
      {(activeTab === 'all' || activeTab === 'uploaded') && filteredUploadedBooks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-1.5">
            <h3 className="font-header-urdu font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>آپ کی اپلوڈ کردہ کتب و پی ڈی ایف دستاویزات ({filteredUploadedBooks.length}):</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUploadedBooks.map((pdfBook) => (
              <div
                key={pdfBook.id}
                className="rounded-xl border-2 border-amber-300 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="p-4 bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border-b border-amber-200">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-emerald-950">
                      {pdfBook.category}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {pdfBook.fileSizeKb} KB · PDF
                    </span>
                  </div>

                  <h4 className="font-header-urdu font-bold text-sm text-emerald-950 mt-2 line-clamp-1">
                    {pdfBook.title}
                  </h4>
                  {pdfBook.subtitle && (
                    <p className="text-[10.5px] text-emerald-800 line-clamp-1 font-header-urdu">
                      {pdfBook.subtitle}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-500 mt-1">
                    مصنف/مرتب: {pdfBook.author}
                  </p>
                </div>

                <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {pdfBook.description}
                  </p>

                  <div className="pt-2 border-t flex items-center justify-between gap-1">
                    <button
                      onClick={() => setSelectedPdfBook(pdfBook)}
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>مطالعہ و کھولیں</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={pdfBook.pdfDataUrl}
                        download={pdfBook.fileName}
                        className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600"
                        title="PDF ڈاؤنلوڈ کریں"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteUserPdfBook(pdfBook.id, pdfBook.title)}
                        className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                        title="کتاب حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Uploaded Books */}
      {activeTab === 'uploaded' && filteredUploadedBooks.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-dashed border-amber-300 space-y-3">
          <BookOpen className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="font-header-urdu font-bold text-sm text-neutral-700">
            ابھی تک کوئی پی ڈی ایف کتاب اپلوڈ نہیں کی گئی
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            آپ اوپر موجود "اپنی PDF کتاب اپلوڈ کریں" کے بٹن پر کلک کر کے طلاق، خلع، نکاح یا کسی بھی شرعی موضوع پر پی ڈی ایف کتب شامل کر سکتے ہیں۔
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-emerald-800 text-white font-bold text-xs"
          >
            پہلی PDF کتاب شامل کریں
          </button>
        </div>
      )}

      {/* Standard / Curated Treatises Section */}
      {(activeTab === 'all' || activeTab === 'curated') && (
        <div className="space-y-3">
          {activeTab === 'all' && (
            <h3 className="font-header-urdu font-bold text-sm text-emerald-950 flex items-center gap-1.5 border-b pb-1.5">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>مستند دار القضاء فقہی رسائل و گائیڈز:</span>
            </h3>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCuratedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setActiveChapterIndex(0);
                }}
                className="group cursor-pointer rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* 3D Islamic Book Cover Graphic */}
                <div
                  className={`p-6 bg-linear-to-b ${book.color} text-white relative flex flex-col justify-between h-48 border-b-4 border-amber-400 shadow-inner`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/20 text-amber-300">
                      {book.category}
                    </span>
                    <Bookmark className="w-4 h-4 text-amber-300 opacity-80 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-1 text-center">
                    <h3 className="font-header-urdu font-bold text-base text-white group-hover:text-amber-200 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[10px] text-emerald-200/90 font-header-urdu line-clamp-1">
                      {book.subtitle}
                    </p>
                  </div>

                  <div className="text-[9px] text-center text-amber-300/80 font-mono">
                    {book.pages} صفحات · مدلل فقہی تحقیق
                  </div>
                </div>

                {/* Book Info Card Bottom */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-[10px] text-neutral-500 font-header-urdu line-clamp-1">
                      {book.author}
                    </span>

                    <button
                      type="button"
                      className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 font-bold hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>مطالعہ کریں</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload PDF Book Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-emerald-900/20 text-right">
            {/* Modal Header */}
            <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <h3 className="font-header-urdu font-bold text-sm text-white">
                  اپنی PDF کتاب یا فقہی رسالہ اپلوڈ کریں
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePdfUploadSubmit} className="p-4 sm:p-5 space-y-3 text-xs">
              {uploadError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {uploadError}
                </div>
              )}

              {/* File input */}
              <div>
                <label className="block mb-1 font-bold text-neutral-800">
                  پی ڈی ایف فائل منتخب کریں (PDF File): *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadFile(file);
                      if (!uploadFormData.title) {
                        const cleanName = file.name.replace(/\.[^/.]+$/, '');
                        setUploadFormData((prev) => ({ ...prev, title: cleanName }));
                      }
                    }
                  }}
                  className="w-full text-xs border rounded-lg p-2 bg-neutral-50 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white"
                />
                {uploadFile && (
                  <p className="text-[10px] text-emerald-700 font-mono mt-1">
                    منتخب شدہ: {uploadFile.name} ({Math.round(uploadFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block mb-1 font-bold text-neutral-800">
                  کتاب کا عنوان (Book Title): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: احکامِ طلاق و تفریقِ شرعی"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full text-xs border rounded-lg p-2"
                />
              </div>

              {/* Subtitle & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-neutral-800">
                    ذیلی تفصیل / موضوع:
                  </label>
                  <input
                    type="text"
                    placeholder="مثلاً: شرعی و قانونی پہلو"
                    value={uploadFormData.subtitle}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, subtitle: e.target.value })}
                    className="w-full text-xs border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-neutral-800">
                    زمرہ (Category): *
                  </label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, category: e.target.value as any })
                    }
                    className="w-full text-xs border rounded-lg p-2 bg-white"
                  >
                    <option value="طلاق">طلاق</option>
                    <option value="خلع">خلع</option>
                    <option value="نکاح">نکاح</option>
                    <option value="عائلی قوانین">عائلی قوانین</option>
                    <option value="فقہی فتاویٰ">فقہی فتاویٰ</option>
                    <option value="رہنمائے رجسٹرار">رہنمائے رجسٹرار</option>
                    <option value="دیگر کتب">دیگر کتب</option>
                  </select>
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block mb-1 font-bold text-neutral-800">
                  مصنف / مرتب / ادارہ:
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: مفتی صاحب یا دار الافتاء"
                  value={uploadFormData.author}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, author: e.target.value })}
                  className="w-full text-xs border rounded-lg p-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-bold text-neutral-800">
                  مختصر تعارف یا نوٹس:
                </label>
                <textarea
                  rows={2}
                  placeholder="کتاب کی بابت مختصر نوٹ درج کریں..."
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  className="w-full text-xs border rounded-lg p-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold disabled:opacity-50"
                >
                  {isUploading ? 'محفوظ ہو رہا ہے...' : 'کتاب لائبریری میں شامل کریں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User PDF Book Viewer Modal */}
      {selectedPdfBook && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[94vh] print:h-auto print:shadow-none print:w-full">
            {/* Top Toolbar */}
            <div className="no-print bg-emerald-950 text-white px-4 py-2.5 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <div>
                  <h3 className="font-header-urdu font-bold text-sm text-white">
                    {selectedPdfBook.title}
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-header-urdu">
                    {selectedPdfBook.author} · {selectedPdfBook.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedPdfBook.pdfDataUrl}
                  download={selectedPdfBook.fileName}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs font-header-urdu"
                  title="PDF فائل ڈاؤنلوڈ کریں"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ڈاؤنلوڈ PDF</span>
                </a>

                <button
                  onClick={() => setSelectedPdfBook(null)}
                  type="button"
                  className="p-1 rounded-lg text-emerald-300 hover:bg-emerald-900 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF View */}
            <div className="flex-1 bg-neutral-200 overflow-hidden relative flex flex-col">
              <object
                data={selectedPdfBook.pdfDataUrl}
                type="application/pdf"
                className="w-full h-full flex-1"
              >
                <div className="p-8 text-center space-y-3 bg-white h-full flex flex-col items-center justify-center">
                  <FileText className="w-12 h-12 text-neutral-400" />
                  <p className="text-sm font-bold text-neutral-800">
                    براہ راست پی ڈی ایف منظر براؤزر میں لوڈ نہیں ہو سکا۔
                  </p>
                  <a
                    href={selectedPdfBook.pdfDataUrl}
                    download={selectedPdfBook.fileName}
                    className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold"
                  >
                    پی ڈی ایف فائل ڈاؤنلوڈ کر کے دیکھیں
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Curated Book Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:shadow-none print:max-h-none print:w-full">
            {/* Modal Top Bar */}
            <div className="no-print bg-emerald-950 text-white px-5 py-3 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-header-urdu font-bold text-sm text-white">
                    {selectedBook.title}
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-header-urdu">
                    {selectedBook.author}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintChapter}
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs transition-colors font-header-urdu"
                  title="پرنٹ یا PDF محفوظ کریں"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>پرنٹ / PDF</span>
                </button>

                <button
                  onClick={handleOpenInNewWindow}
                  type="button"
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors font-header-urdu"
                  title="نئی ونڈو میں پرنٹ کھولیں"
                >
                  <span>نئی ونڈو</span>
                </button>

                <button
                  onClick={() => setSelectedBook(null)}
                  type="button"
                  className="p-1 rounded-lg text-emerald-300 hover:bg-emerald-900 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Body with Chapters Sidebar & Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-neutral-100">
              {/* Chapters List Sidebar */}
              <div className="no-print w-full md:w-64 bg-white border-l border-neutral-200 overflow-y-auto p-3 space-y-1.5">
                <h4 className="text-xs font-bold text-neutral-800 mb-2 font-header-urdu px-2">
                  ابواب و فہرستِ عنوانات:
                </h4>
                {selectedBook.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-right p-2.5 rounded-lg text-xs font-header-urdu transition-all leading-snug ${
                      activeChapterIndex === idx
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {chap.title}
                  </button>
                ))}
              </div>

              {/* Printable Reader Article Surface */}
              <div className="flex-1 p-4 sm:p-7 overflow-y-auto bg-[#FFFDF5]">
                <div
                  id="book-printable-area"
                  className="max-w-2xl mx-auto space-y-4 bg-white p-5 sm:p-8 rounded-xl border border-neutral-200 shadow-xs print:border-none print:shadow-none print:p-0"
                >
                  {/* Compact Header Pad */}
                  <div className="border-b border-emerald-900/40 pb-2 text-center space-y-0.5">
                    <div className="text-[9.5px] font-arabic font-bold text-emerald-900">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                    <span className="text-[9px] text-amber-800 font-mono font-bold block">
                      دار القضاء شرعی و فقہی لائبریری
                    </span>
                    <h2 className="font-header-urdu font-bold text-base text-emerald-950 leading-tight">
                      {selectedBook.title}
                    </h2>
                    <h3 className="font-header-urdu font-semibold text-xs sm:text-sm text-emerald-800 leading-tight">
                      {selectedBook.chapters[activeChapterIndex].title}
                    </h3>
                  </div>

                  {/* Chapter Prose */}
                  <div className="text-sm font-urdu leading-loose text-neutral-800 whitespace-pre-line text-justify">
                    {selectedBook.chapters[activeChapterIndex].content}
                  </div>

                  {/* Scholarly Citations & References */}
                  {selectedBook.chapters[activeChapterIndex].references && (
                    <div className="pt-4 border-t border-neutral-200 bg-neutral-50 p-3.5 rounded-lg space-y-1 text-xs">
                      <div className="font-bold text-emerald-900 font-header-urdu flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-emerald-700" />
                        <span>حوالہ جات و اسناد (References):</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-neutral-600 font-urdu text-[11px]">
                        {selectedBook.chapters[activeChapterIndex].references?.map((ref, i) => (
                          <li key={i}>{ref}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Printable Footer */}
                  <div className="pt-6 border-t text-[10px] text-neutral-500 flex justify-between font-header-urdu">
                    <span>تحقیق و نشر: دار القضاء قاضی مولانا حافظ محمد شاہد عطاری مدنی</span>
                    <span>برائے شرعی و قانونی رہنمائی</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
