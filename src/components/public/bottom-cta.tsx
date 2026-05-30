import { ArrowRight } from 'lucide-react';

const BottomCtaSection = () => {
  const img = (id: string, w = 1200) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&sat=-100`;

  return (
    <section
      id="harga"
      className="scroll-mt-24 relative overflow-hidden bg-black text-white"
    >
      <img
        src={img('photo-1521737604893-d14cc237f11d', 1600)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:20px_20px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-1/4 h-56 w-56 rounded-full border border-white/15 motion-safe:animate-[drift_28s_ease-in-out_infinite]"
      />
      <div
        className="relative mx-auto max-w-4xl px-6 py-24 text-center"
        data-animate
      >
        <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
          Siap Menyederhanakan Bisnis Online Anda?
        </h2>
        <p className="mt-4 text-white/70">
          Bergabunglah dengan ribuan seller yang sudah mempercayakan operasional
          mereka pada Simponi.
        </p>
        <a
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-base font-semibold text-black transition-all hover:-translate-y-0.5 hover:opacity-90"
        >
          Daftar Sekarang
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default BottomCtaSection;
