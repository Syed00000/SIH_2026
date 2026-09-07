import React from 'react';
import { X, FileText, Download, Printer } from 'lucide-react';

export const DossierModalHeader = ({
  chlId,
  domain,
  priority,
  onDownloadPdf,
  onPrint,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center space-x-2">
        <FileText className="w-4 h-4 text-[#047857]" />
        <h3 className="text-sm font-bold text-slate-900">
          Ground Truth Evidence Dossier
        </h3>
        <span className="font-mono text-xs font-bold text-[#047857]">
          {chlId}
        </span>
        <span className="text-xs font-semibold text-slate-600">
          &bull; {domain || 'Civic Problem'}
        </span>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={onDownloadPdf}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Export Formatted PDF"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={onPrint}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="Print Document"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DossierModalHeader;
