import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axiosConfig";
import logo from "../../assets/lumera-logo-transparent.png";
import ProductCard from "../../components/customer/ProductCard";
import Reveal, { Stagger } from "../../components/common/Reveal";

const ethos = [
  "Hand-Blended in Small Batches",
  "Cruelty-Free, Always",
  "Botanical First, Synthetic Never Unless Necessary",
  "Composed Around the Night-Blooming Cereus",
  "Free Shipping Over $75",
];

const testimonials = [
  {
    quote:
      "It genuinely smells like nothing else I own — warm, green, a little strange in the best way. I get stopped for it constantly.",
    name: "Amara T.",
    detail: "Verified buyer, Nocturne Bloom",
  },
  {
    quote:
      "The throw is incredible without being loud. One spray in the morning and it's still there, softly, by evening.",
    name: "Devin R.",
    detail: "Verified buyer, Moonpetal",
  },
  {
    quote:
      "Packaging alone felt like unwrapping something from a much more expensive house. The scent backs it up.",
    name: "Priya S.",
    detail: "Verified buyer, Amber Vigil",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.slice(0, 4)));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Wire this up to your newsletter endpoint when it exists.
    setSubscribed(true);
  };

  return (
    <div className="overflow-x-clip">
      {/* Hero — the flower is the thesis */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="grain-overlay" />
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="uppercase text-xs tracking-widest2 text-gold/80 mb-6"
            >
              The Night-Blooming Collection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-7xl leading-[1.05] text-cream"
            >
              A flower that{" "}
              <span className="text-shimmer italic">blooms once,</span> a scent
              that lasts.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-6 text-cream/60 max-w-md leading-relaxed"
            >
              Lumera fragrances are composed around the cereus blossom — opening
              only under moonlight, gone by dawn. We bottle that fleeting hour.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              className="mt-10 flex gap-4"
            >
              <Link
                to="/products"
                className="bg-gold text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-gold-light transition-colors"
              >
                Shop Fragrances
              </Link>
              <Link
                to="/about"
                className="border border-cream/30 text-cream px-8 py-3 uppercase text-xs tracking-widest hover:border-gold hover:text-gold transition-colors"
              >
                Our Story
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square flex items-center justify-center"
          >
            <div
              className="absolute inset-0 rounded-full bg-gold/5 blur-3xl"
              aria-hidden="true"
            />
            {/* slow ambient rotation ring, purely decorative */}
            <motion.div
              className="absolute inset-6 rounded-full border border-gold/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              aria-hidden="true"
            />
            <div className="relative w-full h-full border border-gold/20 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Lumera Fragrance"
                className="petal-float w-3/4 md:w-4/5 h-auto object-contain select-none"
                draggable="false"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ethos marquee — auto-scrolling strip, pauses on hover */}
      <div className="border-b border-white/10 bg-panel py-4 overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[...ethos, ...ethos].map((line, i) => (
            <span
              key={i}
              className="mx-8 shrink-0 uppercase text-xs tracking-widest2 text-cream/40 whitespace-nowrap"
            >
              {line} <span className="text-gold/50 ml-8">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-2">
              Featured
            </p>
            <h2 className="font-display text-4xl text-cream">
              This Season's Bottles
            </h2>
          </div>
          <Link
            to="/products"
            className="bloom-underline text-sm text-cream/70 hover:text-gold hidden md:inline"
          >
            View all
          </Link>
        </Reveal>

        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* Signature strip */}
      <section className="border-y border-white/10 bg-panel">
        <Stagger className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 text-center">
          {[
            { title: "Hand-Blended", body: "Every batch composed in small runs, never mass-produced." },
            { title: "Cruelty-Free", body: "No animal testing, ever — certified across our full range." },
            { title: "Free Shipping", body: "Complimentary delivery on every order over $75." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <h3 className="font-display text-2xl text-gold mb-2">{item.title}</h3>
              <p className="text-cream/60 text-sm">{item.body}</p>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-2">
            In Their Words
          </p>
          <h2 className="font-display text-4xl text-cream">
            Worn Long After the Bottle's Empty
          </h2>
        </Reveal>

        <Stagger className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.12}
              className="border border-white/10 bg-panel p-8 flex flex-col"
            >
              <span className="font-display text-5xl text-gold/30 leading-none mb-4" aria-hidden="true">
                "
              </span>
              <p className="text-cream/70 text-sm leading-relaxed flex-1">{t.quote}</p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-cream text-sm">{t.name}</p>
                <p className="text-cream/40 text-xs uppercase tracking-widest mt-1">{t.detail}</p>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* Newsletter CTA */}
      <section className="relative border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-panel to-ink" aria-hidden="true" />
        <Reveal className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-3">
            Stay in Bloom
          </p>
          <h2 className="font-display text-4xl text-cream mb-4">
            One Email, the Night It Opens.
          </h2>
          <p className="text-cream/60 mb-8 leading-relaxed">
            Join the list for early access to limited releases and the one night a
            year we restock the cereus absolute.
          </p>

          {subscribed ? (
            <p className="text-gold font-display text-xl">
              You're on the list. See you at moonrise.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent border border-white/20 focus:border-gold text-cream placeholder:text-cream/30 px-4 py-3 text-sm w-full sm:w-72 outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-gold text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>
          )}
        </Reveal>
      </section>
    </div>
  );
}
