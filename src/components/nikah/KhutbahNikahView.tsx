import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  BookOpen,
  Share2,
} from 'lucide-react';
import { triggerReliablePrint, shareOrDownloadMobileDoc } from '../../utils/urduUtils';
import { Emblem } from '../common/Emblem';

interface KhutbahNikahViewProps {
  onBack?: () => void;
}

export const KhutbahNikahView: React.FC<KhutbahNikahViewProps> = ({ onBack }) => {
  const [khutbahFontSize, setKhutbahFontSize] = useState<number>(23);
  const [copied, setCopied] = useState<boolean>(false);

  const handlePrint = () => {
    triggerReliablePrint('khutbah-nikah-printable');
  };

  const handleMobilePrintOrShare = () => {
    shareOrDownloadMobileDoc('khutbah-nikah-printable', 'Khutbah_Nikah_Masnoon');
  };

  const pureArabicKhutbahText = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

خُطْبَةُ الْحَاجَةِ:
إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا، مَنْ يَهْدِهِ اللَّهُ فَلَا مُضِلَّ لَهُ، وَمَنْ يُضْلِلْ فَلَا هَادِيَ لَهُ، وَأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِیکَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.

آيَاتُ التَّقْوَى وَالنِّكَاحِ:
﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ ﴾
﴿ يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِنْ نَفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَاءً وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا ﴾
﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا ۝ يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ وَمَنْ يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا ﴾

أَحَادِيثُ النِّكَاحِ الشَّرِيفَةِ:
«النِّكَاحُ مِنْ سُنَّتِي فَمَنْ رَغِبَ عَنْ سُنَّتِي فَلَيْسَ مِنِّي»
«يَا مَعْشَرَ الشَّبَابِ مَنِ اسْتَطَاعَ مِنْكُمُ الْبَاءَةَ فَلْيَتَزَوَّجْ»
«تَنَاكَحُوا تَنَاسَلُوا أُبَاهِ بِكُمُ الْأُمَمَ يَوْمَ الْقِيَامَةِ»

دُعَاءُ التَّبْرِيكِ:
«بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pureArabicKhutbahText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 font-urdu">
      {/* Clean, Light Action Toolbar */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-neutral-200 shadow-2xs text-neutral-900 flex flex-wrap items-center justify-between gap-2.5 no-print">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs shadow-2xs transition-all font-header-urdu active:scale-95 border border-neutral-300"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>← واپس</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h2 className="font-header-urdu font-bold text-sm sm:text-base text-emerald-950">
              خطبہ نکاح مسنونہ (صرف عربی متن)
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded-xl border border-neutral-300">
            <button
              onClick={() => setKhutbahFontSize((s) => Math.max(16, s - 2))}
              className="p-1 rounded hover:bg-neutral-200 text-neutral-800"
              title="چھوٹا سائز"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs font-bold text-emerald-900 px-1">{khutbahFontSize}px</span>
            <button
              onClick={() => setKhutbahFontSize((s) => Math.min(36, s + 2))}
              className="p-1 rounded hover:bg-neutral-200 text-neutral-800"
              title="بڑا سائز"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors border border-neutral-300"
            title="عربی خطبہ متن کاپی کریں"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'کاپی ہو گیا' : 'کاپی عربی'}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all font-header-urdu"
            title="براہ راست خطبہ پرنٹ کریں"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>پرنٹ کریں</span>
          </button>

          {/* Mobile Print / Share Button */}
          <button
            onClick={handleMobilePrintOrShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all font-header-urdu border border-cyan-600/30"
            title="موبائل پرنٹ و شیئر (Android/iOS)"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-200" />
            <span>موبائل پرنٹ / PDF</span>
          </button>
        </div>
      </div>

      {/* Pure Arabic Khutbah Printable Document */}
      <div
        id="khutbah-nikah-printable"
        className="print-page bg-[#FFFDF5] text-neutral-900 rounded-xl border border-emerald-800/40 p-5 sm:p-7 mx-auto max-w-2xl shadow-2xs text-center relative"
        style={{ fontFamily: 'var(--app-font-family)' }}
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
          <Emblem size={240} />
        </div>

        {/* Top Header of Khutbah */}
        <div className="border-b border-emerald-900/20 pb-2 mb-4">
          <div className="text-xs font-bold text-emerald-800 font-arabic tracking-wider mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="font-arabic font-extrabold text-lg sm:text-xl text-emerald-950">
            خُطْبَةُ النِّكَاحِ الْمَسْنُونَة
          </h1>
        </div>

        {/* Pure Arabic Body - Dignified, Clear Arabic Typography */}
        <div
          className="font-arabic text-neutral-950 leading-[2.2] sm:leading-[2.4] space-y-4 text-justify rtl text-right"
          style={{ fontSize: `${khutbahFontSize}px` }}
        >
          {/* Khutbat-ul-Haajah */}
          <div className="bg-white/90 p-3.5 sm:p-4 rounded-lg border border-emerald-900/15 shadow-2xs">
            <div className="text-xs font-bold text-emerald-800 border-b border-emerald-900/10 pb-1 mb-2 font-arabic text-right">
              خُطْبَةُ الْحَاجَةِ:
            </div>
            <p className="select-all text-justify">
              إِنَّ الْحَمْدَ لِلَّهِ نَحْمَدُهُ وَنَسْتَعِينُهُ وَنَسْتَغْفِرُهُ، وَنَعُوذُ بِاللَّهِ مِنْ شُرُورِ أَنْفُسِنَا وَمِنْ سَيِّئَاتِ أَعْمَالِنَا، مَنْ يَهْدِهِ اللَّهُ فَلَا مُضِلَّ لَهُ، وَمَنْ يُضْلِلْ فَلَا هَادِيَ لَهُ، وَأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.
            </p>
          </div>

          {/* 3 Masnoon Ayahs */}
          <div className="bg-white/90 p-3.5 sm:p-4 rounded-lg border border-emerald-900/15 shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-emerald-800 border-b border-emerald-900/10 pb-1 font-arabic text-right">
              آيَاتُ التَّقْوَى وَالنِّكَاحِ:
            </div>

            <p className="select-all text-justify border-b border-dashed border-neutral-200 pb-2">
              ﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ حَقَّ تُقَاتِهِ وَلَا تَمُوتُنَّ إِلَّا وَأَنْتُمْ مُسْلِمُونَ ﴾
            </p>

            <p className="select-all text-justify border-b border-dashed border-neutral-200 pb-2">
              ﴿ يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ مِنْ نَفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا وَبَثَّ مِنْهُمَا رِجَالًا كَثِيرًا وَنِسَاءً وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا ﴾
            </p>

            <p className="select-all text-justify">
              ﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا ۝ يُصْلِحْ لَكُمْ أَعْمَالَكُمْ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ وَمَنْ يُطِعِ اللَّهَ وَرَسُولَهُ فَقَدْ فَازَ فَوْزًا عَظِيمًا ﴾
            </p>
          </div>

          {/* Masnoon Ahadith */}
          <div className="bg-white/90 p-3.5 sm:p-4 rounded-lg border border-emerald-900/15 shadow-2xs space-y-2">
            <div className="text-xs font-bold text-emerald-800 border-b border-emerald-900/10 pb-1 font-arabic text-right">
              أَحَادِيثُ النِّكَاحِ الشَّرِيفَةِ:
            </div>

            <p className="select-all text-justify">
              «النِّكَاحُ مِنْ سُنَّتِي فَمَنْ رَغِبَ عَنْ سُنَّتِي فَلَيْسَ مِنِّي»
            </p>

            <p className="select-all text-justify">
              «يَا مَعْشَرَ الشَّبَابِ مَنِ اسْتَطَاعَ مِنْكُمُ الْبَاءَةَ فَلْيَتَزَوَّجْ»
            </p>

            <p className="select-all text-justify">
              «تَنَاكَحُوا تَنَاسَلُوا أُبَاهِ بِكُمُ الْأُمَمَ يَوْمَ الْقِيَامَةِ»
            </p>
          </div>

          {/* Masnoon Dua */}
          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-700/25 text-center">
            <div className="text-xs font-bold text-emerald-900 mb-1 font-arabic">
              دُعَاءُ التَّبْرِيكِ:
            </div>
            <p className="font-bold text-emerald-950 text-base sm:text-lg select-all">
              «بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ»
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
