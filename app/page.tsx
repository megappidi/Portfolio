import Hero from '@/components/Hero'
import WorkGrid from '@/components/WorkGrid'
import About from '@/components/About'

export default function Home() {
  return (
    <main>
      {/* Full-screen hero — sky + words to music */}
      <div style={{ height: '100vh' }}>
        <Hero />
      </div>

      {/* Scrollable content sits on top of sky */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <WorkGrid />
        <About />

        <footer style={{
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.52rem',
          letterSpacing: '0.15em',
          color: 'rgba(15,30,45,0.3)',
        }}>
          meghana appidi · {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  )
}
