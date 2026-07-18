"use client";

// Ported from motion-anything (nexu-io, Apache-2.0); aurora/silk/light-rays/pixel-blast/dither
// upstream: reactbits.dev, redistributed with permission.

import { useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------- variants -------------------------------- */

type AuroraProps = {
  variant: "aurora";
  /** Three hex colors sampled left-to-right across the aurora band. */
  colorStops?: readonly [string, string, string];
  /** Wave height multiplier. */
  amplitude?: number;
  /** Softness of the aurora's lower edge. */
  blend?: number;
};

type SilkProps = {
  variant: "silk";
  color?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  noiseIntensity?: number;
};

type PlasmaProps = {
  variant: "plasma";
  color?: string;
  speed?: number;
  scale?: number;
  opacity?: number;
};

type LightRaysProps = {
  variant: "light-rays";
  /** Hex color of the light rays. */
  color?: string;
  /** Animation speed multiplier for the ray shimmer. */
  speed?: number;
  /** Angular spread of the ray cone; lower is a narrower, sharper beam. */
  spread?: number;
};

type PixelBlastProps = {
  variant: "pixel-blast";
  /** Hex color of the dithered pixel field. */
  color?: string;
  /** Size of each pixel cell, in px. */
  pixelSize?: number;
  /** Strength of the click-ripple effect. */
  rippleIntensity?: number;
};

type DitherProps = {
  variant: "dither";
  /** Hex color of the dithered wave. */
  color?: string;
  /** Wave animation speed. */
  speed?: number;
  /** Size of each dithered pixel cell, in px. */
  pixelSize?: number;
};

type WebGLVariantProps = {
  aurora: Omit<AuroraProps, "variant">;
  silk: Omit<SilkProps, "variant">;
  plasma: Omit<PlasmaProps, "variant">;
  "light-rays": Omit<LightRaysProps, "variant">;
  "pixel-blast": Omit<PixelBlastProps, "variant">;
  dither: Omit<DitherProps, "variant">;
};

export type WebGLBackgroundVariant = keyof WebGLVariantProps;

export type WebGLBackgroundProps = {
  [K in WebGLBackgroundVariant]: { variant: K; className?: string } & WebGLVariantProps[K];
}[WebGLBackgroundVariant];

export const WEBGL_BACKGROUND_VARIANTS: WebGLBackgroundVariant[] = [
  "aurora",
  "silk",
  "plasma",
  "light-rays",
  "pixel-blast",
  "dither",
];

const DEFAULT_AURORA_STOPS: readonly [string, string, string] = [
  "#5227ff",
  "#7cff67",
  "#5227ff",
];

/** Rendered instead of the canvas when a browser has no WebGL context. */
const FALLBACK_GRADIENT: Record<WebGLBackgroundVariant, string> = {
  aurora: "linear-gradient(135deg, #5227ff, #7cff67)",
  silk: "linear-gradient(135deg, #726c86, #2d2a38)",
  plasma: "radial-gradient(circle at 30% 30%, #8c7dff, #120e24)",
  "light-rays": "radial-gradient(circle at 50% -10%, #fff4d2, #0d0b08 70%)",
  "pixel-blast": "radial-gradient(circle at 50% 50%, #b497cf, #100b18)",
  dither: "linear-gradient(135deg, #808080, #111114)",
};

/* --------------------------------- GLSL ----------------------------------- */
/* Verbatim fragment shaders from motion-anything's aurora/silk/plasma/light-rays/pixel-blast/
 * dither recipes. Vertex shaders below mirror _fx/shaderbg.js's generic full-screen triangle. */

const VERT_GL1 = `attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }
`;

const VERT_GL2 = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,0.0,1.0); }
`;

const AURORA_FRAG = `#version 300 es
precision highp float;
uniform float uTime; uniform float uAmplitude; uniform vec3 uColorStops[3]; uniform vec2 uResolution; uniform float uBlend;
out vec4 fragColor;
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){ const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx); vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 gg; gg.x=a0.x*x0.x+h.x*x0.y; gg.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.0*dot(m,gg); }
struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor){ int index=0; for(int i=0;i<2;i++){ ColorStop cc=colors[i]; bool ib=cc.position<=factor; index=int(mix(float(index),float(i),float(ib))); } ColorStop cc=colors[index]; ColorStop nc=colors[index+1]; float range=nc.position-cc.position; float lf=(factor-cc.position)/range; finalColor=mix(cc.color,nc.color,lf); }
void main(){ vec2 uv=gl_FragCoord.xy/uResolution;
  ColorStop colors[3]; colors[0]=ColorStop(uColorStops[0],0.0); colors[1]=ColorStop(uColorStops[1],0.5); colors[2]=ColorStop(uColorStops[2],1.0);
  vec3 rampColor; COLOR_RAMP(colors, uv.x, rampColor);
  float height=snoise(vec2(uv.x*2.0+uTime*0.1, uTime*0.25))*0.5*uAmplitude; height=exp(height); height=(uv.y*2.0-height+0.2);
  float intensity=0.6*height; float midPoint=0.20; float aa=smoothstep(midPoint-uBlend*0.5, midPoint+uBlend*0.5, intensity);
  vec3 auroraColor=intensity*rampColor; fragColor=vec4(auroraColor*aa, aa); }
