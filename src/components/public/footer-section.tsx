import SimponiLogo from '@/assets/logo-lightmode.svg';

const FooterSection = () => {
  const cols = [
    { title: 'Produk', links: ['Fitur', 'Integrasi', 'Harga', 'Changelog'] },
    { title: 'Perusahaan', links: ['Tentang', 'Karier', 'Blog', 'Kontak'] },
    {
      title: 'Bantuan',
      links: ['Pusat Bantuan', 'Dokumentasi', 'Status', 'Komunitas'],
    },
  ];
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <img src={SimponiLogo} alt="Simponi Logo" className="h-8" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Simponi Omnichannel adalah platform SaaS yang menyatukan Shopee,
              TikTok Shop, dan website Anda dalam satu dashboard cerdas.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-black">{c.title}</h4>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-black"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© 2026 Simponi Omnichannel. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">
              Syarat & Ketentuan
            </a>
            <a href="#" className="hover:text-black">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
