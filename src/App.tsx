import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { NikahRegisterView } from './components/nikah/NikahRegisterView';
import { NikahFormModal } from './components/nikah/NikahFormModal';
import { PersonDirectoryView } from './components/persons/PersonDirectoryView';
import { HaqMehrModuleView } from './components/haqmehr/HaqMehrModuleView';
import { TalaqModuleView } from './components/talaq/TalaqModuleView';
import { KhulaModuleView } from './components/khula/KhulaModuleView';
import { AffidavitModuleView } from './components/affidavit/AffidavitModuleView';
import { StampPaperView } from './components/stamp/StampPaperView';
import { LegalDocumentsView } from './components/documents/LegalDocumentsView';
import { SealSignatureView } from './components/seals/SealSignatureView';
import { FeesReceiptsView } from './components/fees/FeesReceiptsView';
import { GlobalSearchView } from './components/search/GlobalSearchView';
import { ReportsView } from './components/reports/ReportsView';
import { PublicWebsiteView } from './components/public/PublicWebsiteView';
import { BackupExportView } from './components/backup/BackupExportView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SettingsView } from './components/settings/SettingsView';
import { OfficialNikahNamaFormView } from './components/nikah/OfficialNikahNamaFormView';
import { KhutbahNikahView } from './components/nikah/KhutbahNikahView';
import { IslamicLibraryView } from './components/library/IslamicLibraryView';
import { PrintDocumentModal, PrintableDocumentType } from './components/common/PrintDocumentModal';
import { TypographyProvider } from './context/TypographyContext';
import { TypographyControlModal } from './components/common/TypographyControlModal';
import { OfflineStatusBadge } from './components/common/OfflineStatusBadge';
import { InstallAppModal } from './components/common/InstallAppModal';
import { NikahRecord, OfficeSettings, User } from './types';
import { storageService } from './services/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => storageService.getUser());
  const [settings, setSettings] = useState<OfficeSettings>(() => storageService.getSettings());
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isPublicMode, setIsPublicMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'ur' | 'en'>('ur');

  // Modals state
  const [isNikahFormOpen, setIsNikahFormOpen] = useState(false);
  const [editingNikah, setEditingNikah] = useState<NikahRecord | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    docType: PrintableDocumentType;
    record: any;
  }>({
    isOpen: false,
    docType: 'nikah',
    record: null,
  });

  // Cached records for badge counts
  const [recordsCount, setRecordsCount] = useState({
    nikahs: 0,
    talaqs: 0,
    khulas: 0,
    affidavits: 0,
    stamps: 0,
    documents: 0,
    fees: 0,
  });

  const [nikahsList, setNikahsList] = useState<NikahRecord[]>([]);

  const reloadData = () => {
    const nikahs = storageService.getNikahs();
    const talaqs = storageService.getTalaqRecords();
    const khulas = storageService.getKhulaRecords();
    const affidavits = storageService.getAffidavits();
    const stamps = storageService.getStamps();
    const documents = storageService.getDocuments();
    const fees = storageService.getFees();

    setNikahsList(nikahs);
    setRecordsCount({
      nikahs: nikahs.length,
      talaqs: talaqs.length,
      khulas: khulas.length,
      affidavits: affidavits.length,
      stamps: stamps.length,
      documents: documents.length,
      fees: fees.length,
    });
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Update HTML direction when language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    storageService.saveUser(user);
  };

  const handleOpenPrint = (docType: PrintableDocumentType, record: any) => {
    setPrintModalState({
      isOpen: true,
      docType,
      record,
    });
  };

  const handleNikahSaved = (record: NikahRecord) => {
    const list = storageService.getNikahs();
    const exists = list.some((n) => n.id === record.id);
    let updated: NikahRecord[];
    if (exists) {
      updated = list.map((n) => (n.id === record.id ? record : n));
      storageService.logAction('UPDATE', 'NIKAH', record.id, `نکاح نامہ ترمیم: ${record.registrationNo}`, currentUser);
    } else {
      updated = [record, ...list];
      storageService.logAction('CREATE', 'NIKAH', record.id, `نیا نکاح رجسٹرڈ: ${record.registrationNo} (${record.groom.fullName})`, currentUser);
    }
    storageService.saveNikahs(updated);
    reloadData();
  };

  const renderMainContent = () => {
    if (isPublicMode) {
      return (
        <PublicWebsiteView
          settings={settings}
          onNavigateToOfficePortal={() => setIsPublicMode(false)}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(v) => setCurrentView(v)}
            onOpenQuickNikah={() => {
              setEditingNikah(null);
              setIsNikahFormOpen(true);
            }}
            user={currentUser}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );

      case 'nikah_register':
        return (
          <NikahRegisterView
            records={nikahsList}
            onRefresh={reloadData}
            onOpenNew={() => {
              setEditingNikah(null);
              setIsNikahFormOpen(true);
            }}
            onEdit={(rec) => {
              setEditingNikah(rec);
              setIsNikahFormOpen(true);
            }}
            onOpenPrint={(rec) => handleOpenPrint('nikah', rec)}
            onOpenOfficialForm25={() => setCurrentView('official_nikah_form')}
            onNavigate={(v) => setCurrentView(v)}
            user={currentUser}
          />
        );

      case 'official_nikah_form':
        return (
          <OfficialNikahNamaFormView
            onBack={() => setCurrentView('nikah_register')}
          />
        );

      case 'khutbah_nikah':
        return (
          <KhutbahNikahView
            onBack={() => setCurrentView('nikah_register')}
          />
        );

      case 'islamic_library':
        return <IslamicLibraryView />;

      case 'nikah_new':
        return (
          <div className="space-y-4">
            <NikahRegisterView
              records={nikahsList}
              onRefresh={reloadData}
              onOpenNew={() => {
                setEditingNikah(null);
                setIsNikahFormOpen(true);
              }}
              onEdit={(rec) => {
                setEditingNikah(rec);
                setIsNikahFormOpen(true);
              }}
              onOpenPrint={(rec) => handleOpenPrint('nikah', rec)}
              onOpenOfficialForm25={() => setCurrentView('official_nikah_form')}
              onNavigate={(v) => setCurrentView(v)}
              user={currentUser}
            />
          </div>
        );

      case 'nikah_search':
        return <GlobalSearchView onSelectNikah={() => setCurrentView('nikah_register')} />;

      case 'grooms_directory':
        return <PersonDirectoryView records={nikahsList} type="grooms" />;

      case 'brides_directory':
        return <PersonDirectoryView records={nikahsList} type="brides" />;

      case 'witnesses_directory':
        return <PersonDirectoryView records={nikahsList} type="witnesses" />;

      case 'wakeels_directory':
        return <PersonDirectoryView records={nikahsList} type="wakeels" />;

      case 'mehr_calculator':
        return (
          <HaqMehrModuleView
            user={currentUser}
            onOpenPrint={handleOpenPrint}
            activeTab="calculator"
          />
        );

      case 'mehr_records':
        return (
          <HaqMehrModuleView
            user={currentUser}
            onOpenPrint={handleOpenPrint}
            activeTab="records"
          />
        );

      case 'mehr_pending':
        return (
          <HaqMehrModuleView
            user={currentUser}
            onOpenPrint={handleOpenPrint}
            activeTab="pending"
          />
        );

      case 'talaq_module':
        return (
          <TalaqModuleView
            user={currentUser}
            onOpenPrint={(rec) => handleOpenPrint('talaq', rec)}
          />
        );

      case 'khula_module':
        return (
          <KhulaModuleView
            user={currentUser}
            onOpenPrint={(rec) => handleOpenPrint('khula', rec)}
          />
        );

      case 'affidavit_module':
        return (
          <AffidavitModuleView
            user={currentUser}
            onOpenPrint={(rec) => handleOpenPrint('affidavit', rec)}
          />
        );

      case 'stamp_module':
        return <StampPaperView user={currentUser} />;

      case 'agreements_module':
      case 'all_documents':
        return <LegalDocumentsView user={currentUser} />;

      case 'seals_signatures':
        return <SealSignatureView user={currentUser} />;

      case 'fees_receipts':
        return (
          <FeesReceiptsView
            user={currentUser}
            onOpenPrint={(rec) => handleOpenPrint('fee_receipt', rec)}
            onNavigate={(v) => setCurrentView(v)}
          />
        );

      case 'reports':
        return <ReportsView />;

      case 'audit_logs':
        return <AuditLogsView />;

      case 'backup_export':
        return <BackupExportView user={currentUser} onRefreshData={reloadData} />;

      case 'settings':
        return (
          <SettingsView
            user={currentUser}
            onSettingsUpdated={(updated) => setSettings(updated)}
          />
        );

      default:
        return (
          <DashboardView
            onNavigate={(v) => setCurrentView(v)}
            onOpenQuickNikah={() => {
              setEditingNikah(null);
              setIsNikahFormOpen(true);
            }}
            user={currentUser}
          />
        );
    }
  };

  return (
    <TypographyProvider>
      <div className="min-h-screen bg-[#FFFDF5] text-neutral-900 flex flex-col antialiased selection:bg-emerald-800 selection:text-white">
        {/* Top Header */}
        <Header
          user={currentUser}
          onUserChange={handleUserChange}
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'public') {
              setIsPublicMode(true);
            } else {
              setIsPublicMode(false);
              setCurrentView(view);
            }
          }}
          isPublicMode={isPublicMode}
          onTogglePublicMode={() => setIsPublicMode(!isPublicMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenQuickNikah={() => {
            setEditingNikah(null);
            setIsNikahFormOpen(true);
          }}
          onOpenGlobalSearch={() => setCurrentView('nikah_search')}
          lang={lang}
          onToggleLang={() => setLang(lang === 'ur' ? 'en' : 'ur')}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />

        <OfflineStatusBadge />

        {/* Main Layout Area */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Sidebar Navigation (Hidden in public mode) */}
          {!isPublicMode && (
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                if (view === 'nikah_new') {
                  setEditingNikah(null);
                  setIsNikahFormOpen(true);
                } else {
                  setCurrentView(view);
                }
              }}
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              user={currentUser}
              counts={recordsCount}
              onOpenInstallModal={() => setIsInstallModalOpen(true)}
            />
          )}

          {/* Dynamic Viewport Container */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
            {renderMainContent()}
          </main>
        </div>

        {/* Global Modals */}
        {isNikahFormOpen && (
          <NikahFormModal
            isOpen={isNikahFormOpen}
            onClose={() => setIsNikahFormOpen(false)}
            onSaved={handleNikahSaved}
            editRecord={editingNikah}
            currentUser={currentUser}
          />
        )}

        {printModalState.isOpen && (
          <PrintDocumentModal
            isOpen={printModalState.isOpen}
            onClose={() => setPrintModalState({ ...printModalState, isOpen: false })}
            docType={printModalState.docType}
            record={printModalState.record}
            settings={settings}
          />
        )}

        {/* Offline App Installation Modal */}
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Typography Control Center Modal */}
        <TypographyControlModal />
      </div>
    </TypographyProvider>
  );
}