`;

const SILK_FRAG = `precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const PLASMA_FRAG = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

const LIGHT_RAYS_FRAG = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 0.5, -0.2 * iResolution.y);
  vec2 rayDir = vec2(0.0, 1.0);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}
`;

const PIXEL_BLAST_FRAG = `#version 300 es
precision highp float;
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;

  // sRGB gamma correction - convert linear to sRGB for accurate color output
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );

  fragColor = vec4(srgbColor * M, M);
}
`;

/* Hand-merged from the react-bits two-pass original (wave shader -> retro Bayer-dither
 * postprocess): the wave is procedural, so sampling pass-1 at the pixelated uv is equivalent to
 * computing the wave AT that uv, so one #version 300 es fragment shader replicates both passes
 * with zero framebuffers. Verbatim from motion-anything's dither.js. */
const DITHER_FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }
float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz; vec4 iy = Pi.yyww; vec4 fx = Pf.xzxz; vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5; vec4 tx = floor(gx + 0.5); gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x); vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z); vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x)); float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z)); float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}
const int OCTAVES = 4;
float fbm(vec2 p){
  float value = 0.0; float amp = 1.0; float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++){ value += amp * abs(cnoise(p)); p *= freq; amp *= waveAmplitude; }
  return value;
}
float pattern(vec2 p){ vec2 p2 = p - uTime * waveSpeed; return fbm(p + fbm(p2)); }
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);
vec3 dither(vec2 uv, vec3 color){
  vec2 scaledCoord = floor(uv * uResolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0)); int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}
void main(){
  vec2 uvScreen = gl_FragCoord.xy / uResolution;
  vec2 normalizedPixelSize = pixelSize / uResolution;
  vec2 uvPixel = normalizedPixelSize * floor(uvScreen / normalizedPixelSize);
  vec2 fragPix = uvPixel * uResolution;
  vec2 uv = fragPix / uResolution - 0.5;
  uv.x *= uResolution.x / uResolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = uMouse - 0.5;
    mouseNDC.x *= uResolution.x / uResolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  col = dither(uvScreen, col);
  fragColor = vec4(col, 1.0);
}
`;

/* ------------------------------ gl plumbing ------------------------------- */

type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

type UniformSpec =
  | { type: "1f"; value: number }
  | { type: "1i"; value: number }
  | { type: "2f"; value: readonly [number, number] }
  | { type: "3f"; value: readonly [number, number, number] }
  | { type: "1fv"; value: readonly number[] }
  | { type: "2fv"; value: readonly number[] }
  | { type: "3fv"; value: readonly number[] };

/** Click-ripple state for pixel-blast: a fixed-size circular buffer of canvas-space click
 * positions and shader-time timestamps, mirroring motion-anything's MAX_CLICKS=10 uClickPos/
 * uClickTimes uniforms. Lives in a component-level ref so it survives re-renders. */
type RippleState = {
  positions: number[];
  times: number[];
  index: number;
};

const MAX_RIPPLE_CLICKS = 10;

function createRippleState(): RippleState {
  return {
    positions: new Array(MAX_RIPPLE_CLICKS * 2).fill(-1),
    times: new Array(MAX_RIPPLE_CLICKS).fill(0),
    index: 0,
  };
}

