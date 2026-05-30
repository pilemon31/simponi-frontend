import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="text-base font-semibold text-black md:text-lg">
          {q}
        </span>
        {open ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      {open && (
        <p className="pb-6 pr-8 text-sm leading-relaxed text-muted-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 motion-safe:duration-300">
          {a}
        </p>
      )}
    </div>
  );
};

export const FaqSection = () => {
  const faqs = [
    {
      q: 'Apakah saya perlu keahlian teknis untuk menghubungkan Shopee & TikTok?',
      a: 'Sama sekali tidak. Cukup login ke akun marketplace Anda melalui dashboard kami, dan sistem akan mengotorisasi integrasi secara otomatis.',
    },
    {
      q: 'Bagaimana jika ada pelanggan yang membeli produk bersamaan di Shopee dan TikTok?',
      a: 'Sistem kami akan langsung memotong stok di semua platform dalam hitungan detik untuk mencegah overselling (barang kosong).',
    },
    {
      q: 'Apakah data pelanggan dan toko saya aman?',
      a: 'Kami menggunakan enkripsi tingkat bank dan mematuhi kebijakan privasi ketat. Data Anda 100% aman dan hanya digunakan untuk keperluan dashboard Anda.',
    },
  ];
  return (
    <section
      id="faq"
      className="scroll-mt-24 relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-8 h-48 w-48 rounded-full border border-black/10"
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24">
        <div className="text-center" data-animate>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tidak menemukan jawaban? Hubungi tim kami kapan saja.
          </p>
        </div>
        <div className="mt-12">
          {faqs.map((f, index) => (
            <div
              key={f.q}
              data-animate
              style={{ ['--reveal-delay' as string]: `${index * 120}ms` }}
            >
              <FaqItem {...f} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
