import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  FileSpreadsheet,
  Coins,
  HeartHandshake,
  Scale,
  Receipt,
  Stamp,
  Filter,
} from 'lucide-react';
import { storageService } from '../../services/storage';

export const ReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<string>('nikah_monthly');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const nikahs = storageService.getNikahs();
  const talaqs = storageService.getTalaqRecords();
  const khulas = storageService.getKhulaRecords();
  const fees = storageService.getFees();
  const stamps = storageService.getStamps();

  // Export current report as CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = 'report.csv';

    if (reportType === 'nikah_monthly' || reportType === 'nikah_annual') {
      headers = ['Registration No', 'Date', 'Groom', 'Groom CNIC', 'Bride', 'Bride CNIC', 'Haq Mehr', 'Status', 'Union Council'];
      rows = nikahs.map((n) => [
        n.registrationNo,
        n.date,
        n.groom.fullName,
        n.groom.cnic,
        n.bride.fullName,
        n.bride.cnic,
        n.mehr.totalAgreedAmount,
        n.status,
        n.unionCouncil,
      ]);
      filename = `Nikah_Report_${selectedYear}.csv`;
    } else if (reportType === 'fees') {
      headers = ['Receipt No', 'Date', 'Person Name', 'CNIC', 'Service', 'Amount', 'Payment Method', 'Status'];
      rows = fees.map((f) => [
        f.receiptNo,
        f.date,
        f.personName,
        f.cnic,
        f.service,
        f.amount,
        f.paymentMethod,
        f.status,
      ]);
      filename = `Fee_Ledger_Report_${selectedYear}.csv`;
    } else if (reportType === 'haqmehr') {
      headers = ['Nikah No', 'Groom', 'Bride', 'Nature', 'Total Mehr', 'Received', 'Remaining', 'Payment Status'];
      rows = nikahs.map((n) => [
        n.registrationNo,
        n.groom.fullName,
        n.bride.fullName,
        n.mehr.nature,
        n.mehr.totalAgreedAmount,
        n.mehr.amountReceived || n.mehr.muajjalAmount,
        n.mehr.remainingAmount || n.mehr.muakhkharAmount,
        n.mehr.paymentStatus,
      ]);
      filename = `Haq_Mehr_Report_${selectedYear}.csv`;
    } else {
      headers = ['Case No', 'Date', 'Type', 'Husband', 'Wife', 'Status'];
      rows = talaqs.map((t) => [t.caseNo, t.talaqDate, t.type, t.husbandName, t.wifeName, t.status]);
      filename = `Talaq_Khula_Report_${selectedYear}.csv`;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${x}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const totalFeeSum = fees.reduce((acc, f) => acc + f.amount, 0);
  const totalMehrAgreed = nikahs.reduce((acc, n) => acc + n.mehr.totalAgreedAmount, 0);
  const totalMehrPending = nikahs.reduce((acc, n) => acc + (n.mehr.remainingAmount || n.mehr.muakhkharAmount), 0);

  return (
    <div className="space-y-6 font-urdu">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>رپورٹس، اعداد و شمار و تجزیات (Reports & Analytics)</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            ماہانہ و سالانہ خلاصہ جات، حق مہر تجزیہ، فیس آمدن اور یونین کونسل وار آڈٹ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-xs font-bold text-neutral-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>ایکسل / CSV ڈاؤنلوڈ</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>رپورٹ پرنٹ کریں</span>
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 flex flex-wrap items-center gap-3 no-print">
        <label className="text-xs font-bold text-neutral-700">رپورٹ کی نوعیت:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="text-xs border rounded-lg p-1.5 bg-white text-neutral-800"
        >
          <option value="nikah_monthly">ماہانہ نکاح رپورٹ</option>
          <option value="nikah_annual">سالانہ جامع نکاح رپورٹ</option>
          <option value="haqmehr">حق مہر و بقایا جات رپورٹ</option>
          <option value="fees">فیس آمدن و اخراجات لیجر رپورٹ</option>
          <option value="talaq_khula">طلاق و خلع کیسز رپورٹ</option>
          <option value="uc_report">یونین کونسل وار رپورٹ</option>
        </select>

        <label className="text-xs font-bold text-neutral-700 mr-3">سال:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="text-xs border rounded-lg p-1.5 bg-white text-neutral-800 font-mono"
        >
          <option value="2026">2026ء</option>
          <option value="2025">2025ء</option>
          <option value="2024">2024ء</option>
        </select>
      </div>

      {/* Printable Report Surface */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
        {/* Report Official Header */}
        <div className="text-center border-b pb-4 space-y-1">
          <h3 className="font-urdu font-bold text-lg text-emerald-950">
            دفتر قاضی مولانا حافظ محمد شاہد عطاری مدنی (نکاح خواں و رجسٹرار)
          </h3>
          <p className="text-xs font-bold text-neutral-700">
            {reportType === 'nikah_monthly' && `ماہانہ نکاح اندراج رپورٹ — سال ${selectedYear}ء`}
            {reportType === 'nikah_annual' && `سالانہ جامع ریکارڈ رپورٹ — سال ${selectedYear}ء`}
            {reportType === 'haqmehr' && `حق مہر ادائیگی و بقایا جات آڈٹ رپورٹ`}
            {reportType === 'fees' && `فیس وصولی و اکاؤنٹس مالی رپورٹ`}
            {reportType === 'talaq_khula' && `طلاق و خلع کے دفتری اندراجات کی رپورٹ`}
            {reportType === 'uc_report' && `یونین کونسل وار کارکردگی رپورٹ`}
          </p>
          <span className="text-[10px] text-neutral-500 font-mono block">
            تاریخ اجرا: {new Date().toLocaleDateString('ur-PK')} | تصدیق شدہ دفتری آڈٹ
          </span>
        </div>

        {/* Aggregate KPI Summary for Report */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs">
          <div className="text-center">
            <span className="text-neutral-500 block text-[10px]">کل نکاح اندراجات:</span>
            <span className="font-mono font-bold text-base text-emerald-900">{nikahs.length}</span>
          </div>
          <div className="text-center">
            <span className="text-neutral-500 block text-[10px]">طے شدہ حق مہر حجم:</span>
            <span className="font-mono font-bold text-base text-amber-900">
              روپے {totalMehrAgreed.toLocaleString()}
            </span>
          </div>
          <div className="text-center">
            <span className="text-neutral-500 block text-[10px]">مہر بقایا جات:</span>
            <span className="font-mono font-bold text-base text-rose-800">
              روپے {totalMehrPending.toLocaleString()}
            </span>
          </div>
          <div className="text-center">
            <span className="text-neutral-500 block text-[10px]">فیس آمدن مجموعہ:</span>
            <span className="font-mono font-bold text-base text-emerald-800">
              روپے {totalFeeSum.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic Table for selected report */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border border-neutral-200">
            <thead className="bg-neutral-100 border-b font-bold text-neutral-800">
              {reportType.includes('nikah') ? (
                <tr>
                  <th className="p-2.5 border-l">رجسٹریشن نمبر</th>
                  <th className="p-2.5 border-l">تاریخ</th>
                  <th className="p-2.5 border-l">دولہا</th>
                  <th className="p-2.5 border-l">دلہن</th>
                  <th className="p-2.5 border-l">حق مہر</th>
                  <th className="p-2.5 border-l">یونین کونسل</th>
                  <th className="p-2.5">حالت</th>
                </tr>
              ) : reportType === 'fees' ? (
                <tr>
                  <th className="p-2.5 border-l">رسید نمبر</th>
                  <th className="p-2.5 border-l">تاریخ</th>
                  <th className="p-2.5 border-l">سائل کا نام</th>
                  <th className="p-2.5 border-l">خدمت / سروس</th>
                  <th className="p-2.5 border-l">رقم</th>
                  <th className="p-2.5">طریقہ ادائیگی</th>
                </tr>
              ) : (
                <tr>
                  <th className="p-2.5 border-l">کیس نمبر</th>
                  <th className="p-2.5 border-l">شوہر</th>
                  <th className="p-2.5 border-l">زوجہ</th>
                  <th className="p-2.5 border-l">تاریخ</th>
                  <th className="p-2.5 border-l">نوعیت</th>
                  <th className="p-2.5">حالت</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {reportType.includes('nikah')
                ? nikahs.map((n) => (
                    <tr key={n.id}>
                      <td className="p-2.5 border-l font-mono font-bold">{n.registrationNo}</td>
                      <td className="p-2.5 border-l font-mono">{n.date}</td>
                      <td className="p-2.5 border-l">{n.groom.fullName}</td>
                      <td className="p-2.5 border-l">{n.bride.fullName}</td>
                      <td className="p-2.5 border-l font-mono">روپے {n.mehr.totalAgreedAmount.toLocaleString()}</td>
                      <td className="p-2.5 border-l">{n.unionCouncil}</td>
                      <td className="p-2.5">{n.status}</td>
                    </tr>
                  ))
                : reportType === 'fees'
                ? fees.map((f) => (
                    <tr key={f.id}>
                      <td className="p-2.5 border-l font-mono font-bold">{f.receiptNo}</td>
                      <td className="p-2.5 border-l font-mono">{f.date}</td>
                      <td className="p-2.5 border-l">{f.personName}</td>
                      <td className="p-2.5 border-l">{f.service}</td>
                      <td className="p-2.5 border-l font-mono font-bold">روپے {f.amount.toLocaleString()}</td>
                      <td className="p-2.5">{f.paymentMethod}</td>
                    </tr>
                  ))
                : talaqs.map((t) => (
                    <tr key={t.id}>
                      <td className="p-2.5 border-l font-mono font-bold">{t.caseNo}</td>
                      <td className="p-2.5 border-l">{t.husbandName}</td>
                      <td className="p-2.5 border-l">{t.wifeName}</td>
                      <td className="p-2.5 border-l font-mono">{t.talaqDate}</td>
                      <td className="p-2.5 border-l">{t.type}</td>
                      <td className="p-2.5">{t.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Report Footer / Signature Area */}
        <div className="pt-6 border-t flex justify-between items-end text-xs">
          <div>
            <span className="text-[10px] text-neutral-500 block">مرتب کنندہ:</span>
            <span className="font-bold">معاونِ رجسٹرار، دارالقضاء</span>
          </div>
          <div className="text-center">
            <div className="w-36 border-b border-neutral-500 mb-1"></div>
            <span className="font-bold text-emerald-950">
              مولانا قاضی حافظ محمد شاہد عطاری مدنی
            </span>
            <span className="text-[10px] text-neutral-500 block">نکاح خواں (رجسٹرار)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
