"use client";

import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  type AnimationControls,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EASE_OUT, SPRING_PRESS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface LoginCardProps {
  className?: string;
  /** 头部两行标题，默认 ["登录后", "有问题，免费聊"] */
  titleLines?: string[];
  /** 区号，默认 "+86" */
  countryCode?: string;
  /** 区号可选项，默认 ["+86","+852","+886","+1","+44","+81"] */
  countryOptions?: string[];
  /** 覆盖二维码槽位；不传则渲染内置占位二维码 */
  qr?: React.ReactNode;
  /** 内置占位二维码的种子，默认 20260719 */
  qrSeed?: number;
  /** 卡片下方的备案小字；传 null 隐藏；不传用默认 ICP 文案 */
  footer?: React.ReactNode;
  /** 点「登录」回调，可 async；期间按钮显示加载态 */
  onSubmit?: (data: {
    phone: string;
    code: string;
    countryCode: string;
  }) => void | Promise<void>;
  /** 点「发送」回调，可 async */
  onSendCode?: (phone: string) => void | Promise<void>;
}

const DEFAULT_TITLE_LINES = ["登录后", "有问题，免费聊"];
const DEFAULT_COUNTRY_OPTIONS = ["+86", "+852", "+886", "+1", "+44", "+81"];

function shake(controls: AnimationControls, reduce: boolean) {
  if (reduce) return;
  controls.start({
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4 },
  });
}

