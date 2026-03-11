import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { sleep, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PasswordInput from '../shared/password-input';

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Masukkan alamat email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Masukkan password')
    .min(7, 'Password minimal 7 karakter'),
});

interface SignInFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

const SignInForm = ({ className, redirectTo, ...props }: SignInFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    toast.promise(sleep(2000), {
      loading: 'Masuk ke akun...',
      success: () => {
        setIsLoading(false);
        const mockUser = {
          accountNo: 'ACC001',
          email: data.email,
          role: ['user'],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        };

        auth.setUser(mockUser);
        auth.setAccessToken('mock-access-token');

        const targetPath = redirectTo || '/';
        navigate(targetPath, { replace: true });

        return `Selamat datang kembali, ${data.email}!`;
      },
      error: 'Error',
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('w-full flex flex-col justify-start gap-5', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Lupa password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='cursor-pointer' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Masuk
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
