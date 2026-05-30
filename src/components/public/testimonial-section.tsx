import { Quote } from 'lucide-react';

const TestimonialSection = () => {
  const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&sat=-100`;

  const items = [
    {
      quote:
        'Sejak pakai Simponi, tim CS kami tidak pernah lagi salah kirim karena overselling. Stok benar-benar real-time.',
      name: 'Rania Pratiwi',
      role: 'Founder, Lumen Skincare',
      avatar: 'photo-1573496359142-b8d87734a5a2',
    },
    {
      quote:
        'Cetak resi 200 pesanan sekarang cuma 3 menit. Operasional jauh lebih ramping dan profit naik signifikan.',
      name: 'Adi Wirawan',
      role: 'Owner, Kopi Senandung',
      avatar: 'photo-1507003211169-0a1dd7228f2d',
    },
    {
      quote:
        'Laporan penjualan TikTok & Shopee jadi satu — saya bisa ambil keputusan stok harian tanpa pusing.',
      name: 'Maya Sari',
      role: 'CEO, Atelier Maya',
      avatar: 'photo-1544005313-94ddf0286df2',
    },
  ];
  return (
    <section
      id="testimoni"
      className="scroll-mt-24 relative overflow-hidden border-b border-border bg-muted/30"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-6 h-24 bg-[linear-gradient(120deg,transparent,rgba(0,0,0,0.06),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-12 h-40 w-40 rounded-full border border-black/10"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center" data-animate>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Testimoni
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            Dipercaya brand lokal yang sedang tumbuh
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, index) => (
            <figure
              key={t.name}
              data-animate
              style={{ ['--reveal-delay' as string]: `${index * 120}ms` }}
              className="flex h-full flex-col justify-between rounded-xl border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]"
            >
              <Quote className="text-black/20" size={28} />
              <blockquote className="mt-4 text-base leading-relaxed text-black">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={img(t.avatar, 120)}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover grayscale"
                />
                <div>
                  <p className="text-sm font-semibold text-black">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