type ShaderConfig = {
  frag: string;
  uniforms: Record<string, UniformSpec>;
  useMouse: boolean;
  /** Multiplies the shader clock; only pixel-blast's upstream recipe sets this (0.5). */
  timeScale?: number;
  /** Click-ripple hook (pixel-blast only): fires on pointerdown with direct GL access so the
   * variant can push its own uClickPos/uClickTimes uniforms without growing the generic runner. */
  onPointerDown?: (ctx: {
    gl: GLContext;
    program: WebGLProgram;
    canvasX: number;
    canvasY: number;
    time: number;
  }) => void;
};

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function buildShaderConfig(props: WebGLBackgroundProps, ripple: RippleState): ShaderConfig {
  switch (props.variant) {
    case "aurora": {
      const stops = props.colorStops ?? DEFAULT_AURORA_STOPS;
      const flat = stops.flatMap(hexToRgb);
      return {
        frag: AURORA_FRAG,
        useMouse: false,
        uniforms: {
          uAmplitude: { type: "1f", value: props.amplitude ?? 1 },
          uBlend: { type: "1f", value: props.blend ?? 0.5 },
          uColorStops: { type: "3fv", value: flat },
        },
      };
    }
    case "silk": {
      const rgb = hexToRgb(props.color ?? "#7b7482");
      return {
        frag: SILK_FRAG,
        useMouse: false,
        uniforms: {
          uColor: { type: "3f", value: rgb },
          uSpeed: { type: "1f", value: props.speed ?? 0.5 },
          uScale: { type: "1f", value: props.scale ?? 1 },
          uRotation: { type: "1f", value: props.rotation ?? 0 },
          uNoiseIntensity: { type: "1f", value: props.noiseIntensity ?? 1.5 },
        },
      };
    }
    case "plasma": {
      const rgb = hexToRgb(props.color ?? "#8c7dff");
      return {
        frag: PLASMA_FRAG,
        useMouse: true,
        uniforms: {
          uCustomColor: { type: "3f", value: rgb },
          uUseCustomColor: { type: "1f", value: 1 },
          uSpeed: { type: "1f", value: props.speed ?? 1 },
          uDirection: { type: "1f", value: 1 },
          uScale: { type: "1f", value: props.scale ?? 1 },
          uOpacity: { type: "1f", value: props.opacity ?? 1 },
          uMouseInteractive: { type: "1f", value: 1 },
        },
      };
    }
    case "light-rays": {
      const rgb = hexToRgb(props.color ?? "#ffffff");
      return {
        frag: LIGHT_RAYS_FRAG,
        useMouse: false,
        uniforms: {
          raysColor: { type: "3f", value: rgb },
          raysSpeed: { type: "1f", value: props.speed ?? 1 },
          lightSpread: { type: "1f", value: props.spread ?? 1 },
          rayLength: { type: "1f", value: 2 },
          pulsating: { type: "1f", value: 0 },
          fadeDistance: { type: "1f", value: 1 },
          saturation: { type: "1f", value: 1 },
          mousePos: { type: "2f", value: [0.5, 0.5] },
          mouseInfluence: { type: "1f", value: 0 },
          noiseAmount: { type: "1f", value: 0 },
          distortion: { type: "1f", value: 0 },
        },
      };
    }
    case "pixel-blast": {
      const rgb = hexToRgb(props.color ?? "#b497cf");
      return {
        frag: PIXEL_BLAST_FRAG,
        useMouse: false,
        timeScale: 0.5,
        uniforms: {
          uColor: { type: "3f", value: rgb },
          uShapeType: { type: "1i", value: 0 },
          uPixelSize: { type: "1f", value: props.pixelSize ?? 3 },
          uScale: { type: "1f", value: 2 },
          uDensity: { type: "1f", value: 1 },
          uPixelJitter: { type: "1f", value: 0 },
          uEnableRipples: { type: "1i", value: 1 },
          uRippleSpeed: { type: "1f", value: 0.3 },
          uRippleThickness: { type: "1f", value: 0.1 },
          uRippleIntensity: { type: "1f", value: props.rippleIntensity ?? 1 },
          uEdgeFade: { type: "1f", value: 0.5 },
          uClickPos: { type: "2fv", value: ripple.positions },
          uClickTimes: { type: "1fv", value: ripple.times },
        },
        onPointerDown: ({ gl, program, canvasX, canvasY, time }) => {
          ripple.positions[ripple.index * 2] = canvasX;
          ripple.positions[ripple.index * 2 + 1] = canvasY;
          ripple.times[ripple.index] = time;
          ripple.index = (ripple.index + 1) % MAX_RIPPLE_CLICKS;
          const posLoc = gl.getUniformLocation(program, "uClickPos");
          const timeLoc = gl.getUniformLocation(program, "uClickTimes");
          if (posLoc) gl.uniform2fv(posLoc, new Float32Array(ripple.positions));
          if (timeLoc) gl.uniform1fv(timeLoc, new Float32Array(ripple.times));
        },
      };
    }
    case "dither": {
      const rgb = hexToRgb(props.color ?? "#808080");
      return {
        frag: DITHER_FRAG,
        useMouse: true,
        uniforms: {
          waveSpeed: { type: "1f", value: props.speed ?? 0.05 },
          waveFrequency: { type: "1f", value: 3 },
          waveAmplitude: { type: "1f", value: 0.3 },
          waveColor: { type: "3f", value: rgb },
          enableMouseInteraction: { type: "1i", value: 1 },
          mouseRadius: { type: "1f", value: 1 },
          colorNum: { type: "1f", value: 4 },
          pixelSize: { type: "1f", value: props.pixelSize ?? 2 },
        },
      };
    }
  }
}

