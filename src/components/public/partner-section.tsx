const PartnerSection = () => {
  const partnerItems = [
    {
      name: 'Tiktok Shop',
      logo: 'https://www.pngmart.com/files/23/Tiktok-Logo-PNG-Photo.png',
    },
    {
      name: 'Shopee',
      logo: 'https://www.musicarms.net/wp-content/uploads/2021/02/shopee-Logo.png',
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border bg-muted/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full border border-black/10"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-12" data-animate>
        <p className="text-center text-md text-muted-foreground">
          Terintegrasi mulus dengan platform e-commerce favorit Anda:
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-80">
          {partnerItems.map((partner) => (
            <img
              key={partner.name}
              src={partner.logo}
              alt={partner.name}
              className="min-h-[70px] max-h-[90px] w-auto opacity-80 transition-all hover:opacity-100 hover:scale-105"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
