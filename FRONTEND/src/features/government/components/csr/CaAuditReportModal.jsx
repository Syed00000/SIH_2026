import React from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, Printer } from 'lucide-react';
import { MOCK_CLOSURE_STEPS } from '../../data/mockCsrLifecycleData.js';

export const CaAuditReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const caData = MOCK_CLOSURE_STEPS[1];

  const handlePrint = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print CA audit report');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>CA Audit Report - ${caData.caCertificateNo}</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
    .header h2 { margin: 0; font-size: 16px; }
    .footer-signs { margin-top: 60px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <h2>INDEPENDENT AUDITOR'S COMPLIANCE CERTIFICATE</h2>
    <p><strong>STATUTORY CSR & GOVERNMENT GRANTS AUDIT</strong></p>
    <p>Under Section 135 of Companies Act, 2013 & Schedule VII Guidelines</p>
  </div>

  <p><strong>Certificate Ref No:</strong> ${caData.caCertificateNo}</p>
  <p><strong>Auditing Firm:</strong> ${caData.caFirm}</p>
  <p><strong>Audit Date:</strong> ${caData.date}</p>

  <p>We have audited the accompanying statement of expenditure and bank escrow records of <strong>BIT Mesra (Innovation Hub)</strong> in respect of the grant received from <strong>Tata Steel CSR Foundation & Govt of Jharkhand</strong> for the project period FY 2026-27.</p>

  <h3>Audit Findings & Opinion:</h3>
  <ol>
    <li>The books of account, bank escrow statements, and GST-compliant expense vouchers have been examined in full.</li>
    <li>Proper internal financial controls were maintained during all procurement and disbursement cycles.</li>
    <li>TDS under Section 194C and 194J has been accurately withheld and deposited via Challan ITNS 281.</li>
    <li><strong>OPINION:</strong> ${caData.opinion}.</li>
  </ol>

  <div class="footer-signs">
    <div>
      __________________________<br/>
      <strong>For ${caData.caFirm}</strong><br/>
      Chartered Accountants<br/>
      Membership No. 054192
    </div>
  </div>
</body>
</html>
    `;
    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chartered Accountant Audit Statement</h3>
              <p className="text-[11px] text-slate-500 font-medium">Independent Statutory Compliance & Escrow Verification Report</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1 text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Audit Certificate Details</span>
              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {caData.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Certificate Number</span>
                <span className="font-mono font-bold text-blue-600">{caData.caCertificateNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Empanelled CA Firm</span>
                <span className="font-semibold text-slate-800">{caData.caFirm}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Audit Clearance Date</span>
                <span className="font-mono font-semibold text-slate-800">{caData.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Auditor Opinion</span>
                <span className="font-bold text-emerald-700">{caData.opinion}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start space-x-2 text-[11px] text-emerald-900 font-medium leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>100% of expense vouchers cross-verified against actual SBI/BOI escrow bank logs. Zero discrepancy reported.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaAuditReportModal;
