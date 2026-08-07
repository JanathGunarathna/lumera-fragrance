import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axiosConfig";
import bgPattern from "../../assets/botanical-pattern.svg";
import logo from "../../assets/lumera-logo-transparent.png";
import ProductCard from "../../components/customer/ProductCard";
import Reveal, { Stagger } from "../../components/common/Reveal";
import Fireflies from "../../components/common/Fireflies";
import Tilt3D from "../../components/common/Tilt3D";
import { FiTruck, FiShield, FiRefreshCw, FiFeather, FiArrowRight } from "react-icons/fi";

const ethos = [
  "Hand-Blended in Small Batches",
  "Cruelty-Free, Always",
  "Botanical First, Synthetic Never Unless Necessary",
  "Composed Around the Night-Blooming Cereus",
  "Free Shipping Over $75",
];

const categories = [
  { name: "Eau de Parfum", body: "Rich, long-wearing compositions built to last the whole night.", query: "Eau de Parfum" },
  { name: "Eau de Toilette", body: "Lighter, brighter pours for daylight wear.", query: "Eau de Toilette" },
  { name: "Gift Sets", body: "Curated pairings, ready to give.", query: "" },
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

const stats = [
  { value: "40K+", label: "Bottles Poured" },
  { value: "4.9★", label: "Average Rating" },
  { value: "12", label: "Signature Scents" },
  { value: "100%", label: "Cruelty-Free" },
];

const notePyramid = [
  { tier: "Top Notes", body: "Bergamot, pink pepper, a flash of cold moonlit air." },
  { tier: "Heart Notes", body: "Night-blooming cereus, tuberose, a whisper of green fig." },
  { tier: "Base Notes", body: "Warm amber, sandalwood, a low hush of musk." },
];

const trustBadges = [
  { icon: FiTruck, title: "Free Shipping", body: "On every order over $75" },
  { icon: FiShield, title: "Secure Checkout", body: "Encrypted, PCI-compliant payments" },
  { icon: FiRefreshCw, title: "30-Day Returns", body: "Didn't love it? Send it back" },
  { icon: FiFeather, title: "Cruelty-Free", body: "Never tested on animals, ever" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.slice(0, 4))).catch(() => {});
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="overflow-x-clip">
      {/* ============ HERO — dark, gold + yellow glow, real logo centerpiece ============ */}
      <section className="relative overflow-hidden border-b border-gold/10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: '360px 360px',
            backgroundRepeat: 'repeat',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgb(var(--color-yellow)/0.10),transparent_60%)]" aria-hidden="true" />
        <div className="grain-overlay" />
        <div className="mist-layer"><span /><span /></div>
        <Fireflies count={18} />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block uppercase text-xs tracking-widest2 text-yellow-light mb-8 border border-gold/30 rounded-full px-4 py-1.5"
          >
            The Night-Blooming Collection
          </motion.p>

          {/* real brand logo, glowing + gently floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-10"
          >
            <span className="glow-pulse absolute inset-0 -m-10 rounded-full bg-yellow/10 blur-3xl" aria-hidden="true" />
            <Tilt3D max={8} scale={1.02} glare={false}>
              <motion.img
                src={logo}
                alt="Lumera Fragrance"
                className="relative w-72 md:w-[26rem] h-auto object-contain select-none"
                draggable="false"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </Tilt3D>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl md:text-6xl leading-[1.1] text-cream max-w-3xl"
          >
            A flower that <span className="text-shimmer italic">blooms once,</span> a scent that lasts.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-6 text-muted max-w-md leading-relaxed"
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
              className="bg-yellow text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-yellow-light transition-colors shadow-yellow-sm font-medium"
            >
              Shop Fragrances
            </Link>
            <Link
              to="/about"
              className="border border-gold/40 text-cream px-8 py-3 uppercase text-xs tracking-widest hover:border-yellow hover:text-yellow-light transition-colors"
            >
              Our Story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 flex items-center gap-5 text-muted2 text-xs uppercase tracking-widest"
          >
            <span className="flex items-center gap-1.5"><FiShield size={14} className="text-yellow" /> Secure checkout</span>
            <span className="flex items-center gap-1.5"><FiTruck size={14} className="text-yellow" /> Free over $75</span>
          </motion.div>
        </div>
      </section>

      {/* ============ Ethos marquee ============ */}
      <div className="border-b border-gold/10 bg-panel py-4 overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[...ethos, ...ethos].map((line, i) => (
            <span
              key={i}
              className="mx-8 shrink-0 uppercase text-xs tracking-widest2 text-muted2 whitespace-nowrap"
            >
              {line} <span className="text-yellow ml-8">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ Shop by category ============ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="uppercase text-xs tracking-widest2 text-yellow mb-2">Shop by Category</p>
          <h2 className="font-display text-4xl text-cream">Find Your Bloom</h2>
        </Reveal>
        <Stagger className="grid md:grid-cols-3 gap-8">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <Link
                to={c.query ? `/products?category=${encodeURIComponent(c.query)}` : "/products"}
                className="card-anim sheen group block border border-gold/15 bg-gradient-to-b from-surface to-panel p-8 h-full rounded-sm relative overflow-hidden"
              >
                <span className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-yellow/10 blur-2xl group-hover:bg-yellow/25 transition-colors duration-500" aria-hidden="true" />
                <h3 className="font-display text-2xl text-gold-light relative">{c.name}</h3>
                <p className="text-muted text-sm mt-3 leading-relaxed relative">{c.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-yellow-light relative">
                  Shop now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* ============ Featured products ============ */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-panel/40 border-y border-gold/10">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <p className="uppercase text-xs tracking-widest2 text-yellow mb-2">Featured</p>
            <h2 className="font-display text-4xl text-cream">This Season's Bottles</h2>
          </div>
          <Link to="/products" className="bloom-underline text-sm text-cream/90 hover:text-yellow-light hidden md:inline">
            View all
          </Link>
        </Reveal>

        {products.length > 0 ? (
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </Stagger>
        ) : (
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Nocturne Bloom", "Moonpetal", "Amber Vigil", "Cereus Absolute"].map((name, i) => (
              <Reveal key={name} delay={i * 0.08} className="text-center">
                <div className="card-anim sheen aspect-[3/4] bg-gradient-to-b from-surface-2 to-surface border border-gold/15 flex items-center justify-center rounded-sm p-8">
                  <img src={logo} alt="Lumera" className="w-full max-w-[150px] object-contain opacity-90" draggable="false" />
                </div>
                <p className="font-display text-lg text-cream mt-4">{name}</p>
                <p className="text-muted2 text-xs uppercase tracking-widest mt-1">Coming soon</p>
              </Reveal>
            ))}
          </Stagger>
        )}
      </section>

      {/* ============ Stat counters ============ */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl md:text-5xl text-yellow-light">{s.value}</p>
            <p className="text-muted2 text-xs uppercase tracking-widest2 mt-2">{s.label}</p>
          </Reveal>
        ))}
      </section>

      {/* ============ Scent notes ============ */}
      <section className="border-y border-gold/10 bg-panel overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <p className="uppercase text-xs tracking-widest2 text-yellow mb-2">Anatomy of a Scent</p>
            <h2 className="font-display text-4xl text-cream">How Nocturne Bloom Unfolds</h2>
          </Reveal>

          <div className="space-y-5">
            {notePyramid.map((n, i) => (
              <Reveal key={n.tier} delay={i * 0.12}>
                <div className="card-anim relative border border-gold/20 bg-gradient-to-r from-surface to-panel p-6 md:p-8 flex items-center gap-6 rounded-sm">
                  <span className="font-display text-3xl text-gold-dark w-10 shrink-0">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl text-gold-light">{n.tier}</h3>
                    <p className="text-muted text-sm mt-1 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Trust badges ============ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="card-anim border border-gold/15 bg-surface/40 hover:bg-surface p-6 text-center rounded-sm h-full">
                <b.icon className="mx-auto text-yellow mb-3" size={26} />
                <h3 className="font-display text-lg text-cream">{b.title}</h3>
                <p className="text-muted2 text-xs mt-1">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* ============ Testimonials ============ */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-panel/40 border-y border-gold/10">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="uppercase text-xs tracking-widest2 text-yellow mb-2">In Their Words</p>
          <h2 className="font-display text-4xl text-cream">Worn Long After the Bottle's Empty</h2>
        </Reveal>

        <Stagger className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <div className="card-anim border border-gold/15 bg-surface p-8 flex flex-col h-full rounded-sm">
                <span className="font-display text-5xl text-yellow leading-none mb-4" aria-hidden="true">"</span>
                <p className="text-cream/90 text-sm leading-relaxed flex-1">{t.quote}</p>
                <div className="mt-6 pt-6 border-t border-gold/10">
                  <p className="text-cream text-sm">{t.name}</p>
                  <p className="text-muted2 text-xs uppercase tracking-widest mt-1">{t.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* ============ Newsletter CTA ============ */}
      <section className="relative border-t border-gold/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-panel to-ink" aria-hidden="true" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${bgPattern})`, backgroundSize: '360px 360px' }} aria-hidden="true" />
        <Reveal className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="backdrop-blur-sm bg-white/[0.03] border border-gold/20 rounded-sm p-10 md:p-14 shadow-xl shadow-black/40">
            <p className="uppercase text-xs tracking-widest2 text-yellow mb-3">Stay in Bloom</p>
            <h2 className="font-display text-4xl text-cream mb-4">One Email, the Night It Opens.</h2>
            <p className="text-muted mb-8 leading-relaxed">
              Join the list for early access to limited releases and the one night a
              year we restock the cereus absolute.
            </p>

            {subscribed ? (
              <p className="text-yellow-light font-display text-xl">You're on the list. See you at moonrise.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-transparent border border-gold/25 focus:border-yellow text-cream placeholder:text-muted2 px-4 py-3 text-sm w-full sm:w-72 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-yellow text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-yellow-light transition-colors whitespace-nowrap shadow-yellow-sm font-medium"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
