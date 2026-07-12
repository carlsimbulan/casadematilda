import { Link } from 'react-router-dom';
import { BedDouble, Lock, Leaf } from 'lucide-react';
import bgCasa from '../assets/bgcasa.png';

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

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(28,25,23,0.45), rgba(28,25,23,0.6)), url(${bgCasa})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-amber-400 font-semibold text-lg mb-3 tracking-widest uppercase">
            Welcome to
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            Casa de Matilda
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 mb-10 leading-relaxed">
            Your Perfect Staycation Escape
          </p>
          <p className="text-stone-300 text-lg mb-10 max-w-xl mx-auto">
            Discover a haven of comfort, privacy, and relaxation. Book the entire property and let
            us take care of the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg"
            >
              Book Now
            </Link>
            <Link
              to="/rooms"
              className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-900 font-bold text-lg px-8 py-4 rounded-2xl transition-colors"
            >
              See the Property
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Why Choose Casa de Matilda?</h2>
            <p className="text-stone-500 text-lg max-w-xl mx-auto">
              We've crafted every detail to ensure your stay is nothing short of extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-amber-100 p-4 rounded-2xl">
                    <Icon className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
                <p className="text-stone-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 text-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(13,148,136,0.88), rgba(13,148,136,0.88)), url(/readytoesc.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Escape?</h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            Reserve the entire Casa de Matilda — 2 private rooms, swimming pool, and all amenities
            exclusively for your group.
          </p>
          <Link
            to="/book"
            className="inline-block bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-lg"
          >
            Reserve the Whole Property
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '100%', label: 'Guest Satisfaction' },
              { value: '24/7', label: 'Support Available' },
              { value: '5 Stars', label: 'Average Rating' },
              { value: '2 Rooms', label: 'Private Rooms' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-amber-400 mb-1">{value}</div>
                <div className="text-stone-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
