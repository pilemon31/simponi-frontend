import { cn } from '@/lib/utils';
import AuthImageLight from '@/assets/images/auth-image-light.svg';
import AuthImageDark from '@/assets/images/auth-image-dark.svg';
import LogoLight from '@/assets/logo-lightmode.svg';
import LogoDark from '@/assets/logo-darkmode.svg';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import SignUpForm from '@/components/auth/signup-form';

const SignUpPage = () => {
  return (
    <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className={cn(
          'relative h-full overflow-hidden bg-muted max-lg:hidden flex items-center justify-center',
        )}
      >
        <img
          src={AuthImageLight}
          className="w-3/4 h-auto max-w-lg dark:hidden"
          alt="auth-image"
        />
        <img
          src={AuthImageDark}
          className="w-3/4 h-auto max-w-lg hidden dark:block"
          alt="auth-image"
        />
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-row justify-between space-y-2 py-8 max-w-108"></div>
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
          <div className="w-full flex flex-row justify-between items-center">
            <img
              src={LogoLight}
              alt="logo"
              className="w-40 xs:w-42 sm:w-44 md:w-40 lg:w-44 dark:hidden"
            />
            <img
              src={LogoDark}
              alt="logo"
              className="w-40 xs:w-42 sm:w-44 md:w-40 lg:w-44 hidden dark:block"
            />
            <ThemeSwitch></ThemeSwitch>
          </div>
          <div className="flex flex-col space-y-2 text-start">
            <h2 className="text-2xl font-bold tracking-tight">Daftar</h2>
            <p className="text-sm ">
              Selamat datang! Masukkan alamat email dan password anda untuk
              mendaftar ke sistem
            </p>
          </div>
          <SignUpForm redirectTo="/signin"></SignUpForm>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Dengan menekan daftar, anda setuju terhadap{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Syarat dan Ketentuan
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Kebijakan Privasi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
