import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const IndustrySuccessScreen = ({ applicationSuccess, onReset, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <Card className="max-w-lg w-full bg-white border border-slate-300 shadow-md rounded-xl p-6 sm:p-8 text-center animate-fadeIn text-black">
        <div className="flex justify-center mb-4">
          <img
            src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
            alt="Government of Jharkhand"
            className="w-14 h-14 object-contain"
          />
        </div>

        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-300">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-black tracking-tight">
          Application Submitted Successfully
        </h2>
        <p className="text-black text-xs mt-1.5 leading-relaxed font-medium">
          Your application for <strong>{applicationSuccess.legalName}</strong> has been received by the Government of Jharkhand.
        </p>

        <div className="my-5 p-4 bg-slate-50 border border-slate-300 rounded-lg text-left space-y-2.5 text-xs text-black">
          <div className="flex justify-between items-center">
            <span className="text-black font-semibold">Application Reference ID:</span>
            <span className="font-mono font-bold text-black bg-white px-2 py-0.5 rounded border border-slate-300">
              {applicationSuccess.industryId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black font-semibold">Official Email:</span>
            <span className="font-bold text-black">{applicationSuccess.officialEmail}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-black font-semibold">Status:</span>
            <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-950 font-bold rounded border border-amber-300 text-[11px]">
              Pending Government Review
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 border border-blue-300 rounded-lg text-left text-xs text-black space-y-1 mb-6">
          <div className="flex items-center font-bold text-black">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-700 shrink-0" />
            <span>What happens next?</span>
          </div>
          <p className="text-[12px] leading-relaxed text-black font-medium">
            Government officials will review your organization details. Once approved, your portal login email and password will be sent directly to <strong>{applicationSuccess.officialEmail}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
            className="flex-1 bg-black hover:bg-slate-900 text-white font-bold py-2 rounded-md text-xs"
          >
            Go to Portal Login
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1 border-slate-400 text-black hover:bg-slate-100 font-bold py-2 rounded-md text-xs"
          >
            Submit Another Form
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IndustrySuccessScreen;
