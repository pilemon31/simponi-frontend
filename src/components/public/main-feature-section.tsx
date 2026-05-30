import { Box, LineChart, ShoppingCart } from 'lucide-react';

const FeatureSection = () => {
  const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&sat=-100`;

  const items = [
    {
      icon: Box,
      title: 'Sinkronisasi Stok Real-time',
      desc: 'Stok otomatis terupdate di Shopee, TikTok, dan Web saat ada pembelian. Tidak ada lagi overselling.',
      image: 'photo-1586528116311-ad8dd3c8310d',
    },
    {
      icon: ShoppingCart,
      title: 'Manajemen Pesanan Terpusat',
      desc: 'Proses pesanan, cetak resi, dan lacak pengiriman dari satu tempat — efisien dan rapi.',
      image: 'photo-1607082348824-0a96f2a4b9da',
    },
    {
      icon: LineChart,
      title: 'Analitik & Laporan Pintar',
      desc: 'Pantau produk terlaris dan total pendapatan dari semua channel secara instan.',
      image: 'photo-1551288049-bebda4e38f71',
    },
  ];
  return (
    <section
      id="fitur"
      className="scroll-mt-24 relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,#000_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-black/5 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center" data-animate>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Fitur Unggulan
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            Satu Platform untuk Semua Kebutuhan Operasional Anda
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dirancang untuk seller modern yang ingin tumbuh tanpa rumit.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc, image }, index) => (
            <div
              key={title}
              data-animate
              style={{ ['--reveal-delay' as string]: `${index * 120}ms` }}
              className="group overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-black hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)]"
            >
              <div className="relative h-44 overflow-hidden bg-muted">
                <img
                  src={img(image, 800)}
                  alt={title}
                  className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-black text-black">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-black">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
