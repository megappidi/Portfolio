'use client'

import { useEffect, useRef } from 'react'

const MEGH = [
  130.81, 146.83, 174.61, 196.00, 233.08, 246.94,
  261.63, 293.66, 349.23, 392.00, 466.16, 493.88,
  523.25, 587.33, 698.46, 783.99, 932.33, 987.77,
]

const NOTE_COLORS = ['#FF6B4A','#FFD166','#06D6A0','#8FBDE0','#C77DFF','#FF9EBA']
const QWERTY = new Set('qwertyuiop'.split(''))
const ASDF   = new Set('asdfghjkl'.split(''))
const ZXCV   = new Set('zxcvbnm'.split(''))

const LETTER_MAP: Record<string, number> = {}
'abcdefghijklmnopqrstuvwxyz'.split('').forEach((ch, i) => {
  LETTER_MAP[ch] = Math.round(i * (MEGH.length - 1) / 25)
})

export default function Hero() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const waveRef     = useRef<HTMLCanvasElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const reverbRef   = useRef<ConvolverNode | null>(null)
  const mouseRef    = useRef({ mx: 0.5, my: 0.5, tmx: 0.5, tmy: 0.5 })
  const cursorRef   = useRef<HTMLDivElement>(null)
  const cursorPos   = useRef({ cx: 0, cy: 0 })

  // WebGL sky
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vs = `attribute vec4 aPos;void main(){gl_Position=aPos;}`
    const fs = `
      precision highp float;
      uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;
      vec3 m3(vec3 x){return x-floor(x*(1./289.))*289.;}
      vec2 m2(vec2 x){return x-floor(x*(1./289.))*289.;}
      vec3 pm(vec3 x){return m3(((x*34.)+1.)*x);}
      float sn(vec2 v){
        const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
        vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
        vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
        vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=m2(i);
        vec3 p=pm(pm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
        vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
        m=m*m;m=m*m;
        vec3 xv=2.*fract(p*C.www)-1.;vec3 h=abs(xv)-.5;
        vec3 ox=floor(xv+.5);vec3 a0=xv-ox;
        m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
        vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
        return 130.*dot(m,g);}
      float fbm(vec2 p){float v=0.;float a=.5;float f=1.;
        for(int i=0;i<5;i++){v+=sn(p*f)*a;f*=2.1;a*=.48;}return v*.5+.5;}
      float cloud(vec2 p,float sc,float sp,float sd,float cv){
        vec2 q=p*sc+vec2(u_time*sp+sd,u_time*sp*.25+sd*.3);
        q+=(u_mouse-.5)*.06;return smoothstep(cv-.08,cv+.22,fbm(q));}
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res.xy;float asp=u_res.x/u_res.y;
        vec2 p=vec2(uv.x*asp,uv.y);
        float c1=cloud(p,.70,.013,0.,.60);float c2=cloud(p,1.20,.019,4.2,.58);float c3=cloud(p,2.40,.027,8.7,.62);
        float clouds=clamp(c1*.40+c2*.30+c3*.13,0.,1.);float h=uv.y;
        vec3 sd2=vec3(.165,.545,.780);vec3 sm=vec3(.255,.651,.851);vec3 sl=vec3(.478,.780,.906);vec3 sh=vec3(.655,.855,.937);
        vec3 cs=vec3(.820,.882,.941);vec3 cm=vec3(.910,.940,.968);vec3 cb=vec3(.966,.978,.990);
        vec3 sky=sd2;sky=mix(sky,sm,smoothstep(.9,.55,h));sky=mix(sky,sl,smoothstep(.4,.12,h));sky=mix(sky,sh,smoothstep(.1,0.,h));
        vec3 cc=mix(cs,cm,smoothstep(.1,.5,clouds));cc=mix(cc,cb,smoothstep(.5,.9,clouds));
        float alpha=smoothstep(.05,.50,clouds)*.88;vec3 col=mix(sky,cc,alpha);
        vec2 sp2=vec2(p.x-.3*asp,p.y-.88);col+=vec3(1.,.97,.85)*exp(-dot(sp2,sp2)*1.8)*.09;
        gl_FragColor=vec4(col,1.);}`

    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src); gl!.compileShader(s); return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,1,1,-1,-1,1,-1]), gl.STATIC_DRAW)

    const aPos  = gl.getAttribLocation(prog, 'aPos')
    const uRes  = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse= gl.getUniformLocation(prog, 'u_mouse')

    const mouse = mouseRef.current

    const onMove = (e: MouseEvent) => {
      mouse.tmx = e.clientX / window.innerWidth
      mouse.tmy = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize); resize()

    let raf: number
    const frame = (t: number) => {
      t *= 0.001
      mouse.mx += (mouse.tmx - mouse.mx) * 0.035
      mouse.my += (mouse.tmy - mouse.my) * 0.035
      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(aPos)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.uniform2f(uMouse, mouse.mx, mouse.my)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Waveform
  useEffect(() => {
    const wc = waveRef.current
    if (!wc) return
    const wctx = wc.getContext('2d')!
    const dataArr = new Uint8Array(256)
    let raf: number

    const resize = () => {
      wc.width  = wc.offsetWidth  * devicePixelRatio
      wc.height = wc.offsetHeight * devicePixelRatio
      wctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()

    const draw = () => {
      const W = wc.offsetWidth, H = wc.offsetHeight
      wctx.clearRect(0, 0, W, H)
      wctx.beginPath()
      wctx.strokeStyle = 'rgba(15,30,45,0.25)'
      wctx.lineWidth = 1.5
      const analyser = analyserRef.current
      if (analyser) {
        analyser.getByteTimeDomainData(dataArr)
        const sw = W / dataArr.length
        dataArr.forEach((v, i) => {
          const x = i * sw, y = (v / 128) * (H / 2)
          i === 0 ? wctx.moveTo(x, y) : wctx.lineTo(x, y)
        })
      } else {
        const ph = performance.now() * 0.001
        for (let x = 0; x < W; x++) {
          const y = H / 2 + Math.sin(x * 0.03 + ph) * 1.5
          x === 0 ? wctx.moveTo(x, y) : wctx.lineTo(x, y)
        }
      }
      wctx.stroke()
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  // Cursor
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    const pos = cursorPos.current
    let raf: number

    const onMove = (e: MouseEvent) => {
      pos.cx = e.clientX; pos.cy = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      cursor.style.left = pos.cx + 'px'
      cursor.style.top  = pos.cy + 'px'
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove) }
  }, [])

  function initAudio() {
    if (audioCtxRef.current) return
    const audioCtx = new AudioContext()
    audioCtxRef.current = audioCtx
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    analyser.connect(audioCtx.destination)
    analyserRef.current = analyser

    const reverb = audioCtx.createConvolver()
    const len = audioCtx.sampleRate * 1.4
    const buf = audioCtx.createBuffer(2, len, audioCtx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c)
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
    }
    reverb.buffer = buf
    const rg = audioCtx.createGain(); rg.gain.value = 0.10
    reverb.connect(rg); rg.connect(audioCtx.destination)
    reverbRef.current = reverb
  }

  function freqFor(ch: string) {
    const l = ch.toLowerCase()
    if (LETTER_MAP[l] !== undefined) return MEGH[LETTER_MAP[l]]
    if (/[0-9]/.test(ch)) return MEGH[6 + parseInt(ch) % 6]
    return MEGH[9]
  }

  function colorFor(ch: string) {
    const l = ch.toLowerCase()
    if (LETTER_MAP[l] !== undefined) return NOTE_COLORS[LETTER_MAP[l] % 6]
    return NOTE_COLORS[2]
  }

  function playPiano(freq: number) {
    const ctx = audioCtxRef.current!
    const now = ctx.currentTime
    ;[
      { ratio: 1, type: 'triangle' as OscillatorType, amp: 0.28, dec: 1.0 },
      { ratio: 2, type: 'triangle' as OscillatorType, amp: 0.14, dec: 0.45 },
      { ratio: 3, type: 'sine'     as OscillatorType, amp: 0.06, dec: 0.25 },
    ].forEach(({ ratio, type, amp, dec }) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain()
      osc.type = type; osc.frequency.value = freq * ratio
      g.gain.setValueAtTime(amp, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + dec)
      osc.connect(g); g.connect(analyserRef.current!); g.connect(reverbRef.current!)
      osc.start(now); osc.stop(now + dec + 0.05)
    })
  }

  function playSine(freq: number) {
    const ctx = audioCtxRef.current!
    const now = ctx.currentTime
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.type = 'sine'; osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
    osc.connect(gain); gain.connect(analyserRef.current!)
    osc.start(now); osc.stop(now + 0.32)
  }

  function playTanpura(freq: number) {
    const ctx = audioCtxRef.current!
    const now = ctx.currentTime; const dur = 2.0
    ;[
      { ratio: 0.5, amp: 0.08 }, { ratio: 1, amp: 0.18 },
      { ratio: 1.5, amp: 0.10 }, { ratio: 2, amp: 0.06 },
    ].forEach(({ ratio, amp }) => {
      [0, 1.003].forEach(detune => {
        const osc = ctx.createOscillator(); const g = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = detune === 0 ? freq * ratio : freq * ratio * detune
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(amp * (detune === 0 ? 1 : 0.5), now + 0.018)
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
        osc.connect(g); g.connect(analyserRef.current!); g.connect(reverbRef.current!)
        osc.start(now); osc.stop(now + dur + 0.1)
      })
    })
  }

  function playKey(ch: string) {
    const freq  = freqFor(ch)
    const lower = ch.toLowerCase()
    if      (QWERTY.has(lower)) playPiano(freq)
    else if (ASDF.has(lower))   playSine(freq)
    else if (ZXCV.has(lower))   playTanpura(freq)
    else                         playSine(freq)
  }

  function spawnBubble(x: number, y: number, color: string) {
    const b = document.createElement('div')
    const size = 10 + Math.random() * 18
    b.style.cssText = `
      position:fixed;border-radius:50%;pointer-events:none;z-index:20;
      width:${size}px;height:${size}px;background:${color};
      left:${x + (Math.random() - 0.5) * 60}px;top:${y - 20}px;opacity:0.8;
      animation:bubbleUp 2.2s ease-out forwards;
    `
    document.body.appendChild(b)
    setTimeout(() => b.remove(), 2400)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key.length !== 1) return
    initAudio()
    playKey(e.key)
    const rect = (e.target as HTMLInputElement).getBoundingClientRect()
    spawnBubble(rect.left + Math.random() * rect.width, rect.top, colorFor(e.key))
  }

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }} />
      <div className="grain" />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2.5rem' }}>
        <a href="#" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.78rem', fontWeight: 500, color: 'rgba(15,30,45,0.75)', textDecoration: 'none' }}>meg.</a>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          {['work', 'about'].map(l => (
            <li key={l}><a href={`#${l}`} style={{ fontFamily: 'var(--font-instrument)', fontSize: '0.82rem', color: 'rgba(15,30,45,0.65)', textDecoration: 'none' }}>{l}</a></li>
          ))}
        </ul>
      </nav>

      <section style={{ position: 'fixed', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <p className="hero-prompt">type anything.</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'all', opacity: 0, animation: 'fadeUp .8s ease forwards .7s' }}>
          <input
            ref={inputRef}
            className="words-input"
            type="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={120}
            onKeyDown={handleKeyDown}
          />
          <canvas ref={waveRef} style={{ width: 'clamp(280px,42vw,560px)', height: '40px', marginTop: '0.75rem', opacity: 0.5 }} />
          <p style={{ marginTop: '0.75rem', fontFamily: 'var(--font-dm-mono)', fontSize: '0.48rem', letterSpacing: '0.1em', color: 'rgba(15,30,45,0.3)', textAlign: 'center', lineHeight: 1.7 }}>
            <span style={{ opacity: 0.6 }}>qwerty</span> — piano &nbsp;·&nbsp; <span style={{ opacity: 0.6 }}>asdf</span> — pluck &nbsp;·&nbsp; <span style={{ opacity: 0.6 }}>zxcv</span> — tanpura
          </p>
        </div>
      </section>

      <div style={{ position: 'fixed', bottom: '2.2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, fontFamily: 'var(--font-dm-mono)', fontSize: '0.52rem', letterSpacing: '0.18em', color: 'rgba(15,30,45,0.45)', whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, animation: 'fadeUp .6s ease forwards 1.2s' }}>
        meghana appidi &nbsp;·&nbsp; creative technologist
      </div>
    </>
  )
}
