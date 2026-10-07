import React, { useState } from 'react';
import {
  LayoutDashboard,
  HeartHandshake,
  Users,
  Coins,
  FileSpreadsheet,
  FileText,
  Stamp,
  Receipt,
  BarChart3,
  Settings,
  DatabaseBackup,
  History,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Search,
  Scale,
  FileCheck2,
  FileSignature,
  FileX,
  PlusCircle,
  FileWarning,
  BookOpen,
  Download,
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  user: User;
  counts: {
    nikahs: number;
    talaqs: number;
    khulas: number;
    affidavits: number;
    stamps: number;
    documents: number;
    fees: number;
  };
  onOpenInstallModal?: () => void;
}

interface NavSection {
  id: string;
  titleUrdu: string;
  titleEn: string;
  icon: React.ElementType;
  countKey?: keyof SidebarProps['counts'];
  subItems?: {
    id: string;
    titleUrdu: string;
    titleEn: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  user,
  counts,
  onOpenInstallModal,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nikah: true,
    haqmehr: true,
    talaq_khula: false,
    documents: false,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const navItems: NavSection[] = [
    {
      id: 'dashboard',
      titleUrdu: 'ڈیش بورڈ',
      titleEn: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'nikah',
      titleUrdu: 'نکاح مینجمنٹ',
      titleEn: 'Nikah Management',
      icon: HeartHandshake,
      countKey: 'nikahs',
      subItems: [
        { id: 'nikah_register', titleUrdu: 'نکاح رجسٹر', titleEn: 'Nikah Register' },
        { id: 'official_nikah_form', titleUrdu: 'اصلی فارم دوم (25 کالم)', titleEn: 'Official Form II (25 Col)' },
        { id: 'khutbah_nikah', titleUrdu: 'خطبہ نکاح مسنونہ', titleEn: 'Sunnah Khutbah Nikah' },
        { id: 'nikah_new', titleUrdu: 'نیا نکاح اندراج', titleEn: 'New Nikah' },
        { id: 'nikah_search', titleUrdu: 'تلاش نکاح', titleEn: 'Search Nikah' },
      ],
    },
    {
      id: 'parties',
      titleUrdu: 'فریقین و گواہان',
      titleEn: 'Parties & Witnesses',
      icon: Users,
      subItems: [
        { id: 'grooms_directory', titleUrdu: 'دولہا ریکارڈ', titleEn: 'Grooms' },
        { id: 'brides_directory', titleUrdu: 'دلہن ریکارڈ', titleEn: 'Brides' },
        { id: 'witnesses_directory', titleUrdu: 'گواہان ریکارڈ', titleEn: 'Witnesses' },
        { id: 'wakeels_directory', titleUrdu: 'وکلاء و نمائندگان', titleEn: 'Representatives' },
      ],
    },
    {
      id: 'haqmehr',
      titleUrdu: 'حق مہر و کیلکولیٹر',
      titleEn: 'Haq Mehr & Rates',
      icon: Coins,
      subItems: [
        { id: 'mehr_calculator', titleUrdu: 'لائیو مہر Calculator', titleEn: 'Live Mehr Calculator' },
        { id: 'mehr_records', titleUrdu: 'حق مہر رجسٹر', titleEn: 'Mehr Register' },
        { id: 'mehr_pending', titleUrdu: 'بقایا جات مہر', titleEn: 'Pending Mehr' },
      ],
    },
    {
      id: 'talaq_khula',
      titleUrdu: 'طلاق و خلع ریکارڈ',
      titleEn: 'Talaq & Khula',
      icon: Scale,
      subItems: [
        { id: 'talaq_module', titleUrdu: 'طلاق رجسٹر و نوٹسز', titleEn: 'Talaq Records' },
        { id: 'khula_module', titleUrdu: 'خلع و عدالتی ڈگریاں', titleEn: 'Khula Records' },
      ],
    },
    {
      id: 'islamic_library',
      titleUrdu: 'اسلامی کتب خانہ (کتب طلاق، خلع)',
      titleEn: 'Islamic Law Library',
      icon: BookOpen,
    },
    {
      id: 'documents',
      titleUrdu: 'قانونی دستاویزات',
      titleEn: 'Legal Documents',
      icon: FileText,
      countKey: 'documents',
      subItems: [
        { id: 'affidavit_module', titleUrdu: 'حلفی بیانات (Affidavits)', titleEn: 'Affidavits' },
        { id: 'stamp_module', titleUrdu: 'اسٹام پیپر رجسٹر', titleEn: 'Stamp Papers' },
        { id: 'agreements_module', titleUrdu: 'اقرار نامہ و وکالت نامہ', titleEn: 'Agreements' },
        { id: 'all_documents', titleUrdu: 'کل Documents', titleEn: 'All Documents' },
      ],
    },
    {
      id: 'seals_signatures',
      titleUrdu: 'مہریں و دستخط',
      titleEn: 'Seals & Signatures',
      icon: Stamp,
    },
    {
      id: 'fees_receipts',
      titleUrdu: 'فیس و رسیدیں',
      titleEn: 'Fees & Receipts',
      icon: Receipt,
      countKey: 'fees',
    },
    {
      id: 'reports',
      titleUrdu: 'رپورٹس و تجزیات',
      titleEn: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      id: 'audit_logs',
      titleUrdu: 'آڈٹ ٹریل لاگ',
      titleEn: 'Audit Trail',
      icon: History,
    },
    {
      id: 'backup_export',
      titleUrdu: 'بیک اپ و ایکسپورٹ',
      titleEn: 'Backup & Export',
      icon: DatabaseBackup,
    },
    {
      id: 'settings',
      titleUrdu: 'دفتری ترتیبات',
      titleEn: 'Office Settings',
      icon: Settings,
    },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-emerald-950/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-64 bg-emerald-950 text-emerald-50 flex flex-col transition-all duration-300 shadow-lg lg:static lg:z-10 no-print border-l border-emerald-900/40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-emerald-800/50 bg-emerald-900/30 flex items-center justify-between">
          <div className="flex flex-col text-right w-full">
            <span className="font-urdu font-bold text-xs text-amber-300">
              قاضی آفس مانیٹرنگ سسٹم
            </span>
            <span className="text-[11px] text-emerald-300/80 font-urdu">
              {user.name.split(' ')[0]} ({user.role})
            </span>
          </div>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasSub = item.subItems && item.subItems.length > 0;
            const isExpanded = !!expandedSections[item.id];
            const isDirectActive = currentView === item.id;
            const isSubActive = item.subItems?.some((sub) => sub.id === currentView);
            const isActive = isDirectActive || isSubActive;

            return (
              <div key={item.id} className="space-y-0.5">
                {hasSub ? (
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-amber-300 shadow-xs'
                        : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                      <span className="font-urdu text-xs font-semibold">{item.titleUrdu}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {item.countKey && counts[item.countKey] !== undefined && (
                        <span className="text-[9.5px] tabular-nums font-mono px-1 py-0.2 rounded bg-emerald-900/90 text-emerald-200">
                          {counts[item.countKey]}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-amber-300' : 'text-emerald-400'
                        }`}
                      />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isDirectActive
                        ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                        : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isDirectActive ? 'text-emerald-950' : 'text-emerald-400'}`} />
                      <span className="font-urdu text-xs">{item.titleUrdu}</span>
                    </div>

                    {item.countKey && counts[item.countKey] !== undefined && (
                      <span
                        className={`text-[9.5px] tabular-nums font-mono px-1 py-0.2 rounded ${
                          isDirectActive
                            ? 'bg-emerald-950 text-amber-300'
                            : 'bg-emerald-900/90 text-emerald-200'
                        }`}
                      >
                        {counts[item.countKey]}
                      </span>
                    )}
                  </button>
                )}

                {/* Sub items dropdown */}
                {hasSub && isExpanded && (
                  <div className="mr-5 pr-2.5 space-y-1 border-r-2 border-emerald-800/70 pt-1">
                    {item.subItems?.map((sub) => {
                      const isSubCurrent = currentView === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleItemClick(sub.id)}
                          className={`w-full text-right px-2.5 py-1.5 rounded-md text-xs font-urdu transition-colors ${
                            isSubCurrent
                              ? 'bg-amber-400/90 text-emerald-950 font-bold'
                              : 'text-emerald-200/90 hover:bg-emerald-900/50 hover:text-white'
                          }`}
                        >
                          {sub.titleUrdu}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Offline App Install Action in Sidebar */}
        <div className="px-3 py-2 border-t border-emerald-800/60 bg-emerald-900/40">
          <button
            onClick={() => {
              if (onOpenInstallModal) onOpenInstallModal();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-urdu flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>📱 آف لائن ایپ انسٹال کریں</span>
          </button>
        </div>

        {/* Office Official Notice / Disclaimer badge at bottom */}
        <div className="p-3 bg-emerald-900/80 border-t border-emerald-800/70 text-[11px] text-emerald-200 font-urdu leading-relaxed">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>محفوظ دفتری ریکارڈ سسٹم</span>
          </div>
          <p className="opacity-90">
            غیر مجاز رسائی ممنوع ہے۔ تمام کارروائیوں کا آڈٹ لاگ محفوظ ہوتا ہے۔
          </p>
        </div>
      </aside>
    </>
  );
};
