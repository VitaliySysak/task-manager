import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type { AuthFormValues } from '@/schemas/auth';

import { FormInput } from '@/components/shared/form-input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { loginFormSchema, registerFormSchema } from '@/schemas/auth';
import { useLoginMutation, useRegisterMutation } from '@/store/auth/auth.api';

import { Button } from '../ui/button';

type Props = {
  className?: string;
  type: 'sign-up' | 'sign-in';
  open: boolean;
  setOpen: (variable: boolean) => void;
};

export const AuthModal: React.FC<Props> = ({ className, type, open, setOpen }) => {
  const navigate = useNavigate();

  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const isLoading = type === 'sign-up' ? isRegisterLoading : isLoginLoading;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(type === 'sign-up' ? registerFormSchema : loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    form.reset({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
    });
  }, [type, open, form]);

  const onSubmit = async (data: AuthFormValues) => {
    try {
      if (type === 'sign-up') {
        await register({
          fullName: data.fullName!,
          email: data.email,
          password: data.password,
        }).unwrap();
      }
      else {
        await login({
          email: data.email,
          password: data.password,
        }).unwrap();
      }

      setOpen(false);
      navigate('/');
    }
    catch (error) {
      toast.error('Server error, try again');
      console.error('Error while execution onSubmit:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className={cn('w-175 min-h-100 translate-y-[-70%] sm:translate-y-[-50%]', className)}>
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          {type === 'sign-up' ? 'Register a new account' : 'Login to your account'}
        </DialogDescription>

        <section>
          <FormProvider {...form}>
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              <header className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-[#131619]">
                  {type === 'sign-up' ? 'Create your account' : 'Log in to Task Manager'}
                </h1>
                <Button
                  disabled={isLoading}
                  loading={isLoading}
                  className="rounded-full font-bold min-w-25"
                  type="submit"
                >
                  {type === 'sign-up' ? 'Sign up' : 'Sign in'}
                </Button>
              </header>

              <div className="flex flex-col gap-4">
                {type === 'sign-up' && <FormInput name="fullName" label="Full Name" placeholder="John Doe" />}

                <FormInput name="email" label="E-mail" placeholder="example@mail.com" />
                <FormInput name="password" label="Password" type="password" />

                {type === 'sign-up' && <FormInput name="confirmPassword" label="Confirm Password" type="password" />}
              </div>
            </form>
          </FormProvider>
        </section>
      </DialogContent>
    </Dialog>
  );
};