function PlaceholderQr({
  seed = 20260719,
  size = 25,
}: {
  seed?: number;
  size?: number;
}) {
  const matrix = useMemo(() => {
    let a = seed >>> 0;
    const rand = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const m: boolean[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => rand() > 0.52),
    );
    const finder = (r0: number, c0: number) => {
      // 先清出 9x9 的静默区
      for (let r = r0 - 1; r <= r0 + 7; r++)
        for (let c = c0 - 1; c <= c0 + 7; c++)
          if (r >= 0 && c >= 0 && r < size && c < size) m[r][c] = false;
      // 画 7x7 回字定位块
      for (let r = 0; r < 7; r++)
        for (let c = 0; c < 7; c++) {
          const ring = r === 0 || r === 6 || c === 0 || c === 6;
          const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          m[r0 + r][c0 + c] = ring || core;
        }
    };
    finder(0, 0);
    finder(0, size - 7);
    finder(size - 7, 0);
    return m;
  }, [seed, size]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-[168px] w-[168px]"
      shapeRendering="crispEdges"
      role="img"
      aria-label="登录二维码占位图"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size deterministic grid, cells never reorder
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1}
              height={1}
              fill="#18181b"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export function LoginCard({
  className,
  titleLines = DEFAULT_TITLE_LINES,
  countryCode = "+86",
  countryOptions = DEFAULT_COUNTRY_OPTIONS,
  qr,
  qrSeed = 20260719,
  footer,
  onSubmit,
  onSendCode,
}: LoginCardProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [cc, setCc] = useState(countryCode);
  const [ccOpen, setCcOpen] = useState(false);

  const phoneShake = useAnimationControls();
  const agreeShake = useAnimationControls();

  useEffect(
    () => () => {
      if (countdownTimerRef.current !== null) {
        clearInterval(countdownTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!ccOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setCcOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [ccOpen]);

  const handleSend = async () => {
    if (countdown > 0) return;
    if (phone.trim().length === 0) {
      shake(phoneShake, !!reduce);
      return;
    }
    await onSendCode?.(phone);
    setCountdown(60);
    countdownTimerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownTimerRef.current !== null) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!agreed) {
      shake(agreeShake, !!reduce);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit?.({ phone, code, countryCode: cc });
    } finally {
      setSubmitting(false);
    }
  };

  const dropdownInitial = reduce
    ? { opacity: 0 }
    : { opacity: 0, y: -6, filter: "blur(2px)" };
  const dropdownAnimate = reduce
    ? { opacity: 1 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };
  const dropdownExit = dropdownInitial;

  return (
    <div ref={rootRef} className={cn("w-full max-w-[680px]", className)}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.28)]">
        {/* (a) 头部渐变条 */}
        <div className="relative overflow-hidden px-9 pt-10 pb-12 bg-[linear-gradient(120deg,#5a9bff_0%,#3f82ff_52%,#2f6cff_100%)]">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
          >
            {/* 右上角大面积柔光，营造高光区 */}
            <div
              className="absolute -right-16 -top-24 h-72 w-72 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.4), rgba(255,255,255,0) 70%)",
              }}
            />
            {/* 柔和玻璃光球：左上更亮、向外渐淡，缓慢漂浮 */}
            <motion.div
              className="absolute right-[11%] top-[12%] h-32 w-32 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.62), rgba(255,255,255,0.05) 68%)",
              }}
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[3%] top-[46%] h-24 w-24 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), rgba(255,255,255,0.04) 70%)",
              }}
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
            />
            <div
              className="absolute right-[30%] top-[8%] h-14 w-14 rounded-full blur-[1px]"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0) 72%)",
              }}
            />
            {/* 极淡弧线 */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 680 200"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M400 -20 C 520 40, 560 120, 700 150"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <path
                d="M440 -40 C 600 30, 620 150, 760 180"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            </svg>
            {/* 点缀亮点 */}
            <div className="absolute right-[16%] top-[38%] h-1 w-1 rounded-full bg-white/80" />
            <div className="absolute right-[38%] top-[50%] h-1 w-1 rounded-full bg-white/70" />
            <div className="absolute right-[9%] top-[74%] h-1 w-1 rounded-full bg-white/70" />
          </div>
          <h2 className="relative text-[27px] font-bold leading-[1.32] text-white">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        {/* (b) 主体两栏 */}
        <div className="grid grid-cols-1 gap-8 px-9 py-8 md:grid-cols-2 md:gap-0">
          <div className="flex flex-col items-center md:pr-9">
            <div className="mb-6 text-base font-medium text-[#374151]">
              微信扫码登录
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              {qr ?? <PlaceholderQr seed={qrSeed} />}
            </div>
          </div>

          <div className="flex flex-col md:border-l md:border-[#eef0f3] md:pl-9">
            <div className="mb-6 text-center text-base font-medium text-[#374151]">
              手机号快捷登录
            </div>

            <motion.div animate={phoneShake}>
              <div className="flex h-14 items-center rounded-xl border border-transparent bg-[#f5f6f8] px-4 transition-colors focus-within:border-[#2f6bff]">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCcOpen((v) => !v)}
                    className="flex shrink-0 items-center gap-1 text-[15px] text-[#374151]"
                  >
                    {cc}
                    <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
                  </button>
                  <AnimatePresence>
                    {ccOpen ? (
                      <motion.ul
                        initial={dropdownInitial}
                        animate={dropdownAnimate}
                        exit={dropdownExit}
                        transition={{ duration: 0.16, ease: EASE_OUT }}
                        className="absolute left-0 top-full z-20 mt-2 w-28 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                      >
                        {countryOptions.map((o) => (
                          <li key={o}>
                            <button
                              type="button"
                              className="block w-full px-3 py-1.5 text-left text-sm text-[#374151] hover:bg-slate-50"
                              onClick={() => {
                                setCc(o);
                                setCcOpen(false);
                              }}
                            >
                              {o}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>
                </div>
                <span className="mx-3 h-5 w-px bg-slate-200" aria-hidden />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="手机号"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-[#374151] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </motion.div>

            <div className="mt-4 flex h-14 items-center rounded-xl border border-transparent bg-[#f5f6f8] px-4 focus-within:border-[#2f6bff]">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                placeholder="验证码"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[#374151] outline-none placeholder:text-[#9ca3af]"
              />
              <span className="mx-3 h-5 w-px bg-slate-200" aria-hidden />
              <button
                type="button"
                disabled={countdown > 0}
                onClick={handleSend}
                className="shrink-0 text-[15px] font-medium text-[#2f6bff] disabled:text-[#9ca3af]"
              >
                {countdown > 0 ? `${countdown}s` : "发送"}
              </button>
            </div>

            <motion.button
              type="button"
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={SPRING_PRESS}
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 h-14 w-full rounded-xl bg-[#2f6bff] text-[16px] font-medium text-white transition-colors hover:bg-[#2560e8] disabled:opacity-70"
            >
              {submitting ? "登录中…" : "登录"}
            </motion.button>
          </div>
        </div>

        {/* (c) 协议 + 反馈行 */}
        <div className="px-9 pb-7">
          <motion.div animate={agreeShake}>
            <div className="flex items-center justify-center gap-2 text-sm text-[#6b7280]">
              <button
                type="button"
                aria-pressed={agreed}
                aria-label="同意协议"
                onClick={() => setAgreed((v) => !v)}
                className={cn(
                  "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-colors",
                  agreed
                    ? "border-[#2f6bff] bg-[#2f6bff]"
                    : "border-slate-300 bg-white",
                )}
              >
                <AnimatePresence>
                  {agreed ? (
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 text-white"
                    >
                      <motion.path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={
                          reduce ? { pathLength: 1 } : { pathLength: 0 }
                        }
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </motion.svg>
                  ) : null}
                </AnimatePresence>
              </button>
              <span>
                已阅读同意{" "}
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder legal links, real product wires the actual URLs */}
                <a href="#" className="text-[#2f6bff] hover:underline">
                  《模型服务协议》
                </a>{" "}
                和{" "}
                {/* biome-ignore lint/a11y/useValidAnchor: placeholder legal links, real product wires the actual URLs */}
                <a href="#" className="text-[#2f6bff] hover:underline">
                  《用户隐私协议》
                </a>
              </span>
            </div>
          </motion.div>
          <div className="mt-2.5 text-center text-sm text-[#9ca3af]">
            遇到问题？{" "}
            <a
              // biome-ignore lint/a11y/useValidAnchor: placeholder feedback link, real product wires the actual URL
              href="#"
              className="text-[#6b7280] hover:text-[#374151] hover:underline"
            >
              去反馈
            </a>
          </div>
        </div>
      </div>

      {/* (d) footer（卡片外） */}
      {footer !== null ? (
        <div className="mt-6">
          {footer ?? (
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-xs text-[#9ca3af]">
              <span>© 2026 你的公司名称</span>
              <span>ICP 备案号 000000</span>
              <span>公安备案号 000000</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
