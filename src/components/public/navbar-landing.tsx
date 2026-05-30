import { useState } from 'react';
import SimponiLogo from '@/assets/logo-lightmode.svg';
import { Menu, X } from 'lucide-react';

const NavbarLanding = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
    { href: '#harga', label: 'Harga' },
    { href: '#faq', label: 'FAQ' },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <img src={SimponiLogo} alt="Simponi Logo" className="h-full py-4" />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium text-foreground/70 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-foreground after:transition-all hover:text-foreground hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="rounded-md border border-black px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
          >
            Masuk
          </a>
        </div>
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-2 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground hover:underline hover:font-semibold"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <a
                className="rounded-md border border-black px-4 py-2 text-center text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white duration-700"
                href="#"
              >
                Masuk
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarLanding;
