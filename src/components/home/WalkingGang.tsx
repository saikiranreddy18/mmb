"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { MQ } from "@/lib/motion/gsap";

/**
 * The ingredient gang walking across the page — from the supplied film.
 *
 * Asset: the film's walking-only wide shot, background keyed out per frame and
 * looped on a full stride (1s, crossfaded seam). Transparency is shipped as a
 * "packed alpha" MP4 (colour on top half, alpha below) so it works in every
 * browser incl. Safari; a tiny WebGL shader recombines them onto the page.
 *
 * MOTION CONTRACT — Walking gang
 * Stride: the film loop (24fps). Travel: the line walks left → right across the
 *   band and loops, starting already on screen; speed matched to the stride so
 *   feet don't slide (36s desktop / 22s mobile, linear).
 * Runs only while visible; Pause/Play always available (WCAG 2.2.2).
 * Reduced motion / no WebGL: a still, transparent frame of the gang, centred.
 */

const SOURCES = [
  { src: "/assets/gang-walk-packed.webm", type: "video/webm" },
  { src: "/assets/gang-walk-packed.mp4", type: "video/mp4" },
];
const STILL = "/assets/gang-walk-still.webp";
const W = 1024;
const H = 288;

const VERT = `attribute vec2 p; varying vec2 uv;
void main(){ uv = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `precision mediump float; varying vec2 uv; uniform sampler2D t;
void main(){
  vec3 c = texture2D(t, vec2(uv.x, uv.y * 0.5)).rgb;
  // clean compression noise in the matte, keep soft anti-aliased edges
  float a = smoothstep(0.08, 0.92, texture2D(t, vec2(uv.x, 0.5 + uv.y * 0.5)).r);
  gl_FragColor = vec4(c * a, a);
}`;

function startRenderer(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.viewport(0, 0, W, H);
  gl.clearColor(0, 0, 0, 0);

  let raf = 0;
  const draw = () => {
    if (video.readyState >= 2) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

export function WalkingGang() {
  const bandRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"pending" | "live" | "still">("pending");
  const [visible, setVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Decide live (WebGL) vs still, and start the renderer.
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) {
      setMode("still");
      return;
    }
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const stop = startRenderer(canvas, video);
    setMode(stop ? "live" : "still");
    return () => stop?.();
  }, []);

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = mode === "live" && visible && !userPaused;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || mode !== "live") return;
    if (running) v.play().catch(() => {});
    else v.pause();
  }, [running, mode]);

  return (
    <div className="relative">
      <div
        ref={bandRef}
        className="gang-band relative overflow-hidden [container-type:inline-size]"
        data-running={running ? "true" : "false"}
        data-mode={mode}
        role="img"
        aria-label="The walnut, pumpkin seed, almond, sunflower seed, black seed, date, pistachio and cashew characters walking along hand in hand."
      >
        <div className="gang-track">
          {mode === "still" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={STILL} alt="" width={W} height={H} className="block h-full w-full" />
          ) : (
            <canvas ref={canvasRef} width={W} height={H} className="block h-full w-full" />
          )}
        </div>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          crossOrigin="anonymous"
          className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
        >
          {SOURCES.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
        {/* the ground they walk on */}
        <div aria-hidden className="absolute inset-x-0 bottom-[3%] h-px bg-line" />
      </div>

      {mode === "live" && (
        <button
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          className="absolute right-4 top-0 inline-flex min-h-11 items-center gap-2 rounded-full border border-green/25 bg-bg/80 px-4 text-xs font-bold uppercase tracking-[0.14em] text-green backdrop-blur transition-colors hover:border-green md:right-8"
        >
          {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          {userPaused ? "Play" : "Pause"}
          <span className="sr-only"> the walking ingredients</span>
        </button>
      )}

      <style>{`
        .gang-band { height: calc(var(--gw) * ${H} / ${W}); --gw: min(150vw, 620px); }
        @media (min-width: 768px) { .gang-band { --gw: min(78vw, 980px); } }
        .gang-track { position: absolute; left: 0; bottom: 0; width: var(--gw); height: 100%;
          animation: mb-gang 36s linear -12s infinite; animation-play-state: paused; }
        @media (max-width: 767px) { .gang-track { animation-duration: 22s; animation-delay: -7s; } }
        .gang-band[data-running="true"] .gang-track { animation-play-state: running; }
        .gang-band[data-mode="still"] .gang-track { animation: none; left: 50%; transform: translateX(-50%); max-width: 100%; }
        @keyframes mb-gang { from { transform: translateX(-100%); } to { transform: translateX(100cqw); } }
        @media (prefers-reduced-motion: reduce) { .gang-track { animation: none !important; } }
      `}</style>
    </div>
  );
}
