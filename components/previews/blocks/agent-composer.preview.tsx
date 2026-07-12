"use client";

import {
  CircleAlert,
  CircleX,
  FileText,
  FolderGit2,
  GitBranch,
  Globe,
  Image as ImageIcon,
  Laptop,
  ListTodo,
  Mic,
  Paperclip,
  Plus,
  Target,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Composer,
  ComposerAccessChip,
  ComposerAttachmentChip,
  ComposerAttachments,
  ComposerChip,
  ComposerContextBar,
  ComposerContextGauge,
  ComposerDictation,
  ComposerEffortSlider,
  ComposerIconButton,
  ComposerMenuButton,
  ComposerMenuItem,
  ComposerMenuSection,
  ComposerModelPicker,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer";
import { EASE_OUT } from "@/lib/ease";

const EFFORT_LABELS = ["Minimal", "Low", "Standard", "High", "Max"];
const RUN_DURATION_MS = 3000;

/** Desktop-wallpaper backdrop behind the (transparent) composer shell. */
function Backdrop() {
  return (
    <>
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.25), transparent 55%), " +
            "radial-gradient(ellipse at 80% 15%, rgba(236, 72, 153, 0.18), transparent 50%), " +
            "radial-gradient(ellipse at 50% 100%, rgba(45, 212, 191, 0.2), transparent 55%), " +
            "linear-gradient(180deg, #eef1f5, #e4e8ef)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.28), transparent 55%), " +
            "radial-gradient(ellipse at 80% 15%, rgba(217, 70, 160, 0.22), transparent 50%), " +
            "radial-gradient(ellipse at 50% 100%, rgba(20, 184, 166, 0.22), transparent 55%), " +
            "linear-gradient(180deg, #17181d, #0e0f12)",
        }}
      />
    </>
  );
}

