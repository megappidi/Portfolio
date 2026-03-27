'use client'

import { useState } from 'react'

const projects = [
  {
    title: 'Words to Music',
    description: 'Type anything. Hear Megh Malhar.',
    tags: ['WebGL', 'Web Audio', 'GLSL'],
    color: '#8FBDE0',
    accent: '#0F1E2D',
    link: '#',
  },
  {
    title: 'Rage Tab',
    description: 'Browser extension that turns procrastination into accountability.',
    tags: ['Chrome Extension', 'TypeScript'],
    color: '#FF6B4A',
    accent: '#fff',
    link: '#',
  },
  {
    title: 'Super Bowl Carousel',
    description: 'Data-driven breakdown of every Super Bowl LX advertiser.',
    tags: ['Data', 'Content', 'AI'],
    color: '#FFD166',
    accent: '#0F1E2D',
    link: '#',
  },
  {
    title: 'Zine Maker',
    description: 'Build and export a personal zine in the browser.',
    tags: ['Creative Coding', 'Canvas'],
    color: '#C77DFF',
    accent: '#fff',
    link: '#',
  },
  {
    title: '3D Sticker Mockup',
    description: 'Drop any image onto a 3D laptop in real time.',
    tags: ['Three.js', 'WebGL'],
    color: '#06D6A0',
    accent: '#0F1E2D',
    link: '#',
  },
  {
    title: 'ADHD App',
    description: 'Task picker for brains that can\'t decide what to do first.',
    tags: ['React', 'TypeScript'],
    color: '#FF9EBA',
    accent: '#0F1E2D',
    link: '#',
  },
]

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={project.link}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        borderRadius: '16px',
        overflow: 'hidden',
        background: hovered ? project.color : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.7)',
        transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(15,30,45,0.15)' : '0 4px 20px rgba(15,30,45,0.06)',
        cursor: 'none',
      }}
    >
      {/* Generative top bar */}
      <div style={{
        height: '80px',
        background: project.color,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated circles */}
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            width: `${40 + i * 30}px`,
            height: `${40 + i * 30}px`,
            top: `${-10 + i * 8}px`,
            right: `${10 + i * 20}px`,
            transform: hovered ? `scale(1.2) translate(${i * 4}px, ${-i * 4}px)` : 'scale(1)',
            transition: `transform 0.4s ease ${i * 0.05}s`,
          }} />
        ))}
      </div>

      <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: hovered ? project.accent : '#0F1E2D',
          marginBottom: '0.4rem',
          transition: 'color 0.3s ease',
          letterSpacing: '0.02em',
        }}>
          {project.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-instrument)',
          fontSize: '0.82rem',
          color: hovered ? project.accent : 'rgba(15,30,45,0.6)',
          marginBottom: '1rem',
          lineHeight: 1.5,
          transition: 'color 0.3s ease',
          opacity: hovered ? 0.9 : 1,
        }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.08em',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              background: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(15,30,45,0.07)',
              color: hovered ? project.accent : 'rgba(15,30,45,0.5)',
              transition: 'all 0.3s ease',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}

export default function WorkGrid() {
  return (
    <section id="work" style={{
      position: 'relative',
      zIndex: 10,
      minHeight: '100vh',
      padding: '8rem 2.5rem 6rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(15,30,45,0.4)',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          selected work
        </p>
        <h2 style={{
          fontFamily: 'var(--font-instrument)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 400,
          color: 'rgba(15,30,45,0.85)',
          marginBottom: '3rem',
          lineHeight: 1.1,
        }}>
          things I&apos;ve built.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}>
          {projects.map(p => <ProjectCard key={p.title} project={p} />)}
        </div>
      </div>
    </section>
  )
}
