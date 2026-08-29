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
    .badge { background: #f1f5f9; color: #0f172a; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
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
    <tr><td class="lbl">UTR Reference Number</td><td><span style="font-family: monospace; font-weight: bold; color: #0f172a;">${payment.utrNumber}</span></td></tr>
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <CreditCard className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-slate-900">{payment.id}</span>
                <span className="text-slate-400">•</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{payment.payer} ➔ {payment.payee}</h3>
              </div>
              <p className="text-xs text-slate-500 font-normal">UTR: <span className="font-mono text-slate-900 font-semibold">{payment.utrNumber}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintAdvice}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-900 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shadow-xs"
              title="Print Payment Advice"
            >
              <Printer className="w-3.5 h-3.5 text-slate-900" />
              <span className="hidden sm:inline">Payment Advice</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-900" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs bg-white">
          {/* Main Amounts Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Gross Tranche</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{payment.disbursedAmount}</span>
              <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">Mode: {payment.mode}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">TDS Withheld</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{payment.tdsAmount || '₹3,000 (194C)'}</span>
              <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">Sec 194C / 194J</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Net Bank Transfer</span>
              <span className="text-base font-bold text-slate-900 block mt-1">{payment.netDisbursed || payment.disbursedAmount}</span>
              <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">Direct Vault Credit</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
            <div className="p-3 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Gateway Telemetry</span>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center space-x-1 text-slate-900 hover:text-black font-semibold text-xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Re-query Bank API</span>
              </button>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Bank Acknowledgment</span>
              <span className="inline-flex items-center space-x-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                <span>{payment.bankAckStatus} (Gateway Latency 24ms)</span>
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Maker-Checker Authorization</span>
              <span className="font-bold text-slate-900">
                {payment.makerCheckerSign}
              </span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Funding Scheme</span>
              <span className="font-semibold text-slate-900">{payment.scheme || 'Corporate CSR'}</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Disbursal Purpose</span>
              <span className="font-normal text-slate-700">{payment.purpose || 'Milestone Work Tranche'}</span>
            </div>
          </div>

          {/* Dual-Key Signoff Box */}
          {payment.makerCheckerStatus === 'pending' ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <KeyRound className="w-4 h-4 text-slate-900" />
                <span>Dual-Key Super Approver Signature Required</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Level-1 Financial Officer has validated the expense voucher. Pending your Level-2 digital key signature to release payout through RTGS.
              </p>
              <button
                onClick={handleAuthorize}
                className="w-full py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs cursor-pointer flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Authorize & Sign with Digital Key</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex items-center space-x-2 text-slate-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0" />
              <span>Dual-Key Authentication verified & sealed. Cryptographic hash recorded in Government Audit Ledger.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {authSuccess ? '✓ Payment Authorized & Dispatched!' : '24x7 RTGS/NEFT API'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
