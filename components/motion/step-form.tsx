"use client";

import { Loader2 } from "lucide-react";
import {
  AnimatePresence,
  type AnimationControls,
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { EASE_OUT, SPRING_PANEL, SPRING_SWAP } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type StepFormStep =
  | {
      id: string;
      kind: "text";
      /** Small mono, uppercase, wide-tracking label above the title. */
      eyebrow?: string;
      title: string;
      hint?: string;
      placeholder?: string;
      inputType?: "text" | "email";
      required?: boolean;
      /** Return an error message to block continuing, or null when valid. */
      validate?: (value: string) => string | null;
    }
  | {
      id: string;
      kind: "choice";
      eyebrow?: string;
      title: string;
      hint?: string;
      options: { value: string; label: string; description?: string }[];
      required?: boolean;
    };

export interface StepFormProps {
  steps: StepFormStep[];
  onComplete?: (values: Record<string, string>) => void | Promise<void>;
  /** Default "All set". */
  successTitle?: string;
  successMessage?: string;
  /** Provide to show a ghost "restart" button on the success screen. */
  onRestart?: () => void;
  className?: string;
}

type StepDirection = 1 | -1;
type FormStatus = "active" | "submitting" | "success";

/** Horizontal travel for the directional step swap — spec-mandated 24px. */
const STEP_SLIDE_OFFSET = 24;
/** Pause after picking an option, long enough to register the choice before advancing. */
const CHOICE_AUTO_ADVANCE_MS = 250;

const stepVariants: Variants = {
  enter: (direction: StepDirection) => ({
    opacity: 0,
    x: direction * STEP_SLIDE_OFFSET,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: (direction: StepDirection) => ({
    opacity: 0,
    x: direction * -STEP_SLIDE_OFFSET,
    transition: { duration: 0.18, ease: EASE_OUT },
  }),
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Mirrors the shake feel from input.tsx's own error effect. */
function shake(controls: AnimationControls, reduce: boolean) {
  if (reduce) return;
  controls.start({
    x: [0, -6, 6, -4, 4, -2, 0],
    transition: { duration: 0.45 },
  });
}

function SegmentedProgress({
  steps,
  activeIndex,
  reduce,
}: {
  steps: StepFormStep[];
  activeIndex: number;
  reduce: boolean;
}) {
  return (
    <div aria-hidden className="flex flex-1 items-center gap-1.5">
      {steps.map((step, index) => {
        const filled = index <= activeIndex;
        return (
          <span
            key={step.id}
            className="h-1 flex-1 overflow-hidden rounded-full bg-border"
          >
            <motion.span
              className="block h-full w-full origin-left rounded-full bg-foreground"
              initial={false}
              animate={{ scaleX: filled ? 1 : 0 }}
              transition={
                reduce
                  ? { duration: 0.12 }
                  : { duration: 0.35, ease: EASE_OUT }
              }
            />
          </span>
        );
      })}
    </div>
  );
}

function SuccessCheck({ reduce }: { reduce: boolean }) {
  return (
    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-(--color-success)/12 text-(--color-success)">
      <svg viewBox="0 0 48 48" fill="none" className="h-7 w-7" aria-hidden="true">
        <motion.circle
          cx="24"
          cy="24"
          r="21"
          stroke="currentColor"
          strokeWidth={2.5}
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        />
        <motion.path
          d="M14 24.5l6.5 6.5L34 17"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.4,
            ease: EASE_OUT,
            delay: reduce ? 0 : 0.35,
          }}
        />
      </svg>
    </span>
  );
}

/** Shared enter/animate/exit for the two outer views (form ⇄ success). */
function outerViewMotionProps(reduce: boolean) {
  return {
    initial: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 8, filter: "blur(4px)" },
    animate: reduce
      ? { opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.24, ease: EASE_OUT },
        },
    exit: reduce
      ? { opacity: 0, transition: { duration: 0.14, ease: EASE_OUT } }
      : {
          opacity: 0,
          y: -8,
          filter: "blur(4px)",
          transition: { duration: 0.16, ease: EASE_OUT },
        },
  } as const;
}

