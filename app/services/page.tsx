import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServicesContent from '@/components/services/ServicesContent';

export const metadata = {
  title: 'Services & Pricing | Auto-Docs Mobile Mechanic Arizona',
  description:
    'Transparent, flat-rate pricing for all auto repair services. Oil changes, brakes, diagnostics, batteries, AC, and more — all done at your location.',
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ServicesContent />
      </main>
      <Footer />
    </>
  );
}
