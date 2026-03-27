'use client'

export default function About() {
  return (
    <section id="about" style={{
      position: 'relative',
      zIndex: 10,
      padding: '6rem 2.5rem 8rem',
    }}>
      <div style={{
        maxWidth: '680px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: '20px',
        padding: '3rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(15,30,45,0.4)',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          about
        </p>

        <p style={{
          fontFamily: 'var(--font-instrument)',
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          lineHeight: 1.7,
          color: 'rgba(15,30,45,0.8)',
          marginBottom: '1.5rem',
          fontWeight: 400,
        }}>
          I&apos;m Meghana — my name means &ldquo;clouds&rdquo; in Sanskrit, which is either a coincidence or destiny given that I built my whole portfolio on a sky shader.
        </p>

        <p style={{
          fontFamily: 'var(--font-instrument)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(15,30,45,0.65)',
          marginBottom: '2rem',
        }}>
          I&apos;m a creative technologist and NYU student who started in music and content creation, then taught myself to code because I kept having ideas I couldn&apos;t build yet. Now I sit in the middle of design, engineering, and strategy — and that overlap is where I do my best work.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'GitHub',   href: 'https://github.com' },
            { label: 'Resume',   href: '#' },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              color: 'rgba(15,30,45,0.7)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid rgba(15,30,45,0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLAnchorElement).style.background = '#FF6B4A'
              ;(e.target as HTMLAnchorElement).style.color = '#fff'
              ;(e.target as HTMLAnchorElement).style.borderColor = '#FF6B4A'
            }}
            onMouseLeave={e => {
              (e.target as HTMLAnchorElement).style.background = 'transparent'
              ;(e.target as HTMLAnchorElement).style.color = 'rgba(15,30,45,0.7)'
              ;(e.target as HTMLAnchorElement).style.borderColor = 'rgba(15,30,45,0.2)'
            }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
