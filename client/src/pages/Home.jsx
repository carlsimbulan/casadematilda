import ProtectedLink from '../components/ProtectedLink.jsx';
import { Link } from 'react-router-dom';
import { BedDouble, Lock, Leaf } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import bgCasa from '../assets/bgcasa.png';
import readyToEsc from '../assets/readytoesc.png';
import logo from '../assets/logo.png';
import ScrollReveal from '../components/ScrollReveal.jsx';

const features = [
  {
    icon: BedDouble,
    title: 'Ultimate Comfort',
    description:
      'Luxuriously appointed rooms with premium bedding, climate control, and everything you need for a restful stay.',
  },
  {
    icon: Lock,
    title: 'Total Privacy',
    description:
      'Enjoy your own private space away from the crowds. Our property is exclusively yours during your stay.',
  },
  {
    icon: Leaf,
    title: 'Pure Relaxation',
    description:
      'Lush surroundings, peaceful ambiance, and curated amenities designed to melt stress away from the moment you arrive.',
  },
];

function FeatureCard({ icon: Icon, title, description, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        else setVisible(false);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transitionDelay: `${delay}ms`,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.6s ease, opacity 0.6s ease, box-shadow 0.3s ease',
        boxShadow: hovered
          ? '0 0 32px 6px rgba(245, 158, 11, 0.35), 0 8px 32px rgba(0,0,0,0.12)'
          : '0 2px 12px rgba(0,0,0,0.08)',
      }}
      className="bg-white rounded-2xl p-8 text-center cursor-default"
    >
      <div className="flex justify-center mb-4">
        <div
          style={{
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
          }}
          className="bg-amber-100 p-4 rounded-2xl"
        >
          <Icon className="w-8 h-8 text-amber-600" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
      <p className="text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero Section — bg stays, only inner content animates */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(28,25,23,0.45), rgba(28,25,23,0.6)), url(${bgCasa})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <ScrollReveal className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Casa de Matilda" className="h-40 sm:h-52 object-contain drop-shadow-2xl" />
          </div>
          <p className="text-xl sm:text-2xl text-amber-100 mb-10 leading-relaxed">
            Your Perfect Staycation Escape
          </p>
          <p className="text-stone-300 text-lg mb-10 max-w-xl mx-auto">
            Discover a haven of comfort, privacy, and relaxation. Book the entire property and let
            us take care of the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ProtectedLink
              to="/book"
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg"
            >
              Book Now
            </ProtectedLink>
            <Link
              to="/rooms"
              className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-900 font-bold text-lg px-8 py-4 rounded-2xl transition-colors"
            >
              See the Property
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section — bg stays, heading + grid animate */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Why Choose Casa de Matilda?</h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              We've crafted every detail to ensure your stay is nothing short of extraordinary.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon, title, description }, idx) => (
              <FeatureCard
                key={title}
                icon={icon}
                title={title}
                description={description}
                delay={idx * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — bg stays, only inner content animates */}
      <section
        className="py-20 text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(13,148,136,0.88), rgba(13,148,136,0.88)), url(' + readyToEsc + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <ScrollReveal className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Escape?</h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Reserve the entire Casa de Matilda — 2 private rooms, swimming pool, and all amenities
            exclusively for your group.
          </p>
          <ProtectedLink
            to="/book"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg"
          >
            Reserve the Whole Property
          </ProtectedLink>
        </ScrollReveal>
      </section>

      {/* Stats Bar — bg stays, grid items animate */}
      <section className="bg-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '100%', label: 'Guest Satisfaction' },
              { value: '24/7', label: 'Support Available' },
              { value: '5 Stars', label: 'Average Rating' },
              { value: '2 Rooms', label: 'Private Rooms' },
            ].map(({ value, label }, idx) => (
              <ScrollReveal key={label} delay={idx * 100}>
                <div className="text-3xl font-bold text-amber-400 mb-1">{value}</div>
                <div className="text-stone-400 text-sm">{label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
