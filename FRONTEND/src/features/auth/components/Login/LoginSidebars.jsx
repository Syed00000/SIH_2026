import React from 'react';
import { Card, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Lightbulb, CheckCircle2, FileText } from 'lucide-react';

const WHY_REPORT_POINTS = [
  'Help solve real issues in your community',
  'Connect with expert institutions and innovators',
  'Contribute to a better and more inclusive Jharkhand',
  'Track the progress of your submitted problem'
];

const SUBMISSION_TIPS = [
  'Be clear and specific about the problem',
  'Mention the exact location',
  'Add photos or documents if available',
  'Describe how many people are affected',
  "You don't need to suggest a technical solution (leave that to the experts!)"
];

export const LoginSidebars = () => {
  return (
    <div className="w-full lg:w-1/2 max-w-md flex flex-col gap-5 justify-center lg:justify-start">
      {/* Why Report a Problem? */}
      <Card className="bg-white rounded-none shadow-sm border border-gray-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-gray-700" />
            <h3 className="text-[15px] font-black text-gray-900 tracking-tight">Why Report a Problem?</h3>
          </div>
          <ul className="space-y-3">
            {WHY_REPORT_POINTS.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span className="text-[12.5px] text-gray-700 font-medium leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tips for a Better Submission */}
      <Card className="bg-blue-50/50 rounded-none shadow-sm border border-blue-100">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-[15px] font-black text-slate-800 tracking-tight">Tips for a Better Submission</h3>
          </div>
          <ul className="space-y-3">
            {SUBMISSION_TIPS.map((tip, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span className="text-[12.5px] text-slate-700 font-medium leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSidebars;
