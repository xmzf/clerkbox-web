import { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

const stats = [
  { value: 12, suffix: '+', label: '内置工具' },
  { value: 100, suffix: '', label: 'ReAct 迭代上限' },
  { value: 4, suffix: '', label: '长期记忆类型' },
  { value: 100, suffix: '%', label: '数据本地存储' },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const { ref, revealed } = useReveal<HTMLSpanElement>(0.5);

  useEffect(() => {
    if (!revealed) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function Stats() {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.1);

  return (
    <section className="border-y border-md3-outline-variant bg-md3-surface-variant/40 px-6 py-10 lg:px-10">
      <div
        ref={ref}
        className={`mx-auto grid max-w-7xl grid-cols-2 gap-8 transition-all duration-700 ease-md3-emphasized md:grid-cols-4 ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="text-4xl font-black tracking-tight text-md3-primary sm:text-5xl">
              <AnimatedNumber target={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-widest text-md3-on-surface-variant">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
