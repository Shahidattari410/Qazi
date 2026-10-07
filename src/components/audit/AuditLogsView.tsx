import React, { useState } from 'react';
import { History, ShieldCheck, Search, Filter, Clock, UserCheck } from 'lucide-react';
import { AuditLog, User } from '../../types';
import { storageService } from '../../services/storage';

export const AuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => storageService.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.entityDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'all' || l.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-5 font-urdu">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-700" />
          <span>آڈٹ ٹریل لاگز و سیکیورٹی سرگرمی (Audit Trail)</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          کس صارف نے کب، کون سا ریکارڈ درج، تبدیل، پرنٹ یا حذف کیا — مکمل محفوظ تاریخچہ
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 flex justify-between items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="صارف، تفصیل یا ریفرنس آئی ڈی سے تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border rounded-lg focus:outline-emerald-800"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="text-xs border rounded-lg p-1.5 bg-white text-neutral-800"
        >
          <option value="all">تمام سرگرمیاں</option>
          <option value="CREATE">نیا اندراج (CREATE)</option>
          <option value="UPDATE">ترمیم (UPDATE)</option>
          <option value="DELETE">حذف (DELETE)</option>
          <option value="PRINT">پرنٹ (PRINT)</option>
          <option value="EXPORT">ایکسپورٹ (EXPORT)</option>
          <option value="RESTORE">بحالی (RESTORE)</option>
        </select>
      </div>

      {/* Log Entries Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-neutral-100 border-b font-bold text-neutral-800">
              <tr>
                <th className="p-3">وقت و تاریخ</th>
                <th className="p-3">صارف (User)</th>
                <th className="p-3">کردار (Role)</th>
                <th className="p-3">کارروائی (Action)</th>
                <th className="p-3">نوعیت</th>
                <th className="p-3">تفصیلاتِ سرگرمی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50">
                  <td className="p-3 font-mono text-[11px] text-neutral-600">
                    {new Date(log.timestamp).toLocaleString('ur-PK')}
                  </td>
                  <td className="p-3 font-bold text-neutral-900">{log.userName}</td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-100 text-emerald-900'
                          : log.action === 'DELETE'
                          ? 'bg-rose-100 text-rose-900'
                          : log.action === 'UPDATE'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-neutral-600">{log.entityType}</td>
                  <td className="p-3 text-neutral-800">{log.entityDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
