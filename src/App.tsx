import { useState, useEffect } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { Vibe } from './components/Vibe';
import { Tools } from './components/Tools';
import { DownloadSection } from './components/Download';
import { Roadmap } from './components/Roadmap';
import { Footer } from './components/Footer';
import { ThemeCustomizer, type ThemeMode } from './components/ThemeCustomizer';
import { resolveSeed, applyColorScheme } from './lib/theme-engine';

function App() {
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem('cbw-theme') as ThemeMode) || 'light'
  );
  const [colorScheme, setColorScheme] = useState(
    () => localStorage.getItem('cbw-scheme') || 'lavender'
  );
  const [customSeed, setCustomSeed] = useState(
    () => localStorage.getItem('cbw-seed') || '#F4A7B9'
  );

  // 应用主题到 CSS 变量
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      root.classList.toggle('dark', isDark);
      applyColorScheme(resolveSeed(colorScheme, customSeed), isDark);
    };
    apply();
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme, colorScheme, customSeed]);

  // 持久化
  useEffect(() => { localStorage.setItem('cbw-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('cbw-scheme', colorScheme); }, [colorScheme]);
  useEffect(() => { localStorage.setItem('cbw-seed', customSeed); }, [customSeed]);

  return (
    <div className="min-h-screen bg-md3-surface">
      <TopAppBar />
      <main>
        <Hero />
        <ThemeCustomizer
          theme={theme}
          setTheme={setTheme}
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          customSeed={customSeed}
          setCustomSeed={setCustomSeed}
        />
        <Stats />
        <Features />
        <Vibe />
        <Tools />
        <DownloadSection />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}

export default App;
