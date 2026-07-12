"use client";

import { Import, Palette } from "lucide-react";
import { useState } from "react";
import { RangeSlider } from "@/components/motion/range-slider";
import {
  SettingsColorField,
  SettingsGhostButton,
  SettingsGroup,
  SettingsRow,
  SettingsSelectButton,
  SettingsTextField,
} from "@/components/motion/settings-panel";
import { Switch } from "@/components/motion/switch";

export function SettingsPanelPreview() {
  const [accent, setAccent] = useState("#339CFF");
  const [background, setBackground] = useState("#FFFFFF");
  const [font, setFont] = useState("");
  const [translucent, setTranslucent] = useState(true);
  const [contrast, setContrast] = useState(60);

  return (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-neutral-100 px-4 py-10 dark:bg-neutral-900">
      <div className="w-full max-w-xl">
        <SettingsGroup
          title="Light theme"
          actions={
            <>
              <SettingsGhostButton>
                <Import className="h-3.5 w-3.5" />
                Import
              </SettingsGhostButton>
              <SettingsSelectButton icon={<Palette className="h-3.5 w-3.5" />}>
                Default
              </SettingsSelectButton>
            </>
          }
        >
          <SettingsRow label="Accent color">
            <SettingsColorField value={accent} onChange={setAccent} aria-label="Accent color" />
          </SettingsRow>
          <SettingsRow label="Background">
            <SettingsColorField
              value={background}
              onChange={setBackground}
              aria-label="Background color"
            />
          </SettingsRow>
          <SettingsRow label="UI font">
            <SettingsTextField
              value={font}
              onChange={setFont}
              placeholder="-apple-system, Inter…"
              aria-label="UI font"
            />
          </SettingsRow>
          <SettingsRow label="Translucent sidebar" description="Let the desktop tint the sidebar">
            <Switch checked={translucent} onCheckedChange={setTranslucent} />
          </SettingsRow>
          <SettingsRow label="Contrast">
            <div className="flex w-[160px] items-center gap-2">
              <RangeSlider
                value={contrast}
                onValueChange={setContrast}
                className="w-24"
                aria-label="Contrast"
              />
              <span className="w-8 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
                {contrast}
              </span>
            </div>
          </SettingsRow>
        </SettingsGroup>
      </div>
    </div>
  );
}
