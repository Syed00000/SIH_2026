import React from 'react';
import { CitizenOverview } from './CitizenOverview.jsx';
import { CitizenChallenges } from './CitizenChallenges.jsx';
import { RoleProfile } from '../RoleProfile.jsx';
import { AccountSettings } from '../AccountSettings.jsx';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card.jsx';

export const CitizenDashboard = ({ activeTab, setActiveTab, user, role }) => {
  if (activeTab === 'overview') {
    return <CitizenOverview user={user} role={role} setActiveTab={setActiveTab} />;
  }

  if (activeTab === 'challenges') {
    return <CitizenChallenges user={user} setActiveTab={setActiveTab} />;
  }

  if (activeTab === 'profile') {
    return <RoleProfile user={user} />;
  }

  if (activeTab === 'settings') {
    return <AccountSettings user={user} />;
  }

  if (activeTab === 'explore-challenges') {
    return (
      <Card className="bg-white border border-slate-200 text-center p-8 max-w-2xl mx-auto rounded-md shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Explore Societal Challenges
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs max-w-md mx-auto">
            Browse and explore other local societal challenges filed across different districts and blocks of Jharkhand.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <Card className="bg-white border border-slate-200 text-center p-8 max-w-md mx-auto rounded-md shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Notifications</CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            No new notifications at this time.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (activeTab === 'help') {
    return (
      <Card className="bg-white border border-slate-200 text-center p-8 max-w-2xl mx-auto rounded-md shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Help & Support</CardTitle>
          <CardDescription className="text-slate-500 text-xs max-w-md mx-auto">
            Get in touch with the Societal Innovation Hub support team for assistance with filing challenges or portal access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <CitizenOverview user={user} role={role} setActiveTab={setActiveTab} />;
};

export default CitizenDashboard;
