import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
import { signUpSchema } from '@/schemas/auth.schema';
import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/services/auth.service';
import { useNavigate } from 'react-router';

interface SignUpFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

const SignUpForm = ({ className, redirectTo, ...props }: SignUpFormProps) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: async (result) => {
      const toastId = toast.loading('Mendaftar...');

      if ('status' in result && result.status) {
        const targetPath = redirectTo || '/signin';
        navigate(targetPath, { replace: true });
        toast.success(`Selamat datang kembali`);
      } else {
        toast.error(
          result.error ||
            result.message ||
            'Gagal mendaftar, ada kesalahan pada sistem!',
          {
            id: toastId,
          },
        );
      }
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal mendaftar, ada kesalahan pada sistem!';
      toast.error(message);
    },
  });

  function onSubmit(data: z.infer<typeof signUpSchema>) {
    signUpMutation.mutate(data);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="john doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="cursor-pointer" disabled={signUpMutation.isPending}>
          {signUpMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogIn />
          )}
          Daftar
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
