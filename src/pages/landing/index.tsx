import { useEffect } from 'react';
import BottomCtaSection from '@/components/public/bottom-cta';
import { FaqSection } from '@/components/public/faq-section';
import FooterSection from '@/components/public/footer-section';
import HeroSection from '@/components/public/hero-section';
import HowItWorksSection from '@/components/public/howitworks-section';
import FeatureSection from '@/components/public/main-feature-section';
import NavbarLanding from '@/components/public/navbar-landing';
import PartnerSection from '@/components/public/partner-section';
import ShowcaseSection from '@/components/public/showcase-section';
import TestimonialSection from '@/components/public/testimonial-section';

const LandingPage = () => {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-animate]'),
    );

    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarLanding />
      <main>
        <HeroSection />
        <PartnerSection />
        <FeatureSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <TestimonialSection />
        <FaqSection />
        <BottomCtaSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default LandingPage;
