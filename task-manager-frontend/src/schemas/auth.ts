import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email().max(50),
  password: z.string().min(8).max(50),
});

export const registerFormSchema = loginFormSchema
  .extend({
    fullName: z.string().min(2, { message: 'Enter your name' }).max(50),
    confirmPassword: z.string().min(8).max(50),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'passwords doesn\'t match',
    path: ['confirmPassword'],
  });

export type TRegisterFormValues = z.infer<typeof registerFormSchema>;
export type TLoginFormValues = z.infer<typeof loginFormSchema>;

export type AuthFormValues = {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
};
