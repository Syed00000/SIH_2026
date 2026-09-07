import React from 'react';
import { FileText, ExternalLink, Users, MapPin, CheckCircle2, Clock, XCircle } from 'lucide-react';
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
  const prototypeContent = prototype.prototypeData?.content || 'Telemetry hardware & alert prototype.';
  const pdfUrl = prototype.pdfUrl || prototype.prototypeData?.pdfUrl;
  const pdfName = prototype.pdfName || prototype.prototypeData?.pdfName || 'Blueprint.pdf';

  const isAccepted = request?.quoteStatus === 'Accepted' || (request?.status === 'Approved' && !request?.labChargesQuoted);
  const isDeclined = request?.quoteStatus === 'Declined' || request?.status === 'Fee Declined';
  const isPending = request?.status === 'Pending';
  const hasQuotedFee = Boolean(request?.labChargesQuoted) && !isDeclined && !isAccepted;

  const govtGrantNum = Number(String(prototype.originalGovernmentGrant || prototype.sanctionedBudget || prototype.disbursedAmount || '80000').replace(/[^\d]/g, '')) || 80000;
  const labFeeNum = Number(String(request?.labChargesQuoted || prototype.testingLabFee || '0').replace(/[^\d]/g, '')) || 0;
  const netUniBalance = isAccepted && labFeeNum > 0 ? Math.max(0, govtGrantNum - labFeeNum) : govtGrantNum;

  const mentorName = (request?.assignedMentor || prototype?.industryMentor)?.name;

  return (
    <tr
      className="hover:bg-slate-50/70 transition-colors group cursor-pointer border-b border-slate-100 text-left"
      onClick={() => onSelectPartner(partner, prototype)}
    >
      {/* 1. Partner Entity */}
      <td className="py-4 px-4 align-middle">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#007A61] group-hover:text-white group-hover:border-[#007A61] transition-colors">
            {partner.logoText || partnerName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-slate-900 text-xs truncate max-w-[170px]" title={partnerName}>
              {partnerName}
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                {category}
              </span>
              <span className="flex items-center space-x-1 text-[10.5px] text-slate-400">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[110px]">{location}</span>
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Ground Problem Statement */}
      <td className="py-4 px-4 align-middle">
        <div className="space-y-1 max-w-[240px]">
          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[9.5px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
              {prototype.projectId || prototype.id}
            </span>
            <span className="font-extrabold text-slate-900 text-xs truncate group-hover:text-[#007A61] transition-colors" title={problemTitle}>
              {problemTitle}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed" title={problemStatement}>
            {problemStatement}
          </p>
        </div>
      </td>

      {/* 3. Solution Prototype Details */}
      <td className="py-4 px-4 align-middle">
        <div className="space-y-1 max-w-[230px]">
          <div className="font-bold text-slate-800 text-xs truncate" title={prototypeContent}>
            {prototypeContent}
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <Users className="w-3 h-3 text-purple-600 shrink-0" />
            <span className="font-semibold text-slate-700 truncate">{studentSquad}</span>
          </div>
          <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-medium pt-0.5">
            <span>Grant: <strong className="text-slate-800 font-bold">₹{govtGrantNum.toLocaleString('en-IN')}</strong></span>
            {hasQuotedFee && (
              <span>• Fee: <strong className="text-amber-700 font-bold">{request.labChargesQuoted}</strong></span>
            )}
            {isAccepted && labFeeNum > 0 && (
              <span>• Net: <strong className="text-[#007A61] font-bold">₹{netUniBalance.toLocaleString('en-IN')}</strong></span>
            )}
          </div>
        </div>
      </td>

      {/* 4. Technical Blueprint (PDF) */}
      <td className="py-4 px-4 align-middle whitespace-nowrap">
        {pdfUrl ? (
          <a
            href={getPdfViewUrl(pdfUrl, pdfName)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs group/btn cursor-pointer"
            title={`View ${pdfName}`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate max-w-[100px]">{pdfName}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover/btn:text-slate-700 transition-colors" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">No Document</span>
        )}
      </td>

      {/* 5. Status */}
      <td className="py-4 px-4 align-middle whitespace-nowrap">
        <div className="space-y-1">
          {isAccepted ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-[#007A61]" />
              <span>Fee Accepted</span>
            </span>
          ) : isDeclined ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              <XCircle className="w-3 h-3 text-rose-600" />
              <span>Fee Declined</span>
            </span>
          ) : hasQuotedFee ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Fee Quoted</span>
            </span>
          ) : isPending ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Request Sent</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              <span>Ready for Lab</span>
            </span>
          )}

          {mentorName && (
            <div className="text-[10px] font-semibold text-slate-500">
              Mentor: {mentorName}
            </div>
          )}
        </div>
      </td>

      {/* 6. Actions */}
      <td className="py-4 px-4 align-middle text-right whitespace-nowrap">
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
