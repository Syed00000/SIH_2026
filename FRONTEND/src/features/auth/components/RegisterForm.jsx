import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas.js';
import { useRegister } from '../hooks.js';
import { Input } from '../../../shared/components/ui/input.jsx';
import { Button } from '../../../shared/components/ui/button.jsx';
import { Alert } from '../../../shared/components/ui/alert.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/components/ui/card.jsx';

export function RegisterForm({ onSuccess }) {
  const { mutate: registerUser, isPending, error, isSuccess } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = (data) => {
    registerUser(data, {
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
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Register a new account on the portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <Alert variant="error" title="Registration Failed">
              {error.message || 'Verify your information and try again.'}
            </Alert>
          )}

          {isSuccess && (
            <Alert variant="success" title="Account Created">
              Verification email sent. Check your inbox to proceed.
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

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
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
