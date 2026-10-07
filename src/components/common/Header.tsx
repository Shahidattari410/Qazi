import React from 'react';
import {
  Menu,
  Search,
  PlusCircle,
  Globe,
  Shield,
  UserCheck,
  Building2,
  FileText,
  Printer,
  Bell,
  Type,
  Wifi,
  WifiOff,
  Download,
} from 'lucide-react';
import { Emblem } from './Emblem';
import { User, UserRole } from '../../types';
import { useTypography } from '../../context/TypographyContext';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

interface HeaderProps {
  user: User;
  onUserChange: (user: User) => void;
  currentView: string;
  onNavigate: (view: string) => void;
  isPublicMode: boolean;
  onTogglePublicMode: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenQuickNikah: () => void;
  onOpenGlobalSearch: () => void;
  lang: 'ur' | 'en';
  onToggleLang: () => void;
  onOpenInstallModal?: () => void;
}

const ROLES: UserRole[] = [
  'Super Admin',
  'Qazi',
  'Registrar',
  'Assistant',
  'Accountant',
  'Document Manager',
];

export const Header: React.FC<HeaderProps> = ({
  user,
  onUserChange,
  currentView,
  onNavigate,
  isPublicMode,
  onTogglePublicMode,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onOpenQuickNikah,
  onOpenGlobalSearch,
  lang,
  onToggleLang,
  onOpenInstallModal,
}) => {
  const { setIsTypographyModalOpen } = useTypography();
  const { isOnline, canInstall, triggerInstall, isInstalled } = useOfflineStatus();

  const handleInstallClick = async () => {
    if (canInstall) {
      const installed = await triggerInstall();
      if (!installed && onOpenInstallModal) {
        onOpenInstallModal();
      }
    } else if (onOpenInstallModal) {
      onOpenInstallModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/15 shadow-2xs transition-all no-print">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2">
        {/* Left/Right Brand Zone (Compact & Graceful Nastaleeq) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle Navigation"
            className="lg:hidden p-1 rounded text-emerald-950 hover:bg-emerald-50 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div
            onClick={() => onNavigate(isPublicMode ? 'public' : 'dashboard')}
            className="flex items-center gap-1.5 cursor-pointer group select-none"
          >
            <Emblem size={28} />
            <div className="flex flex-col text-right justify-center">
              <h1 className="font-header-urdu font-bold text-xs sm:text-sm text-emerald-950 tracking-normal leading-tight group-hover:text-emerald-800 transition-colors">
                مولانا قاضی حافظ محمد شاہد عطاری مدنی
              </h1>
              <p className="text-[9.5px] sm:text-[10px] font-medium text-emerald-700 font-header-urdu leading-none">
                نکاح خواں (رجسٹرار) · دار القضاء و شرعی ریکارڈ کونسل
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation Switcher - Compact Size */}
        <div className="flex items-center gap-1 sm:gap-1.5 font-urdu">
          {/* Prominent Offline App Install Button - Always Visible */}
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs transition-all active:scale-95 border border-emerald-700 font-header-urdu"
            title="ایپ کو ڈیسک ٹاپ یا موبائل کی ہوم اسکرین پر انسٹال کریں تاکہ بغیر انٹرنیٹ ایک کلک پر چلے"
          >
            <Download className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="inline">📱 ایپ انسٹال</span>
          </button>

          {/* Offline / Online Status Badge */}
          <div
            onClick={handleInstallClick}
            className={`cursor-pointer hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
            }`}
            title="سسٹم انٹرنیٹ کے بغیر 100% مکمل فعال ہے (کلک کر کے انسٹالیشن طریقہ دیکھیں)"
          >
            {isOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>آف لائن ریڈی</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-700" />
                <span>آف لائن موڈ</span>
              </>
            )}
          </div>

          {/* Quick Search */}
          <button
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 text-xs font-medium transition-colors font-header-urdu"
            title="تلاش کریں (Ctrl+K)"
          >
            <Search className="w-3 h-3 text-neutral-500" />
            <span className="hidden lg:inline">ریکارڈ تلاش</span>
          </button>

          {/* Typography Control Center Button */}
          <button
            onClick={() => setIsTypographyModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100/80 text-emerald-950 border border-amber-300 text-xs font-bold shadow-2xs hover:shadow transition-all font-header-urdu active:scale-95"
            title="فونٹ تبدیل کریں، سائز چھوٹا بڑا کریں، اور موبائل سے فونٹ اپلوڈ کریں"
          >
            <Type className="w-3 h-3 text-amber-700" />
            <span>فونٹ</span>
          </button>

          {/* Quick New Nikah Button (only in Office Mode) */}
          {!isPublicMode && (
            <button
              onClick={onOpenQuickNikah}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs hover:shadow transition-all font-header-urdu"
            >
              <PlusCircle className="w-3 h-3 text-amber-300" />
              <span>نیا نکاح</span>
            </button>
          )}

          {/* Portal Switcher (Public Website vs Office Management) */}
          <button
            onClick={onTogglePublicMode}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-colors font-header-urdu ${
              isPublicMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 hover:bg-amber-500/20'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            {isPublicMode ? (
              <>
                <Shield className="w-3 h-3 text-amber-700" />
                <span>دفتری پورٹل</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3 text-emerald-700" />
                <span>عوامی پورٹل</span>
              </>
            )}
          </button>

          {/* Role selector */}
          {!isPublicMode && (
            <div className="hidden xl:flex items-center gap-1 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
              <UserCheck className="w-2.5 h-2.5 text-neutral-500" />
              <select
                value={user.role}
                onChange={(e) => onUserChange({ ...user, role: e.target.value as UserRole })}
                className="bg-transparent text-[10px] font-medium text-neutral-700 focus:outline-none cursor-pointer"
                title="کردار تبدیل کریں (Role Switcher)"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-1.5 py-1 text-xs font-bold rounded border border-neutral-200 hover:bg-neutral-100 text-neutral-700"
            title="تبدیل زبان"
          >
            {lang === 'ur' ? 'EN' : 'اردو'}
          </button>
        </div>
      </div>
    </header>
  );
};
