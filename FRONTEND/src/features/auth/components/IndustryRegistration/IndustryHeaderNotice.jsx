import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';

export const IndustryHeaderNotice = ({ onNavigate, submitError }) => {
  return (
    <>
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
          className="inline-flex items-center text-xs font-bold text-black hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-md shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-black" />
          <span>Back to Login</span>
        </button>
        
        <span className="text-xs font-bold text-black">
          Government of Jharkhand &bull; JoharSetu
        </span>
      </div>

      {/* Portal Header Card */}
      <Card className="bg-white border border-slate-300 shadow-sm rounded-xl p-6 text-center text-black">
        <div className="flex justify-center mb-3">
          <img
            src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
            alt="Government of Jharkhand"
            className="w-14 h-14 object-contain"
          />
        </div>
        <h1 className="text-xl font-extrabold text-black tracking-tight">
          Industry & Partner Registration Form
        </h1>
        <p className="text-black font-semibold text-xs mt-1">
          Department of Higher & Technical Education, Government of Jharkhand
        </p>
        <p className="text-black font-medium text-xs mt-2 max-w-xl mx-auto leading-relaxed">
          Fill out the form below to apply for industry partnership. Your application will be verified by the department, and login credentials will be emailed to your official contact.
        </p>
      </Card>

      {/* Government Policy Notice */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 text-xs text-black flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-black">Important Notice:</span>
          <p className="text-black font-medium leading-relaxed text-[12px]">
            You do not need to create a password right now. After government verification, official login credentials will be generated and emailed to your Contact Person’s official email.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3.5 text-xs font-bold text-red-900 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
    </>
  );
};

export default IndustryHeaderNotice;
