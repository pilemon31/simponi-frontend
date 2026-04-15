import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
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
import { signInSchema } from '@/schemas/auth.schema';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/services/auth.service';
import { getProfile } from '@/services/user.service';

interface SignInFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

const SignInForm = ({ className, redirectTo, ...props }: SignInFormProps) => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getProfileMutation = useMutation({ mutationFn: getProfile });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (result) => {
      const toastId = toast.loading('Masuk ke akun...');
      let signedInUserName = 'user';

      if ('status' in result && result.status) {
        const accessToken = result.data?.access_token;
        const refreshToken = result.data?.refresh_token;

        if (!accessToken || !refreshToken) {
          return;
        }

        auth.setAccessToken(accessToken);
        auth.setRefreshToken(refreshToken);

        console.log('Auth after setting tokens:', auth);

        try {
          const profile = await getProfileMutation.mutateAsync();
          console.log('Profile:', profile);
          console.log('Auth:', auth);

          if (profile && profile.status) {
            auth.setUser(profile.data ?? null);
            signedInUserName = profile.data?.name ?? signedInUserName;
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // Silently ignore profile fetch errors
        }

        const targetPath = redirectTo || '/';
        navigate(targetPath, { replace: true });
        toast.success(`Selamat datang kembali, ${signedInUserName}!`, {
          id: toastId,
        });
      } else {
        toast.error(result.error || result.message || 'Sign In failed', {
          id: toastId,
        });
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      toast.error(message);
    },
  });

  function onSubmit(data: z.infer<typeof signInSchema>) {
    signInMutation.mutate(data);
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
              <Link
                to="/forgot-password"
                className="absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75"
              >
                Lupa password?
              </Link>
            </FormItem>
          )}
        />
        <Button
          className="cursor-pointer"
          disabled={signInMutation.isPending || getProfileMutation.isPending}
        >
          {signInMutation.isPending || getProfileMutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogIn />
          )}
          Masuk
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
