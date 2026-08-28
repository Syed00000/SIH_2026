import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Printer, Download } from 'lucide-react';
export const Gfr12AModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print GFR 12-A');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Form GFR 12-A - Utilization Certificate</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
    .header h2 { margin: 0; font-size: 16px; }
    .header p { margin: 4px 0 0; font-size: 12px; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .table th, .table td { border: 1px solid #000; padding: 6px 10px; }
    .table th { background: #f0f0f0; text-align: left; }
    .footer-signs { margin-top: 60px; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <h2>FORM GFR 12-A</h2>
    <p>[See Rule 238 (1)]</p>
    <p><strong>FORM OF UTILIZATION CERTIFICATE FOR CSR / AUTONOMOUS BODIES / UNIVERSITIES</strong></p>
    <p>Government of Jharkhand · Department of Higher & Technical Education</p>
  </div>

  <p><strong>1. Name of the Scheme:</strong> Societal Innovation & Higher Ed Research Corpus (JoharSetu Hub)</p>
  <p><strong>2. Grants-in-aid Sanction Order No. & Date:</strong> DHTE/CSR-JH/2026/PROP-011 dated 12-Jan-2026</p>
  <p><strong>3. Beneficiary Institution:</strong> BIT Mesra (Innovation Hub)</p>
  <p><strong>4. UC Registration Number:</strong> ${gfrData.ucNumber}</p>

  <table class="table">
    <thead>
      <tr>
        <th>Sl. No.</th>
        <th>Letter No. & Date</th>
        <th>Amount Received (₹)</th>
        <th>Amount Utilized (₹)</th>
        <th>Unspent Balance (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1.</td>
        <td>DHTE/CSR/SANCT-011</td>
        <td>${gfrData.grantSanctioned}</td>
        <td>${gfrData.grantUtilized}</td>
        <td>${gfrData.unspentCorpus}</td>
      </tr>
    </tbody>
  </table>

  <p><strong>Certified that:</strong></p>
  <p>1. Out of ₹4,50,00,000/- of grants sanctioned during the year 2026-27, a sum of ₹4,38,20,000/- has been utilized for the purpose of research and societal innovation for which it was sanctioned.</p>
  <p>2. The remaining unspent balance of ₹11,80,000/- has been surrendered / auto-swept back to the State Government Escrow account.</p>
  <p>3. The expenditure has been cross-vetted by Empanelled Chartered Accountants with full voucher trail.</p>

  <div class="footer-signs">
    <div>
      __________________________<br/>
      <strong>Finance Officer / Registrar</strong><br/>
      BIT Mesra
    </div>
    <div>
      __________________________<br/>
      <strong>State Nodal Officer</strong><br/>
      Dept of Higher & Tech Education
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
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Form GFR 12-A Statutory Utilization Certificate</h3>
              <p className="text-[11px] text-slate-500 font-medium">[See Rule 238 (1)] · Digital Seal Verified</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1 text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print UC</span>
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
              <span className="font-bold text-slate-900 text-xs">Utilization Certificate Registry</span>
              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {gfrData.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">UC Certificate Number</span>
                <span className="font-mono font-bold text-blue-600">{gfrData.ucNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Submission Date</span>
                <span className="font-mono font-semibold text-slate-800">{gfrData.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Total Grant Sanctioned</span>
                <span className="font-mono font-bold text-slate-900">{gfrData.grantSanctioned}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px] font-bold">Total Grant Utilized</span>
                <span className="font-mono font-bold text-emerald-700">{gfrData.grantUtilized}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start space-x-2 text-[11px] text-blue-900 font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>Digital Certificate signed by Registrar & Finance Officer, BIT Mesra and counter-signed by Jharkhand Department of Higher & Technical Education.</span>
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

export default Gfr12AModal;
