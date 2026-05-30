import { ArrowRight, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';

const HeroSection = () => {
  const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&sat=-100`;

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,#000_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-black/10 blur-3xl motion-safe:animate-[drift_20s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/5 blur-3xl motion-safe:animate-[drift_24s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 right-12 h-24 w-24 rounded-full border border-black/10 motion-safe:animate-[float_10s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-8 h-16 w-16 rounded-full border border-black/10 motion-safe:animate-[float_12s_ease-in-out_infinite]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div data-animate="left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            SaaS Omnichannel #1 untuk Brand Lokal
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-black md:text-5xl lg:text-6xl">
            Kelola Penjualan{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Shopee, TikTok &amp; Web</span>
              <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-black/10" />
            </span>{' '}
            dalam Satu Dashboard.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tingkatkan efisiensi bisnis Anda. Sinkronisasi stok otomatis,
            manajemen pesanan terpusat, dan pantau performa penjualan tanpa
            harus berpindah-pindah tab.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              Mulai Integrasi Sekarang <ArrowRight size={18} />
            </a>
            <span className="text-sm text-muted-foreground">
              Gratis 14 hari · Tanpa kartu kredit
            </span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {[
              { icon: Zap, label: 'Setup < 5 menit' },
              { icon: ShieldCheck, label: 'Data terenkripsi' },
              { icon: Sparkles, label: 'Auto-sync 24/7' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-black shadow-sm"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/15 bg-white">
                  <Icon size={14} strokeWidth={2} />
                </span>
                {label}
              </span>
            ))}
          </div>

          {/* trust avatars */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[
                'photo-1494790108377-be9c29b29330',
                'photo-1500648767791-00dcc994a43e',
                'photo-1438761681033-6461ffad8d80',
                'photo-1472099645785-5658abf4ff4e',
              ].map((id) => (
                <img
                  key={id}
                  src={img(id, 80)}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-white object-cover grayscale"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-black">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
                <span className="ml-1 font-semibold">4.9/5</span>
              </div>
              <p className="text-muted-foreground">Dipercaya 2.000+ seller</p>
            </div>
          </div>
        </div>

        {/* Hero visual collage */}
        <div
          data-animate="right"
          style={{ ['--reveal-delay' as string]: '150ms' }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]">
            <img
              src={img('photo-1556742049-0cfed4f6a45d', 1000)}
              alt="Owner brand lokal mengelola toko online"
              className="h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/70 px-4 py-3 text-white backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-white/60">
                Live order
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                +Rp 12.450.000 hari ini · 3 channel sinkron
              </p>
            </div>
          </div>

          {/* floating stat card */}
          <div className="absolute -left-4 top-10 hidden w-48 rounded-xl border border-border bg-white p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] md:block motion-safe:animate-[float_6s_ease-in-out_infinite]">
            <p className="text-xs text-muted-foreground">Stok tersinkron</p>
            <p className="mt-1 text-2xl font-extrabold text-black">99.8%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
              <div className="h-full w-[99%] rounded-full bg-black" />
            </div>
          </div>

          {/* floating channel card */}
          <div className="absolute -right-4 bottom-16 hidden w-52 rounded-xl border border-border bg-white p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] md:block motion-safe:animate-[float_7s_ease-in-out_infinite] motion-safe:[animation-delay:200ms]">
            <p className="text-xs text-muted-foreground">Channel aktif</p>
            <div className="mt-2 flex items-center gap-2">
              {['S', 'T', 'W'].map((c) => (
                <span
                  key={c}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white text-xs font-bold text-black"
                >
                  {c}
                </span>
              ))}
              <span className="text-sm font-semibold text-black">+3 lain</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
