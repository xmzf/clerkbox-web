import { useEffect, useState } from 'react';
import { Download, Menu, X } from 'lucide-react';

const links = [
  { label: '能力', href: '#features' },
  { label: 'VIBE', href: '#vibe' },
  { label: '工具', href: '#tools' },
  { label: '路线图', href: '#roadmap' },
];

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function TopAppBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-md3-medium ease-md3-emphasized ${
        scrolled
          ? 'bg-md3-surface/85 shadow-md3-2 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3">
          <img src="/icon.png" alt="ClerkBox" className="h-9 w-9 rounded-md3-md" />
          <span className="text-xl font-bold tracking-tight text-md3-on-surface">ClerkBox</span>
        </a>

        <nav className="ml-auto hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="state-layer rounded-md3-full px-4 py-2 text-sm font-medium text-md3-on-surface-variant transition-colors hover:text-md3-on-surface"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/XMZF-vAI/clerkbox"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outlined !px-4"
          >
            <GitHubIcon size={18} />
            <span className="hidden lg:inline">GitHub</span>
          </a>
          <a href="#download" className="btn-filled !px-4">
            <Download size={18} />
            下载
          </a>
        </div>

        <button
          className="state-layer ml-auto grid h-10 w-10 place-items-center rounded-full md:ml-0 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-b border-md3-outline-variant bg-md3-surface/95 px-6 py-4 shadow-md3-2 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md3-lg px-4 py-3 text-base font-medium text-md3-on-surface hover:bg-md3-surface-variant"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex gap-3 border-t border-md3-outline-variant pt-4">
              <a
                href="https://github.com/XMZF-vAI/clerkbox"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outlined flex-1"
              >
                <GitHubIcon size={18} /> GitHub
              </a>
              <a href="#download" className="btn-filled flex-1" onClick={() => setOpen(false)}>
                <Download size={18} /> 下载
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
