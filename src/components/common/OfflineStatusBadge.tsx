import React, { useState } from 'react';
import { Wifi, WifiOff, Download, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

export const OfflineStatusBadge: React.FC = () => {
  const { isOnline, canInstall, triggerInstall, isInstalled } = useOfflineStatus();
  const [dismissOfflineNotice, setDismissOfflineNotice] = useState(false);

  return (
    <div className="font-urdu no-print">
      {/* Offline Alert Banner if Internet disconnects */}
      {!isOnline && !dismissOfflineNotice && (
        <div className="bg-amber-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold shadow-sm transition-all animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-100 shrink-0" />
            <span>
              ⚡ آپ آف لائن ہیں: فکر نہ کریں! تمام ڈیٹا انٹری، تلاش، پرنٹنگ اور محفوظ کرنے کا نظام انٹرنیٹ کے بغیر 100% مکمل فعال ہے۔
            </span>
          </div>
          <button
            onClick={() => setDismissOfflineNotice(true)}
            className="p-1 hover:bg-amber-700 rounded-md text-amber-100"
            title="بند کریں"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Persistent mini-indicator in header or bottom */}
    </div>
  );
};
