import { useEffect, useRef, type ReactNode } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import LunoraPlan from './components/LunoraPlan'
import Download from './components/Download'
import Footer from './components/Footer'

/** 进入视口后上浮淡入 */
function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('on')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.08 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div className="reveal" ref={ref}>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Reveal>
          <Features />
        </Reveal>
        <Reveal>
          <LunoraPlan />
        </Reveal>
        <Reveal>
          <Download />
        </Reveal>
      </main>
      <Footer />
    </>
  )
}
