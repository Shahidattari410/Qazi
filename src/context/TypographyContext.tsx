import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomFontItem, TypographySettings } from '../types';
import { DEFAULT_TYPOGRAPHY_SETTINGS, storageService } from '../services/storage';
import { idbStorage } from '../services/idbStorage';

interface TypographyContextType {
  typographySettings: TypographySettings;
  updateTypographySettings: (settings: Partial<TypographySettings>) => void;
  resetTypography: () => void;
  customFonts: CustomFontItem[];
  addCustomFont: (file: File, customName?: string) => Promise<{ success: boolean; fontName?: string; error?: string }>;
  removeCustomFont: (id: string) => void;
  isTypographyModalOpen: boolean;
  setIsTypographyModalOpen: (open: boolean) => void;
  availableFontFamilies: { id: string; labelUrdu: string; labelEn: string; isCustom?: boolean }[];
}

const TypographyContext = createContext<TypographyContextType | undefined>(undefined);

const PRESET_FONTS = [
  { id: 'Jameel Noori Nastaleeq', labelUrdu: 'جمیل نوری نستعلیق (ڈیفالٹ)', labelEn: 'Jameel Noori Nastaleeq' },
  { id: 'Noto Nastaliq Urdu', labelUrdu: 'نوٹو نستعلیق اردو', labelEn: 'Noto Nastaliq Urdu' },
  { id: 'Gulzar', labelUrdu: 'گلزار خط (نستعلیق)', labelEn: 'Gulzar Nastaliq' },
  { id: 'Amiri', labelUrdu: 'امیری (خطِ نسخ / عربی)', labelEn: 'Amiri Naskh' },
];

