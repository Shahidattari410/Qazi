/**
 * Font Manager Service
 * Allows users to change font family, adjust font size, and upload custom fonts from mobile/PC
 */

export interface AppFontOption {
  id: string;
  nameUrdu: string;
  nameEn: string;
  fontFamily: string;
  isCustom?: boolean;
  dataUrl?: string;
}

export const DEFAULT_APP_FONTS: AppFontOption[] = [
  {
    id: 'jameel_nastaleeq',
    nameUrdu: 'جمیل نوری نستعلیق (معیاری دفتری)',
    nameEn: 'Jameel Noori Nastaleeq',
    fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif",
  },
  {
    id: 'noto_nastaliq',
    nameUrdu: 'نوٹو نستعلیق اردو',
    nameEn: 'Noto Nastaliq Urdu',
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
  },
  {
    id: 'amiri_classical',
    nameUrdu: 'خطِ امیری (کلاسیکی عربی و شرعی)',
    nameEn: 'Amiri Classical',
    fontFamily: "'Amiri', 'Jameel Noori Nastaleeq', serif",
  },
  {
    id: 'urdu_typesetting',
    nameUrdu: 'اردو ٹائپ سیٹنگ (روایتی باریک)',
    nameEn: 'Urdu Typesetting',
    fontFamily: "'Urdu Typesetting', 'Jameel Noori Nastaleeq', serif",
  },
];

const STORAGE_KEY_SELECTED_FONT = 'qazi_office_selected_font_id';
const STORAGE_KEY_FONT_SCALE = 'qazi_office_font_scale';
const STORAGE_KEY_CUSTOM_FONTS = 'qazi_office_custom_fonts';

export const fontManager = {
  // Load custom fonts into DOM document.fonts
  initCustomFonts(): void {
    if (typeof window === 'undefined') return;
    try {
      const customFonts = this.getCustomFonts();
      customFonts.forEach((f) => {
        if (f.dataUrl) {
          this.registerFontFace(f.nameEn, f.dataUrl);
        }
      });
    } catch (e) {
      console.warn('Error initializing custom fonts:', e);
    }
  },

  registerFontFace(fontName: string, dataUrl: string): void {
    try {
      const font = new FontFace(fontName, `url(${dataUrl})`);
      font
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
        })
        .catch((err) => console.warn('Could not load FontFace:', err));
    } catch (e) {
      console.warn('FontFace API error:', e);
    }
  },

  getCustomFonts(): AppFontOption[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_FONTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getAllFonts(): AppFontOption[] {
    return [...DEFAULT_APP_FONTS, ...this.getCustomFonts()];
  },

  saveCustomFont(name: string, dataUrl: string): AppFontOption {
    const customFonts = this.getCustomFonts();
    const id = 'custom_font_' + Date.now();
    const safeName = name.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'CustomFont';
    const newFont: AppFontOption = {
      id,
      nameUrdu: `فونٹ: ${name}`,
      nameEn: safeName,
      fontFamily: `'${safeName}', 'Jameel Noori Nastaleeq', serif`,
      isCustom: true,
      dataUrl,
    };

    this.registerFontFace(safeName, dataUrl);
    const updated = [...customFonts, newFont];
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_FONTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage limit for custom font exceeded', e);
    }
    return newFont;
  },

  deleteCustomFont(id: string): void {
    const customFonts = this.getCustomFonts().filter((f) => f.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_FONTS, JSON.stringify(customFonts));
    } catch (e) {
      console.warn('Error saving custom fonts:', e);
    }
  },

  getSelectedFontId(): string {
    return localStorage.getItem(STORAGE_KEY_SELECTED_FONT) || 'jameel_nastaleeq';
  },

  setSelectedFontId(fontId: string): void {
    localStorage.setItem(STORAGE_KEY_SELECTED_FONT, fontId);
  },

  getSelectedFont(): AppFontOption {
    const id = this.getSelectedFontId();
    const all = this.getAllFonts();
    return all.find((f) => f.id === id) || DEFAULT_APP_FONTS[0];
  },

  getFontScale(): number {
    const val = localStorage.getItem(STORAGE_KEY_FONT_SCALE);
    return val ? parseFloat(val) : 0.95; // Default slightly compact (0.95)
  },

  setFontScale(scale: number): void {
    const clamped = Math.max(0.75, Math.min(1.4, scale));
    localStorage.setItem(STORAGE_KEY_FONT_SCALE, clamped.toString());
  },
};
