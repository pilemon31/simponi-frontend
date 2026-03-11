import { Logo } from '@/assets/logo';
import { cn } from '@/lib/utils';
import dashboardDark from '@/assets/images/dashboard-dark.png';
import dashboardLight from '@/assets/images/dashboard-light.png';
import SignInForm from '@/components/auth/signin-form';

const AuthPage = () => {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>Simponi Omnichannel</h1>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-5'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-2xl font-bold tracking-tight'>Masuk</h2>
            <p className='text-sm '>
              Selamat datang kembali! Masukkan alamat email dan password anda
              untuk masuk ke sistem
            </p>
          </div>
          <SignInForm redirectTo='/'></SignInForm>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Dengan menekan masuk, anda setuju terhadap{' '}
            <a
              href='#'
              className='underline underline-offset-4 hover:text-primary'
            >
              Syarat dan Ketentuan
            </a>{' '}
            and{' '}
            <a
              href='#'
              className='underline underline-offset-4 hover:text-primary'
            >
              Kebijakan Privasi
            </a>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative h-full overflow-hidden bg-muted max-lg:hidden',
          '[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none',
        )}
      >
        <img
          src={dashboardLight}
          className='dark:hidden'
          width={1024}
          height={1151}
          alt='Shadcn-Admin'
        />
        <img
          src={dashboardDark}
          className='hidden dark:block'
          width={1024}
          height={1138}
          alt='Shadcn-Admin'
        />
      </div>
    </div>
  );
};

export default AuthPage;
