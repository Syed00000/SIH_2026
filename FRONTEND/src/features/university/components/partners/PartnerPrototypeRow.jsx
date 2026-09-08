import React from 'react';
import { FileText, ExternalLink, Users, Sparkles, MapPin, Lock, Clock, ShieldCheck, XCircle } from 'lucide-react';
import { PartnerActionCell } from './PartnerActionCell.jsx';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const PartnerPrototypeRow = ({
  partner,
  prototype,
  request,
  onSelectPartner,
  onOpenSendRequest,
  onApproveAmount
}) => {
  const partnerName = partner.name || partner.legalName || 'Industry Partner';
  const category = partner.industryType || partner.type || partner.category || 'Research Lab';
  const location = partner.location || (partner.address?.city ? `${partner.address.city}, JH` : 'Jharkhand, India');

  const problemTitle = prototype.title || 'Innovation Challenge';
  const problemStatement = prototype.problemStatement || prototype.title || 'Ground challenge statement.';
  const studentSquad = prototype.studentTeam || prototype.teamName || 'Student Research Squad';
  const studentLead = prototype.studentLead || prototype.leadMentor || 'Student Lead';
  const prototypeContent = prototype.prototypeData?.content || 'Telemetry hardware array and alert broadcasting prototype.';
  const pdfUrl = prototype.pdfUrl || prototype.prototypeData?.pdfUrl;
  const pdfName = prototype.pdfName || prototype.prototypeData?.pdfName || 'Blueprint.pdf';

  const isAccepted = request?.quoteStatus === 'Accepted' || (request?.status === 'Approved' && !request?.labChargesQuoted);
  const isDeclined = request?.quoteStatus === 'Declined' || request?.status === 'Fee Declined';
  const isPending = request?.status === 'Pending';
  const hasQuotedFee = Boolean(request?.labChargesQuoted) && !isDeclined && !isAccepted;

  const govtGrantNum = Number(String(prototype.originalGovernmentGrant || prototype.sanctionedBudget || prototype.disbursedAmount || '80000').replace(/[^\d]/g, '')) || 80000;
  const labFeeNum = Number(String(request?.labChargesQuoted || prototype.testingLabFee || '0').replace(/[^\d]/g, '')) || 0;
  const netUniBalance = isAccepted && labFeeNum > 0 ? Math.max(0, govtGrantNum - labFeeNum) : govtGrantNum;

  return (
    <tr
      className="hover:bg-emerald-50/20 transition-colors group cursor-pointer border-b border-slate-100"
      onClick={() => onSelectPartner(partner, prototype)}
    >
      {/* 1. Partner Entity */}
      <td className="py-3.5 px-4 align-top">
        <div className="flex items-start space-x-2.5">
          <div className="text-[16px] font-black text-[#007A61] flex items-center justify-center shrink-0 mt-0.5">
            {partner.logoText || partnerName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 truncate max-w-[150px] text-xs">
              {partnerName}
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-slate-600 text-[10px] font-bold">
                {category}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[120px]">{location}</span>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Ground Problem Statement */}
      <td className="py-3.5 px-4 align-top max-w-[200px]">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[9px] font-extrabold text-[#007A61] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {prototype.projectId || prototype.id}
            </span>
            <span className="font-bold text-slate-900 text-xs line-clamp-1">
              {problemTitle}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 italic line-clamp-2 bg-slate-50/80 p-1.5 rounded border border-slate-200/60 leading-tight">
            "{problemStatement}"
          </p>
        </div>
      </td>

      {/* 3. Solution Prototype Details */}
      <td className="py-3.5 px-4 align-top max-w-[210px]">
        <div className="space-y-1 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[9.5px]">
            <span className="font-extrabold text-[#007A61] flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#007A61] shrink-0" />
              <span className="line-clamp-1">{prototypeContent}</span>
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-slate-600 pt-0.5 border-t border-slate-100">
            <Users className="w-3 h-3 text-[#007A61] shrink-0" />
            <span className="truncate font-semibold">{studentSquad}</span>
          </div>
          {/* Financial Breakdown */}
          <div className="pt-1 border-t border-slate-100 space-y-0.5 text-[9.5px]">
            <div className="flex items-center justify-between text-slate-600 font-semibold">
              <span>Govt Grant:</span>
              <span className="font-bold text-slate-800">₹ {govtGrantNum.toLocaleString('en-IN')}</span>
            </div>
            {hasQuotedFee && (
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>🧪 Testing Fee:</span>
                <span className="font-black text-amber-700">{request.labChargesQuoted}</span>
              </div>
            )}
            {isAccepted && labFeeNum > 0 && (
              <div className="flex items-center justify-between text-[#007A61] font-black">
                <span>Net Balance:</span>
                <span>₹ {netUniBalance.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* 4. Attached Cloudinary PDF */}
      <td className="py-3.5 px-4 align-top">
        {pdfUrl ? (
          <div className="space-y-1">
            <a
              href={getPdfViewUrl(pdfUrl, pdfName)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition-all shadow-2xs group/btn cursor-pointer"
              title={pdfName}
            >
              <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate max-w-[100px]">{pdfName}</span>
              <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
            <span className="text-[9px] font-semibold text-[#007A61] block">
              ✓ Cloudinary PDF
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 italic">No PDF attached</span>
        )}
      </td>

      {/* 5. Status */}
      <td className="py-3.5 px-4 align-top">
        {isAccepted ? (
          <span className="text-[10px] font-extrabold text-[#007A61] flex items-center space-x-1 w-max">
            <Lock className="w-3 h-3 text-[#007A61]" />
            <span>{labFeeNum > 0 ? 'Fee Accepted' : 'Approved'}</span>
          </span>
        ) : isDeclined ? (
          <span className="text-[10px] font-extrabold text-rose-700 flex items-center space-x-1 w-max">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Fee Declined</span>
          </span>
        ) : hasQuotedFee ? (
          <span className="text-[10px] font-extrabold text-amber-700 flex items-center space-x-1 w-max animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Fee Quoted</span>
          </span>
        ) : isPending ? (
          <span className="text-[10px] font-extrabold text-amber-700 flex items-center space-x-1 w-max">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Request Sent</span>
          </span>
        ) : (
          <span className="text-[10px] font-extrabold text-[#007A61] flex items-center space-x-1 w-max">
            <ShieldCheck className="w-3 h-3 text-[#007A61]" />
            <span>Ready for Lab</span>
          </span>
        )}
        {(request?.assignedMentor || prototype?.industryMentor) && (
          <span className="mt-1 text-[9px] font-bold text-[#007A61] flex items-center space-x-1 w-max">
            <span>👤 {(request?.assignedMentor || prototype?.industryMentor).name}</span>
          </span>
        )}
      </td>

      {/* 6. Actions */}
      <td className="py-3.5 px-4 align-top text-right">
        <PartnerActionCell
          partner={partner}
          prototype={prototype}
          request={request}
          onSelectPartner={onSelectPartner}
          onOpenSendRequest={onOpenSendRequest}
          onApproveAmount={onApproveAmount}
        />
      </td>
    </tr>
  );
};

export default PartnerPrototypeRow;
