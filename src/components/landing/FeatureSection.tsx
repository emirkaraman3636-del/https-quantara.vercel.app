"use client";

export default function FeatureSection() {
  const features = [
    { num: "01", title: "DETERMINISTIC ANALYTICS", desc: "Every number has a source. No hallucination, just math." },
    { num: "02", title: "DATA QUALITY", desc: "Know what you can trust with automated validation." },
    { num: "03", title: "AI ANALYST", desc: "Understand the story behind the numbers instantly." },
    { num: "04", title: "DECISION SUPPORT", desc: "Move from insight to action with verified intelligence." }
  ];

  return (
    <section id="platform" className="py-24 md:py-40 bg-[#0a0a0f] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col group">
              <div className="text-[80px] font-medium leading-none tracking-[-0.04em] text-[#475569] group-hover:text-white transition-colors duration-500 mb-6">
                {f.num}
              </div>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-white mb-4">
                {f.title}
              </h3>
              <p className="text-[#94a3b8] font-light leading-relaxed max-w-sm text-lg">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
