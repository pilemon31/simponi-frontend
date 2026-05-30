import { ArrowRight, Check, Clock, TrendingUp, Users } from 'lucide-react';

const ShowcaseSection = () => {
  const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&sat=-100`;

  const bullets = [
    'Dashboard real-time untuk semua channel',
    'Notifikasi otomatis saat stok menipis',
    'Cetak resi massal dalam satu klik',
    'Export laporan ke Excel & PDF',
  ];
  const stats = [
    { icon: TrendingUp, value: '+38%', label: 'Growth mingguan' },
    { icon: Users, value: '2.000+', label: 'Seller aktif' },
    { icon: Clock, value: '< 3 menit', label: 'Proses 200 resi' },
  ];
  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-8 h-40 w-40 rounded-full border border-black/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-black/5 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div className="relative" data-animate="left">
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)]">
            <img
              src={img('photo-1551288049-bebda4e38f71', 1200)}
              alt="Dashboard analitik Simponi"
              className="aspect-[4/3] w-full object-cover grayscale"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-xl border border-border bg-black p-5 text-white shadow-xl md:block">
            <p className="text-xs uppercase tracking-wider text-white/60">
              Penjualan minggu ini
            </p>
            <p className="mt-1 text-2xl font-extrabold">+38%</p>
          </div>
        </div>
        <div
          data-animate="right"
          style={{ ['--reveal-delay' as string]: '150ms' }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Dirancang untuk pertumbuhan
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            Lihat seluruh bisnis Anda dalam satu layar.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tidak perlu lagi membuka 5 tab marketplace berbeda. Semua data
            penjualan, stok, dan pelanggan tersusun rapi dalam dashboard yang
            mudah dipahami.
          </p>
          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-sm text-black">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white">
                  <Icon size={16} strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-bold text-black">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-black px-6 py-3 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-black hover:text-white"
          >
            Jelajahi Dashboard <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