function compileShader(gl: GLContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[webgl-background] shader compile error", gl.getShaderInfoLog(shader));
  }
  return shader;
}

function applyUniform(gl: GLContext, loc: WebGLUniformLocation, spec: UniformSpec) {
  switch (spec.type) {
    case "1f":
      gl.uniform1f(loc, spec.value);
      break;
    case "1i":
      gl.uniform1i(loc, spec.value);
      break;
    case "2f":
      gl.uniform2f(loc, spec.value[0], spec.value[1]);
      break;
    case "3f":
      gl.uniform3f(loc, spec.value[0], spec.value[1], spec.value[2]);
      break;
    case "1fv":
      gl.uniform1fv(loc, new Float32Array(spec.value));
      break;
    case "2fv":
      gl.uniform2fv(loc, new Float32Array(spec.value));
      break;
    case "3fv":
      gl.uniform3fv(loc, new Float32Array(spec.value));
      break;
  }
}

const GL_CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: true,
  premultipliedAlpha: true,
  antialias: true,
};

/**
 * Runs a full-screen fragment shader inside `containerRef`, mirroring
 * motion-anything's `_fx/shaderbg.js`: WebGL1/WebGL2 auto-detection, the
 * uTime/uResolution/uMouse auto-uniforms, a devicePixelRatio-aware resize
 * loop, and a single static frame under reduced motion. Returns whether
 * a WebGL context could be created, so the caller can render a CSS fallback.
 */
