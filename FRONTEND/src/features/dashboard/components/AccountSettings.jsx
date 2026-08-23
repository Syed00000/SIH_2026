import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/card.jsx';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Badge } from '../../../shared/components/ui/badge.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';

export const AccountSettings = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsError(true);
      return;
    }
    setMessage('Password changed successfully');
    setIsError(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Account & Security Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Account Status
              </span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-900 font-bold text-xs">{user?.accountStatus || 'ACTIVE'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Email Verification
              </span>
              <div>
                <Badge variant={user?.emailVerified ? 'success' : 'warning'}>
                  {user?.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-6 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Change Password
            </span>

            {message && (
              <Alert variant={isError ? 'error' : 'success'} title={isError ? 'Error' : 'Success'}>
                {message}
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Current Password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="focus:ring-slate-900 focus:border-slate-900"
              />
              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="focus:ring-slate-900 focus:border-slate-900"
              />
              <Input
                label="Confirm New Password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="text-xs font-semibold px-5 py-2 rounded-md">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