export const TypographyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [typographySettings, setTypographySettings] = useState<TypographySettings>(() =>
    storageService.getTypographySettings()
  );
  const [customFonts, setCustomFonts] = useState<CustomFontItem[]>(() =>
    storageService.getCustomFonts()
  );
  const [isTypographyModalOpen, setIsTypographyModalOpen] = useState<boolean>(false);

  // Apply typography variables to documentElement and inject root style tag
  const applySettingsToDOM = (settings: TypographySettings) => {
    const root = document.documentElement;
    const fontStack = `"${settings.primaryFont}", 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', 'Amiri', serif`;
    root.style.setProperty('--app-font-family', fontStack);
    root.style.setProperty('--app-font-scale', `${settings.fontScale}%`);
    root.style.setProperty('--app-font-scale-num', `${settings.fontScale / 100}`);
    root.style.setProperty('--letterhead-scale', `${settings.letterheadScale}%`);
    root.style.setProperty('--receipt-font-scale', `${settings.receiptFontScale}%`);
    root.style.setProperty('--app-line-height', `${settings.lineHeightScale}`);
    root.style.fontSize = `${settings.fontScale}%`;

    // Inject or update global root style tag for complete, global real-time enforcement
    let styleTag = document.getElementById('global-typography-injector') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'global-typography-injector';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
      :root {
        --app-font-family: ${fontStack};
        --app-font-scale: ${settings.fontScale}%;
        --app-font-scale-num: ${settings.fontScale / 100};
        --letterhead-scale: ${settings.letterheadScale}%;
        --receipt-font-scale: ${settings.receiptFontScale}%;
        --app-line-height: ${settings.lineHeightScale};
      }
      html {
        font-size: ${settings.fontScale}% !important;
      }
      body, [dir="rtl"], #root {
        font-family: ${fontStack} !important;
      }
      .font-urdu, .font-nastaliq, .font-header-urdu, .font-heading {
        font-family: ${fontStack} !important;
      }
      .print-page, #official-nikah-nama-form-25, #modal-printable-document, #khutbah-nikah-printable, #receipt-a4-printable {
        font-family: ${fontStack} !important;
      }
      .letterhead-pad-compact {
        font-size: calc(1rem * ${settings.letterheadScale / 100});
      }
      #receipt-a4-printable {
        font-size: calc(0.95rem * ${settings.receiptFontScale / 100}) !important;
      }
    `;
  };

  const updateCustomFontsStyleSheet = (fonts: CustomFontItem[]) => {
    let styleEl = document.getElementById('custom-fonts-style-declarations') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-fonts-style-declarations';
      document.head.appendChild(styleEl);
    }
    const rules = fonts
      .filter((f) => f.fontData)
      .map((f) => `@font-face { font-family: '${f.name}'; src: url('${f.fontData}'); font-display: swap; }`)
      .join('\n');
    styleEl.textContent = rules;
  };

  // Helper to load a FontFace into document.fonts
  const registerFontInDocument = async (font: CustomFontItem): Promise<boolean> => {
    try {
      // Check if already in document.fonts
      let alreadyLoaded = false;
      document.fonts.forEach((f) => {
        if (f.family === font.name) alreadyLoaded = true;
      });
      if (alreadyLoaded) return true;

      const fontFace = new FontFace(font.name, `url(${font.fontData})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      return true;
    } catch (err) {
      console.warn(`Font load warning for ${font.name}:`, err);
      return false;
    }
  };

  // On mount, load all saved custom fonts & apply settings
  useEffect(() => {
    // 1. Initial register for any already loaded fonts
    updateCustomFontsStyleSheet(customFonts);
    customFonts.forEach((f) => {
      if (f.fontData) registerFontInDocument(f);
    });

    // 2. Load complete font data from IndexedDB (preserves multi-megabyte fonts without quota limits)
    idbStorage.getStoredCustomFonts().then((idbFonts) => {
      if (idbFonts && idbFonts.length > 0) {
        setCustomFonts(idbFonts);
        updateCustomFontsStyleSheet(idbFonts);
        idbFonts.forEach((f) => {
          registerFontInDocument(f);
        });
      }
    });

    applySettingsToDOM(typographySettings);
  }, []);

  // Whenever typographySettings change, update DOM and storage
  useEffect(() => {
    applySettingsToDOM(typographySettings);
    storageService.saveTypographySettings(typographySettings);
  }, [typographySettings]);

  const updateTypographySettings = (partial: Partial<TypographySettings>) => {
    setTypographySettings((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const resetTypography = () => {
    setTypographySettings(DEFAULT_TYPOGRAPHY_SETTINGS);
  };

  const addCustomFont = async (
    file: File,
    customName?: string
  ): Promise<{ success: boolean; fontName?: string; error?: string }> => {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let format: CustomFontItem['format'] = 'truetype';
      if (ext === 'otf') format = 'opentype';
      else if (ext === 'woff') format = 'woff';
      else if (ext === 'woff2') format = 'woff2';
      else if (ext === 'ttf') format = 'truetype';
      else {
        return { success: false, error: 'براہ کرم .ttf، .otf، .woff یا .woff2 فونٹ فائل منتخب کریں۔' };
      }

      // Read file as base64 DataURL
      const reader = new FileReader();
      const fontDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      // Font family name
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u0600-\u06FF\s-]/g, '');
      const finalFontName = customName?.trim() || cleanFileName || `CustomFont_${Date.now()}`;

      const newFontItem: CustomFontItem = {
        id: 'font-' + Date.now(),
        name: finalFontName,
        fileName: file.name,
        fontData: fontDataUrl,
        format,
        uploadedAt: new Date().toISOString(),
        fileSizeKb: Math.round(file.size / 1024),
      };

      // Register immediately in document.fonts
      await registerFontInDocument(newFontItem);

      const updatedList = [newFontItem, ...customFonts.filter((f) => f.name !== finalFontName)];
      setCustomFonts(updatedList);
      updateCustomFontsStyleSheet(updatedList);

      // Persist to IndexedDB (safe from localStorage 5MB quota errors)
      await idbStorage.saveStoredCustomFonts(updatedList);
      storageService.saveCustomFonts(updatedList);

      // Auto-activate as primary font
      updateTypographySettings({ primaryFont: finalFontName });

      return { success: true, fontName: finalFontName };
    } catch (err: any) {
      console.error('Error adding font:', err);
      return { success: false, error: err?.message || 'فونٹ اپلوڈ کرنے میں خرابی واقع ہوئی۔' };
    }
  };

  const removeCustomFont = async (id: string) => {
    const target = customFonts.find((f) => f.id === id);
    const updated = customFonts.filter((f) => f.id !== id);
    setCustomFonts(updated);
    updateCustomFontsStyleSheet(updated);
    await idbStorage.saveStoredCustomFonts(updated);
    storageService.saveCustomFonts(updated);

    // If currently selected, revert to default
    if (target && typographySettings.primaryFont === target.name) {
      updateTypographySettings({ primaryFont: DEFAULT_TYPOGRAPHY_SETTINGS.primaryFont });
    }
  };

  const availableFontFamilies = [
    ...PRESET_FONTS,
    ...customFonts.map((f) => ({
      id: f.name,
      labelUrdu: `${f.name} (آپ کا اپلوڈ کردہ فونٹ)`,
      labelEn: `${f.name} (Custom Font)`,
      isCustom: true,
    })),
  ];

  return (
    <TypographyContext.Provider
      value={{
        typographySettings,
        updateTypographySettings,
        resetTypography,
        customFonts,
        addCustomFont,
        removeCustomFont,
        isTypographyModalOpen,
        setIsTypographyModalOpen,
        availableFontFamilies,
      }}
    >
      {children}
    </TypographyContext.Provider>
  );
};

export const useTypography = () => {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error('useTypography must be used within a TypographyProvider');
  }
  return context;
};
