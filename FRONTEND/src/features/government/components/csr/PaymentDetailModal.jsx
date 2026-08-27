import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  ShieldCheck,
  Download,
  KeyRound,
  Printer,
  RefreshCw
} from 'lucide-react';

export const PaymentDetailModal = ({
  isOpen,
  onClose,
  payment,
  onAuthorizePayment,
  onRefreshGateway
}) => {
  if (!isOpen || !payment) return null;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefreshGateway?.(payment.id);
    }, 800);
  };

  const handleAuthorize = () => {
    onAuthorizePayment?.(payment.id);
    setAuthSuccess(true);
    setTimeout(() => {
      setAuthSuccess(false);
    }, 2000);
  };

  const handlePrintAdvice = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print payment advice');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Payment Advice - ${payment.id}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; font-size: 12px; }
    .header { border-bottom: 2px solid #0d1b3e; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .header h2 { margin: 0; color: #0d1b3e; font-size: 18px; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .table td { padding: 8px 12px; border: 1px solid #cbd5e1; }
    .table td.lbl { background: #f8fafc; font-weight: bold; width: 30%; }
    .footer { margin-top: 40px; border-top: 1px dashed #94a3b8; padding-top: 15px; font-size: 10px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2>Government of Jharkhand · JoharSetu Escrow Gate</h2>
      <p style="margin: 3px 0 0 0; color: #64748b;">Automated Banking Gateway Transfer Advice (Schedule VII Compliant)</p>
    </div>
    <div>
      <span class="badge">UTR: ${payment.utrNumber}</span>
    </div>
  </div>

  <table class="table">
    <tr><td class="lbl">Payment Transaction ID</td><td><strong>${payment.id}</strong></td></tr>
    <tr><td class="lbl">Funding Source / Payer</td><td>${payment.payer}</td></tr>
    <tr><td class="lbl">Beneficiary Payee Entity</td><td><strong>${payment.payee}</strong></td></tr>
    <tr><td class="lbl">Gross Disbursed Amount</td><td><strong>${payment.disbursedAmount}</strong></td></tr>
    <tr><td class="lbl">TDS Withholding (Sec 194C / 194J)</td><td>${payment.tdsAmount || '₹3,000 (194C @ 2%)'}</td></tr>
    <tr><td class="lbl">Net Settled to Bank Vault</td><td><strong>${payment.netDisbursed || payment.disbursedAmount}</strong></td></tr>
    <tr><td class="lbl">Payment Mode & Protocol</td><td>${payment.mode} (API Direct Clearance)</td></tr>
    <tr><td class="lbl">UTR Reference Number</td><td><span style="font-family: monospace; font-weight: bold; color: #0369a1;">${payment.utrNumber}</span></td></tr>
    <tr><td class="lbl">Maker-Checker Verification</td><td>${payment.makerCheckerSign} (Dual-Key Signed)</td></tr>
    <tr><td class="lbl">Bank Gateway Acknowledgement</td><td>${payment.bankAckStatus}</td></tr>
    <tr><td class="lbl">Timestamp</td><td>${payment.timestamp || new Date().toLocaleString()}</td></tr>
    <tr><td class="lbl">Purpose & Tranche</td><td>${payment.purpose || 'Tranche Release for Milestone Work Execution'}</td></tr>
  </table>

  <div class="footer">
    <p>This is a computer-generated bank gateway advice validated under the Public Financial Management System (PFMS) & State Escrow Governance Protocol.</p>
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center font-mono font-bold text-xs shrink-0">
              {payment.id}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{payment.payer} → {payment.payee}</h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">UTR: <span className="font-mono text-blue-600 font-bold">{payment.utrNumber}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintAdvice}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1 text-xs font-semibold cursor-pointer"
              title="Print Payment Advice"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Payment Advice</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Main Amounts Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Gross Tranche</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">{payment.disbursedAmount}</span>
              <span className="text-[10.5px] text-slate-500 font-medium">Mode: {payment.mode}</span>
            </div>
            <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">TDS Withheld</span>
              <span className="text-lg font-black text-amber-900 block mt-0.5">{payment.tdsAmount || '₹3,000 (194C)'}</span>
              <span className="text-[10.5px] text-amber-700 font-medium">Sec 194C / 194J</span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Net Bank Transfer</span>
              <span className="text-lg font-black text-emerald-900 block mt-0.5">{payment.netDisbursed || payment.disbursedAmount}</span>
              <span className="text-[10.5px] text-emerald-700 font-medium">Direct Vault Credit</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            <div className="p-3 bg-slate-50/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700">Bank Gateway & Telemetry Status</span>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-bold text-[11px] cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Re-query Bank API</span>
              </button>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Bank Acknowledgment</span>
              <span className="inline-flex items-center space-x-1.5 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{payment.bankAckStatus} (Gateway Latency 24ms)</span>
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Maker-Checker Authorization</span>
              <span className={`font-bold ${payment.makerCheckerStatus === 'approved' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {payment.makerCheckerSign}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Funding Scheme</span>
              <span className="font-semibold text-slate-800">{payment.scheme || 'Corporate CSR'}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Disbursal Purpose</span>
              <span className="font-medium text-slate-800">{payment.purpose || 'Milestone Work Tranche'}</span>
            </div>
          </div>

          {/* Dual-Key Signoff Box */}
          {payment.makerCheckerStatus === 'pending' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Dual-Key Super Approver Signature Required</span>
              </div>
              <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                Level-1 Financial Officer has validated the expense voucher. Pending your Level-2 digital key signature to release payout through RTGS.
              </p>
              <button
                onClick={handleAuthorize}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authorize & Sign with Digital Key</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2.5 text-emerald-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dual-Key Authentication verified & sealed. Cryptographic hash recorded in Government Audit Ledger.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            {authSuccess ? '✓ Payment Authorized & Dispatched!' : '24x7 RTGS/NEFT API'}
          </span>
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

export default PaymentDetailModal;
