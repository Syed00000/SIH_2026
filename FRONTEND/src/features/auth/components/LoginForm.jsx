import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas.js';
import { useLogin, useRedirectIfAuthenticated } from '../hooks.js';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';

export function LoginForm({ onSuccess }) {
  const { isLoading: isAuthLoading, user } = useRedirectIfAuthenticated('/');
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isAuthLoading) {
    return <div className="text-center py-6 text-slate-500 text-sm">Checking session...</div>;
  }

  if (user) {
    return null;
  }

  const onSubmit = (data) => {
    login(data, {
      onSuccess: (responseData) => {
        if (onSuccess) {
          onSuccess(responseData);
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Access the university portal dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <Alert variant="error" title="Login Failed">
              {error.message || 'Check your credentials and try again.'}
            </Alert>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@university.edu"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" variant="primary" isLoading={isPending} className="w-full mt-2">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
