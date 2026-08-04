import { motion as m } from "framer-motion";
import Reveal, { Stagger } from "../../components/common/Reveal";

export default function About() {
  return (
    <div>
      {/* Opening moment — sets the same weight as the homepage hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="grain-overlay" />
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase text-xs tracking-widest2 text-gold/70 mb-3"
          >
            Our Story
          </m.p>
          <m.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl text-cream text-shimmer"
          >
            Bottled Moonlight
          </m.h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <Stagger className="grid md:grid-cols-2 gap-12 text-cream/70 leading-relaxed">
          <Reveal direction="left">
            <p>
              Lumera began with a single plant on a windowsill: a queen of the night
              cactus that flowered exactly once a year, for a single evening, filling
              the room with a scent no perfume could match. We set out to capture
              that hour and make it wearable every day.
            </p>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <p>
              Every Lumera fragrance is composed in small batches by independent
              perfumers, using responsibly-sourced botanicals and long-lasting,
              skin-safe bases. We don't chase trends — we build scents meant to
              become part of someone's memory.
            </p>
          </Reveal>
        </Stagger>

        <Stagger className="grid sm:grid-cols-3 gap-8 mt-20">
          {[
            { stat: "2019", label: "Founded" },
            { stat: "100%", label: "Cruelty-Free" },
            { stat: "12", label: "Signature Scents" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <m.div
                whileHover={{ y: -4, borderColor: "rgba(198,161,91,0.5)" }}
                transition={{ duration: 0.25 }}
                className="border border-white/10 p-8 text-center h-full"
              >
                <p className="font-display text-4xl text-gold mb-2">{item.stat}</p>
                <p className="text-cream/50 text-sm uppercase tracking-widest">{item.label}</p>
              </m.div>
            </Reveal>
          ))}
        </Stagger>

        <div className="mt-24">
          <Reveal>
            <h2 className="font-display text-3xl text-cream mb-10">How We Work</h2>
          </Reveal>
          <Stagger className="space-y-8 text-cream/70">
            {[
              "We source raw materials directly from small growers, prioritizing botanicals over synthetics wherever the scent allows.",
              "Each formula is refined over months of blind testing before it ever reaches a bottle.",
              "We produce in limited runs, so every bottle you receive was blended within the same season.",
            ].map((text, i) => (
              <Reveal key={i} direction="left" delay={i * 0.1} className="flex gap-6">
                <span className="font-display text-gold text-2xl w-12 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p>{text}</p>
              </Reveal>
            ))}
          </Stagger>
        </div>

        {/* Founder note — new closing moment, gives the page an ending rather
            than just trailing off after the process list */}
        <Reveal className="mt-24 border-t border-white/10 pt-16 text-center max-w-2xl mx-auto">
          <p className="font-display text-2xl md:text-3xl text-cream italic leading-snug">
            "We're not trying to bottle a flower. We're trying to bottle the
            feeling of catching it at exactly the right hour."
          </p>
          <p className="mt-6 text-cream/40 text-sm uppercase tracking-widest">
            Founder, Lumera Fragrance
          </p>
        </Reveal>
      </div>
    </div>
  );
}
