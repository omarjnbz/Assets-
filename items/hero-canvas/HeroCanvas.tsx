import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type MutableRefObject,
  type Ref,
} from 'react'

export interface HeroCanvasHandle {
  /** Drive the scroll-based relight. Expects 0..1. */
  setScroll: (progress: number) => void
}

interface HeroCanvasProps {
  src: string
  className?: string
  /** Forwarded DOM ref to the underlying <canvas> (so GSAP can transform it). */
  elementRef?: Ref<HTMLCanvasElement>
}

/* ── Tunable look ──────────────────────────────────────────────
   These are intentionally exposed so the lighting can be dialled
   in visually without touching the shader maths. */
const INTENSITY = 0.38 // master strength of the moving key light (subtle/premium)
const FRAME_X = 0.0 //  horizontal framing offset (-0.5..0.5), + pushes crop right
const LIGHT_Y_START = 0.3 // scroll=0 → light sits low (chin / neck)
const LIGHT_Y_END = 0.82 // scroll=1 → light has climbed to the brow
const BAND_WIDTH = 0.42 // vertical softness of the moving light band (wider = softer)
const SCROLL_EASE = 0.05 // how fast the relight follows scroll (lower = slower/smoother)

const VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform float uScroll;      // 0..1 scroll progress (smoothed)
uniform float uIntensity;
uniform float uFrameX;
uniform float uLightYStart;
uniform float uLightYEnd;
uniform float uBandWidth;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void main() {
  // cover-fit (like background-size: cover)
  vec2 uv = vUv;
  if (uPlaneAspect < uImageAspect) {
    uv.x = (uv.x - 0.5) * (uPlaneAspect / uImageAspect) + 0.5;
  } else {
    uv.y = (uv.y - 0.5) * (uImageAspect / uPlaneAspect) + 0.5;
  }
  uv.x += uFrameX;

  vec3 base = texture2D(uTexture, uv).rgb;

  // A soft horizontal light band that climbs the frame as you scroll.
  // (square the term directly — pow(x, 2.0) is undefined for negative x in GLSL ES)
  float lightY = mix(uLightYStart, uLightYEnd, uScroll);
  float d = (uv.y - lightY) / uBandWidth;
  float band = exp(-d * d);

  // Bias the glow toward pixels that already catch light (the key-lit
  // side of the face / neck) so it reads as relighting, not a flat wash.
  float lit = smoothstep(0.12, 0.55, luma(base));
  float glow = band * mix(0.35, 1.0, lit);

  // Green key light that warms slightly as it intensifies — never blows to white.
  vec3 lightCol = mix(vec3(0.55, 0.85, 0.62), vec3(1.0, 0.96, 0.85), uScroll * 0.6);

  // Multiplicative add: brightens lit areas, leaves shadows dark.
  vec3 color = base + base * glow * uIntensity * lightCol;

  // A barely-there global lift so the whole frame feels alive (capped).
  color += base * (uScroll * 0.03);

  // Gentle vignette for depth.
  float vig = smoothstep(1.15, 0.35, distance(vUv, vec2(0.5)));
  color *= mix(0.84, 1.0, vig);

  gl_FragColor = vec4(color, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[HeroCanvas] shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const HeroCanvas = forwardRef<HeroCanvasHandle, HeroCanvasProps>(function HeroCanvas(
  { src, className, elementRef },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const targetScroll = useRef(0)
  const currentScroll = useRef(0)
  const rafRef = useRef(0)

  useImperativeHandle(
    ref,
    () => ({
      setScroll: (p: number) => {
        targetScroll.current = Math.max(0, Math.min(1, p))
      },
    }),
    []
  )

  // Assign to both the internal ref and the (optional) forwarded ref.
  const setCanvas = (el: HTMLCanvasElement | null) => {
    canvasRef.current = el
    if (!elementRef) return
    if (typeof elementRef === 'function') elementRef(el)
    else (elementRef as MutableRefObject<HTMLCanvasElement | null>).current = el
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false })
    if (!gl) {
      // Graceful fallback — just show the photo.
      canvas.style.backgroundImage = `url(${src})`
      canvas.style.backgroundSize = 'cover'
      canvas.style.backgroundPosition = 'center'
      return
    }

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    const program = gl.createProgram()
    if (!vert || !frag || !program) return
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[HeroCanvas] program link error:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    // Full-screen quad
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const u = {
      texture: gl.getUniformLocation(program, 'uTexture'),
      imageAspect: gl.getUniformLocation(program, 'uImageAspect'),
      planeAspect: gl.getUniformLocation(program, 'uPlaneAspect'),
      scroll: gl.getUniformLocation(program, 'uScroll'),
      intensity: gl.getUniformLocation(program, 'uIntensity'),
      frameX: gl.getUniformLocation(program, 'uFrameX'),
      lightYStart: gl.getUniformLocation(program, 'uLightYStart'),
      lightYEnd: gl.getUniformLocation(program, 'uLightYEnd'),
      bandWidth: gl.getUniformLocation(program, 'uBandWidth'),
    }

    // Texture (1×1 placeholder until the image loads)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([18, 28, 38, 255]))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    let imageAspect = 1
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageAspect = img.naturalWidth / Math.max(1, img.naturalHeight)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    }
    img.src = src

    // Constant uniforms
    gl.uniform1i(u.texture, 0)
    gl.uniform1f(u.intensity, INTENSITY)
    gl.uniform1f(u.frameX, FRAME_X)
    gl.uniform1f(u.lightYStart, LIGHT_Y_START)
    gl.uniform1f(u.lightYEnd, LIGHT_Y_END)
    gl.uniform1f(u.bandWidth, BAND_WIDTH)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let running = true
    const render = () => {
      if (!running) return
      // Smooth (lerp) toward the latest scroll value for buttery relighting.
      currentScroll.current += (targetScroll.current - currentScroll.current) * SCROLL_EASE
      gl.uniform1f(u.scroll, currentScroll.current)
      gl.uniform1f(u.imageAspect, imageAspect)
      gl.uniform1f(u.planeAspect, canvas.width / Math.max(1, canvas.height))
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    const onContextLost = (e: Event) => {
      e.preventDefault()
      running = false
      cancelAnimationFrame(rafRef.current)
    }
    canvas.addEventListener('webglcontextlost', onContextLost)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
    }
  }, [src])

  return <canvas ref={setCanvas} className={className} />
})

export default HeroCanvas