function useShaderCanvas(
  containerRef: RefObject<HTMLDivElement | null>,
  config: ShaderConfig,
  reducedMotion: boolean,
): boolean {
  const [supported, setSupported] = useState(true);
  const configRef = useRef(config);
  configRef.current = config;
  // uClickPos/uClickTimes (pixel-blast) mutate outside of React's render cycle as the user
  // clicks; excluding them keeps an unrelated re-render from tearing down and rebuilding the
  // WebGL context mid-interaction.
  const configKey = `${config.frag}|${JSON.stringify(config.uniforms, (key, value) =>
    key === "uClickPos" || key === "uClickTimes" ? undefined : value,
  )}|${config.useMouse}|${config.timeScale ?? 1}`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: configKey is a synthetic dep that mirrors configRef.current, which the effect reads live
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const container: HTMLDivElement = containerEl;
    const { frag, uniforms, useMouse, timeScale = 1, onPointerDown } = configRef.current;

    const isGL2 = /#version\s+300/.test(frag);
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    container.appendChild(canvas);

    const gl: GLContext | null =
      (isGL2 ? canvas.getContext("webgl2", GL_CONTEXT_OPTIONS) : null) ??
      canvas.getContext("webgl", GL_CONTEXT_OPTIONS);

    if (!gl) {
      container.removeChild(canvas);
      setSupported(false);
      return;
    }
    const glCtx: GLContext = gl;

    const usesGL2 =
      typeof WebGL2RenderingContext !== "undefined" && glCtx instanceof WebGL2RenderingContext;
    const vert = usesGL2 ? VERT_GL2 : VERT_GL1;

    glCtx.clearColor(0, 0, 0, 0);
    glCtx.enable(glCtx.BLEND);
    glCtx.blendFunc(glCtx.ONE, glCtx.ONE_MINUS_SRC_ALPHA);

    const program = glCtx.createProgram();
    const vertShader = compileShader(glCtx, glCtx.VERTEX_SHADER, vert);
    const fragShader = compileShader(glCtx, glCtx.FRAGMENT_SHADER, frag);
    if (!program || !vertShader || !fragShader) {
      container.removeChild(canvas);
      setSupported(false);
      return;
    }
    glCtx.attachShader(program, vertShader);
    glCtx.attachShader(program, fragShader);
    glCtx.linkProgram(program);
    if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
      console.warn("[webgl-background] program link error", glCtx.getProgramInfoLog(program));
      container.removeChild(canvas);
      setSupported(false);
      return;
    }
    // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API method, not a React hook
    glCtx.useProgram(program);

    const posBuffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, posBuffer);
    glCtx.bufferData(
      glCtx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      glCtx.STATIC_DRAW,
    );
    const posLoc = glCtx.getAttribLocation(program, "position");
    glCtx.enableVertexAttribArray(posLoc);
    glCtx.vertexAttribPointer(posLoc, 2, glCtx.FLOAT, false, 0, 0);

    const uvLoc = glCtx.getAttribLocation(program, "uv");
    if (uvLoc >= 0) {
      const uvBuffer = glCtx.createBuffer();
      glCtx.bindBuffer(glCtx.ARRAY_BUFFER, uvBuffer);
      glCtx.bufferData(
        glCtx.ARRAY_BUFFER,
        new Float32Array([0, 0, 2, 0, 0, 2]),
        glCtx.STATIC_DRAW,
      );
      glCtx.enableVertexAttribArray(uvLoc);
      glCtx.vertexAttribPointer(uvLoc, 2, glCtx.FLOAT, false, 0, 0);
    }

    const uTimeLoc = glCtx.getUniformLocation(program, "uTime");
    const iTimeLoc = glCtx.getUniformLocation(program, "iTime");
    const uResLoc = glCtx.getUniformLocation(program, "uResolution");
    const iResLoc = glCtx.getUniformLocation(program, "iResolution");
    const uMouseLoc = useMouse ? glCtx.getUniformLocation(program, "uMouse") : null;
    const resolutionIsVec3 = /vec3\s+(uResolution|iResolution)/.test(frag);

    for (const [name, spec] of Object.entries(uniforms)) {
      const loc = glCtx.getUniformLocation(program, name);
      if (loc) applyUniform(glCtx, loc, spec);
    }

    let mouse: [number, number] = [0.5, 0.5];
    function handlePointerMove(event: PointerEvent) {
      const rect = container.getBoundingClientRect();
      mouse = [
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      ];
    }
    if (useMouse) {
      container.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    function handlePointerDown(event: PointerEvent) {
      if (!onPointerDown) return;
      const rect = container.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      onPointerDown({
        gl: glCtx,
        program,
        canvasX: (event.clientX - rect.left) * scaleX,
        canvasY: (rect.height - (event.clientY - rect.top)) * scaleY,
        time: currentTime,
      });
    }
    if (onPointerDown) {
      container.addEventListener("pointerdown", handlePointerDown, { passive: true });
    }

    function resize() {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      glCtx.viewport(0, 0, canvas.width, canvas.height);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let rafId = 0;
    let currentTime = reducedMotion ? 2 : 0;
    function frame(t: number) {
      const time = reducedMotion ? 2 : t * 0.001 * timeScale;
      currentTime = time;
      if (uTimeLoc) glCtx.uniform1f(uTimeLoc, time);
      if (iTimeLoc) glCtx.uniform1f(iTimeLoc, time);
      if (uResLoc) {
        if (resolutionIsVec3) glCtx.uniform3f(uResLoc, canvas.width, canvas.height, 1);
        else glCtx.uniform2f(uResLoc, canvas.width, canvas.height);
      }
      if (iResLoc) {
        if (resolutionIsVec3) glCtx.uniform3f(iResLoc, canvas.width, canvas.height, 1);
        else glCtx.uniform2f(iResLoc, canvas.width, canvas.height);
      }
      if (uMouseLoc) glCtx.uniform2f(uMouseLoc, mouse[0], mouse[1]);
      glCtx.clear(glCtx.COLOR_BUFFER_BIT);
      glCtx.drawArrays(glCtx.TRIANGLES, 0, 3);
      if (!reducedMotion) rafId = requestAnimationFrame(frame);
    }

    if (reducedMotion) {
      frame(2000);
    } else {
      rafId = requestAnimationFrame(frame);
    }

    setSupported(true);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (useMouse) container.removeEventListener("pointermove", handlePointerMove);
      if (onPointerDown) container.removeEventListener("pointerdown", handlePointerDown);
      glCtx.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [containerRef, configKey, reducedMotion]);

  return supported;
}

/* ------------------------------- component -------------------------------- */

/**
 * Full-screen WebGL fragment-shader background (aurora / silk / plasma /
 * light-rays / pixel-blast / dither). Ported from motion-anything's
 * dependency-free shader runner. Renders a single static frame under
 * reduced motion, and a CSS gradient fallback when no WebGL context is
 * available. pixel-blast additionally responds to clicks with a ripple.
 */
export function WebGLBackground(props: WebGLBackgroundProps) {
  const { className, variant } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const rippleRef = useRef<RippleState | null>(null);
  if (!rippleRef.current) rippleRef.current = createRippleState();
  const config = buildShaderConfig(props, rippleRef.current);
  const supported = useShaderCanvas(containerRef, config, reducedMotion);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      {!supported && (
        <div
          className="absolute inset-0"
          style={{ background: FALLBACK_GRADIENT[variant] }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