export function StepForm({
  steps,
  onComplete,
  successTitle = "All set",
  successMessage,
  onRestart,
  className,
}: StepFormProps) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const fieldId = `${baseId}-field`;
  const errorId = `${baseId}-error`;

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<StepDirection>(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("active");

  const inputRef = useRef<HTMLInputElement>(null);
  const choiceShake = useAnimationControls();
  const choiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFocusRef = useRef(true);

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const currentValue = currentStep ? (values[currentStep.id] ?? "") : "";
  const submitting = status === "submitting";

  const clearChoiceTimer = () => {
    if (choiceTimerRef.current !== null) {
      clearTimeout(choiceTimerRef.current);
      choiceTimerRef.current = null;
    }
  };

  // Cancel any pending auto-advance if the form unmounts mid-pause.
  useEffect(() => {
    return () => {
      if (choiceTimerRef.current !== null) clearTimeout(choiceTimerRef.current);
    };
  }, []);

  // Focus the field on every step arrival except the very first paint, so
  // landing on the form never steals focus but advancing keeps you typing.
  // Re-reads `steps[stepIndex]` instead of closing over `currentStep` so a
  // run between two consecutive "text" steps still re-triggers on index
  // change (kind alone wouldn't differ).
  useEffect(() => {
    if (skipFocusRef.current) {
      skipFocusRef.current = false;
      return;
    }
    const step = steps[stepIndex];
    if (status !== "active" || step?.kind !== "text") return;
    const timeoutId = setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      reduce ? 0 : 260,
    );
    return () => clearTimeout(timeoutId);
  }, [stepIndex, status, reduce, steps]);

  if (!currentStep) return null;

  const goToStep = (nextIndex: number, dir: StepDirection) => {
    clearChoiceTimer();
    setFieldError(null);
    setDirection(dir);
    setStepIndex(nextIndex);
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    goToStep(stepIndex - 1, -1);
  };

  const handleComplete = async () => {
    setStatus("submitting");
    try {
      await onComplete?.(values);
      setStatus("success");
    } catch {
      // No error UX is specified for a rejected onComplete — fall back to
      // the editable step so the user can retry instead of getting stuck.
      setStatus("active");
    }
  };

  const advance = () => {
    if (isLastStep) {
      void handleComplete();
      return;
    }
    goToStep(stepIndex + 1, 1);
  };

  const handleValueChange = (next: string) => {
    setValues((prev) => ({ ...prev, [currentStep.id]: next }));
    setFieldError(null);
  };

  const handleContinue = () => {
    if (submitting) return;

    if (currentStep.kind === "text") {
      const trimmed = currentValue.trim();
      if (currentStep.required && trimmed.length === 0) {
        setFieldError("This field is required.");
        return;
      }
      const validationError =
        trimmed.length > 0 ? currentStep.validate?.(currentValue) : null;
      if (validationError) {
        setFieldError(validationError);
        return;
      }
    } else if (currentStep.required && !currentValue) {
      setFieldError("Choose an option to continue.");
      shake(choiceShake, !!reduce);
      return;
    }

    advance();
  };

  const handleChoiceSelect = (value: string) => {
    if (submitting) return;
    handleValueChange(value);
    clearChoiceTimer();
    choiceTimerRef.current = setTimeout(() => {
      choiceTimerRef.current = null;
      advance();
    }, CHOICE_AUTO_ADVANCE_MS);
  };

  const titleClassName = cn(
    "block text-2xl font-semibold leading-snug text-foreground",
    currentStep.eyebrow && "mt-2",
  );

  return (
    <motion.div
      layout
      transition={SPRING_PANEL}
      className={cn(
        "w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm will-change-transform sm:p-8",
        className,
      )}
    >
      <motion.div layout="position">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              {...outerViewMotionProps(!!reduce)}
              className="flex flex-col items-center px-2 py-4 text-center"
            >
              <SuccessCheck reduce={!!reduce} />
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {successTitle}
              </h3>
              {successMessage ? (
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {successMessage}
                </p>
              ) : null}
              {onRestart ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-6"
                  onClick={onRestart}
                >
                  Restart
                </Button>
              ) : null}
            </motion.div>
          ) : (
            <motion.div key="form" {...outerViewMotionProps(!!reduce)}>
              <div className="flex items-center gap-4">
                <SegmentedProgress
                  steps={steps}
                  activeIndex={stepIndex}
                  reduce={!!reduce}
                />
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  <span className="text-foreground">
                    {pad(stepIndex + 1)}
                  </span>
                  <span className="px-0.5">/</span>
                  {pad(steps.length)}
                </span>
              </div>

              <div className="mt-8">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={currentStep.id}
                    custom={direction}
                    variants={stepVariants}
                    initial={reduce ? { opacity: 0 } : "enter"}
                    animate={
                      reduce
                        ? { opacity: 1, transition: { duration: 0.18, ease: EASE_OUT } }
                        : "center"
                    }
                    exit={
                      reduce
                        ? { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } }
                        : "exit"
                    }
                  >
                    <div className="flex flex-col gap-2">
                      {currentStep.eyebrow ? (
                        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {currentStep.eyebrow}
                        </p>
                      ) : null}

                      {currentStep.kind === "text" ? (
                        <label htmlFor={fieldId} className={titleClassName}>
                          {currentStep.title}
                        </label>
                      ) : (
                        <h3 className={titleClassName}>{currentStep.title}</h3>
                      )}

                      {currentStep.hint ? (
                        <p className="text-sm text-muted-foreground">
                          {currentStep.hint}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6">
                      {currentStep.kind === "text" ? (
                        <Input
                          ref={inputRef}
                          id={fieldId}
                          type={currentStep.inputType === "email" ? "email" : "text"}
                          inputMode={currentStep.inputType === "email" ? "email" : "text"}
                          placeholder={currentStep.placeholder}
                          value={currentValue}
                          onChange={handleValueChange}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleContinue();
                            }
                          }}
                          error={Boolean(fieldError)}
                          aria-describedby={fieldError ? errorId : undefined}
                          disabled={submitting}
                        />
                      ) : (
                        <motion.div
                          animate={choiceShake}
                          className="flex flex-col gap-2.5"
                        >
                          {currentStep.options.map((option) => {
                            const selected = currentValue === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                aria-pressed={selected}
                                disabled={submitting}
                                onClick={() => handleChoiceSelect(option.value)}
                                className={cn(
                                  "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors disabled:pointer-events-none disabled:opacity-60",
                                  selected
                                    ? "border-foreground bg-primary/5"
                                    : "border-border hover:bg-primary/5",
                                )}
                              >
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-foreground">
                                    {option.label}
                                  </span>
                                  {option.description ? (
                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                      {option.description}
                                    </span>
                                  ) : null}
                                </span>
                                <span
                                  aria-hidden
                                  className={cn(
                                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                                    selected ? "border-foreground" : "border-border",
                                  )}
                                >
                                  <motion.span
                                    className="h-2 w-2 rounded-full bg-foreground"
                                    initial={false}
                                    animate={{ scale: selected ? 1 : 0 }}
                                    transition={
                                      reduce ? { duration: 0.12 } : SPRING_SWAP
                                    }
                                  />
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-2 min-h-[1.25rem] px-1">
                      <AnimatePresence initial={false}>
                        {fieldError ? (
                          <motion.p
                            key="error"
                            id={errorId}
                            role="alert"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-xs text-destructive"
                          >
                            {fieldError}
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <AnimatePresence initial={false}>
                  {stepIndex > 0 ? (
                    <motion.span
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={goBack}
                        disabled={submitting}
                      >
                        Back
                      </Button>
                    </motion.span>
                  ) : null}
                </AnimatePresence>

                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={submitting}
                  className="ml-auto"
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Submitting…
                    </span>
                  ) : isLastStep ? (
                    "Complete"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
