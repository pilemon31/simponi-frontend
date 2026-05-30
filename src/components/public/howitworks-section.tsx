import { ArrowRight, RefreshCw, Rocket, UserPlus } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Daftar & Hubungkan Akun',
      desc: 'Buat akun Simponi lalu hubungkan toko Shopee, TikTok, dan website Anda.',
    },
    {
      icon: RefreshCw,
      title: 'Sistem Melakukan Sinkronisasi',
      desc: 'Produk, stok, dan pesanan ditarik otomatis ke satu dashboard.',
    },
    {
      icon: Rocket,
      title: 'Mulai Kelola Penjualan',
      desc: 'Proses pesanan dan pantau performa semua channel dari satu tempat.',
    },
  ];
  return (
    <section
      id="cara-kerja"
      className="scroll-mt-24 relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle,#000_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-black/5 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center" data-animate>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Cara Kerja
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            Mulai Kurang dari 5 Menit
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tiga langkah sederhana untuk menyatukan seluruh channel penjualan
            Anda.
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative"
              data-animate
              style={{ ['--reveal-delay' as string]: `${i * 120}ms` }}
            >
              <div className="h-full rounded-xl border border-border bg-background p-8 transition-all hover:-translate-y-1 hover:border-black hover:shadow-[0_15px_40px_-20px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black text-black">
                    <s.icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className="text-4xl font-extrabold text-black/10">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-black">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight
                  className="absolute -right-6 top-1/2 hidden -translate-y-1/2 text-black/30 md:block"
                  size={28}
                  strokeWidth={1.5}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