export function AgentComposerPreview() {
  const reduce = useReducedMotion() ?? false;
  const [value, setValue] = useState("");
  const [running, setRunning] = useState(false);
  const [effort, setEffort] = useState(3); // "High"
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [attachments, setAttachments] = useState([
    { id: "spec", name: "spec.md", meta: "12 KB", icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "mockup", name: "mockup.png", meta: "1.2 MB", icon: <ImageIcon className="h-3.5 w-3.5" /> },
  ]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startRecording = () => {
    setRecording(true);
    setSeconds(0);
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRecording(false);
    setSeconds(0);
  };

  // Demo send/stop state machine: clicking Send while idle with text runs
  // for RUN_DURATION_MS then resets and clears the draft (simulating the
  // agent having received it); clicking Stop mid-run just resets, keeping
  // the draft so the user can retry. Sending also exits dictation.
  const handleSend = () => {
    if (recording) stopRecording();
    if (running) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      setRunning(false);
      return;
    }
    if (!value.trim()) return;
    setRunning(true);
    timerRef.current = setTimeout(() => {
      setRunning(false);
      setValue("");
      timerRef.current = null;
    }, RUN_DURATION_MS);
  };

  const closeAddMenu = () => setAddOpen(false);

  // Rendered in both toolbar layouts — only one mounts at a time, so the
  // controlled open state carries over cleanly.
  const addMenu = (
    <ComposerMenuButton
      icon={<Plus className="h-4 w-4" />}
      aria-label="Add files and more"
      align="start"
      open={addOpen}
      onOpenChange={setAddOpen}
    >
      <ComposerMenuSection title="Add">
        <ComposerMenuItem icon={<Paperclip className="h-4 w-4" />} onSelect={closeAddMenu}>
          Files & folders
        </ComposerMenuItem>
        <ComposerMenuItem icon={<Globe className="h-4 w-4" />} onSelect={closeAddMenu}>
          Attach browser
        </ComposerMenuItem>
        <ComposerMenuItem
          icon={<Target className="h-4 w-4" />}
          description="Set a goal to keep pursuing"
          onSelect={closeAddMenu}
        >
          Goal
        </ComposerMenuItem>
        <ComposerMenuItem
          icon={<ListTodo className="h-4 w-4" />}
          description="Draft a plan before acting"
          onSelect={closeAddMenu}
        >
          Plan mode
        </ComposerMenuItem>
      </ComposerMenuSection>
      <ComposerMenuSection title="Agents">
        <ComposerMenuItem
          description="Researches a decision and returns a comparison"
          onSelect={closeAddMenu}
        >
          Research Assistant
        </ComposerMenuItem>
        <ComposerMenuItem
          description="Reviews changes for bugs and risky patterns"
          onSelect={closeAddMenu}
        >
          Code Reviewer
        </ComposerMenuItem>
        <ComposerMenuItem description="Drafts docs from the current diff" onSelect={closeAddMenu}>
          Doc Writer
        </ComposerMenuItem>
      </ComposerMenuSection>
    </ComposerMenuButton>
  );

  const sendButton = (
    <ComposerSendButton
      running={running}
      disabled={!running && !recording && value.trim().length === 0}
      onClick={handleSend}
    />
  );

  const rowMotion = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, scale: 1 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    transition: { duration: 0.15, ease: EASE_OUT },
  } as const;

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-border">
      <Backdrop />
      <div className="relative flex h-full w-full flex-col items-center justify-end px-4 pb-12">
        <div className="w-full max-w-xl">
          <ComposerContextBar>
            <ComposerChip
              icon={<FolderGit2 className="h-4 w-4" />}
              hoverIcon={<CircleX className="h-4 w-4" />}
              title="Change project"
              onClick={() => {}}
            >
              ui-lab
            </ComposerChip>
            <ComposerChip icon={<Laptop className="h-4 w-4" />} onClick={() => {}}>
              Local
            </ComposerChip>
            <ComposerChip icon={<GitBranch className="h-4 w-4" />} onClick={() => {}}>
              main
            </ComposerChip>
          </ComposerContextBar>
          <Composer>
            <ComposerAttachments>
              <AnimatePresence>
                {attachments.map((file) => (
                  <ComposerAttachmentChip
                    key={file.id}
                    icon={file.icon}
                    name={file.name}
                    meta={file.meta}
                    onRemove={() => setAttachments((prev) => prev.filter((f) => f.id !== file.id))}
                  />
                ))}
              </AnimatePresence>
            </ComposerAttachments>
            <ComposerTextarea
              value={value}
              onChange={setValue}
              onSubmit={handleSend}
              placeholder="Describe your next change…"
              aria-label="Message"
            />
            <ComposerToolbar>
              <AnimatePresence mode="wait" initial={false}>
                {recording ? (
                  <motion.div
                    key="dictation"
                    className="flex min-w-0 flex-1 items-center gap-1"
                    {...rowMotion}
                  >
                    {addMenu}
                    <ComposerDictation
                      seconds={seconds}
                      onStop={stopRecording}
                      className="min-w-0 flex-1 px-1"
                    />
                    {sendButton}
                  </motion.div>
                ) : (
                  <motion.div
                    key="tools"
                    className="flex min-w-0 flex-1 items-center gap-1"
                    {...rowMotion}
                  >
                    {addMenu}
                    <ComposerAccessChip icon={<CircleAlert className="h-4 w-4" />}>
                      Full access
                    </ComposerAccessChip>
                    <div className="ml-auto" />
                    <ComposerContextGauge used={64000} limit={200000} />
                    <ComposerModelPicker
                      label={`5.6 · ${EFFORT_LABELS[effort]}`}
                      open={pickerOpen}
                      onOpenChange={setPickerOpen}
                    >
                      <div className="flex items-center justify-between px-2 pt-1 text-muted-foreground text-xs">
                        <span>Reasoning effort</span>
                        <Zap className="h-3.5 w-3.5" />
                      </div>
                      <div className="px-2 pt-1 pb-2">
                        <ComposerEffortSlider
                          value={effort}
                          onChange={setEffort}
                          labels={EFFORT_LABELS}
                          aria-label="Reasoning effort"
                        />
                      </div>
                    </ComposerModelPicker>
                    <ComposerIconButton aria-label="Dictate" onClick={startRecording}>
                      <Mic className="h-4 w-4" />
                    </ComposerIconButton>
                    {sendButton}
                  </motion.div>
                )}
              </AnimatePresence>
            </ComposerToolbar>
          </Composer>
        </div>
      </div>
    </div>
  );
}
