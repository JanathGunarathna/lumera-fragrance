export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-3">Our Story</p>
      <h1 className="font-display text-5xl text-cream mb-10">Bottled Moonlight</h1>

      <div className="grid md:grid-cols-2 gap-12 text-cream/70 leading-relaxed">
        <p>
          Lumera began with a single plant on a windowsill: a queen of the night cactus that flowered
          exactly once a year, for a single evening, filling the room with a scent no perfume could match.
          We set out to capture that hour and make it wearable every day.
        </p>
        <p>
          Every Lumera fragrance is composed in small batches by independent perfumers, using
          responsibly-sourced botanicals and long-lasting, skin-safe bases. We don't chase trends —
          we build scents meant to become part of someone's memory.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mt-20">
        <div className="border border-white/10 p-8 text-center">
          <p className="font-display text-4xl text-gold mb-2">2019</p>
          <p className="text-cream/50 text-sm uppercase tracking-widest">Founded</p>
        </div>
        <div className="border border-white/10 p-8 text-center">
          <p className="font-display text-4xl text-gold mb-2">100%</p>
          <p className="text-cream/50 text-sm uppercase tracking-widest">Cruelty-Free</p>
        </div>
        <div className="border border-white/10 p-8 text-center">
          <p className="font-display text-4xl text-gold mb-2">12</p>
          <p className="text-cream/50 text-sm uppercase tracking-widest">Signature Scents</p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-3xl text-cream mb-6">How We Work</h2>
        <div className="space-y-6 text-cream/70">
          <div className="flex gap-6">
            <span className="font-display text-gold text-2xl w-12">01</span>
            <p>We source raw materials directly from small growers, prioritizing botanicals over synthetics wherever the scent allows.</p>
          </div>
          <div className="flex gap-6">
            <span className="font-display text-gold text-2xl w-12">02</span>
            <p>Each formula is refined over months of blind testing before it ever reaches a bottle.</p>
          </div>
          <div className="flex gap-6">
            <span className="font-display text-gold text-2xl w-12">03</span>
            <p>We produce in limited runs, so every bottle you receive was blended within the same season.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
