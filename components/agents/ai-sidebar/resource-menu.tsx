"use client";

import {
  ArrowDown,
  ArrowUp,
  FolderInput,
  type LucideIcon,
  Pencil,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import type { SidebarResourceMoveCommands } from "./types";

export function ResourceMenuAction({
  icon: Icon,
  onSelect,
  children,
}: {
  icon: LucideIcon;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="min-w-0 truncate">{children}</span>
    </button>
  );
}

export function DefaultResourceMenu({
  moves,
  onClose,
  onRename,
}: {
  moves: SidebarResourceMoveCommands;
  onClose: () => void;
  onRename: () => void;
}) {
  const runFromMenu = (action: () => void) => () => {
    onClose();
    action();
  };

  return (
    <>
      <ResourceMenuAction icon={Pencil} onSelect={runFromMenu(onRename)}>
        Rename
      </ResourceMenuAction>
      {moves.up || moves.down || moves.into || moves.out ? (
        <div aria-hidden="true" className="my-1 h-px bg-border" />
      ) : null}
      {moves.up ? (
        <ResourceMenuAction icon={ArrowUp} onSelect={runFromMenu(moves.up)}>
          Move up
        </ResourceMenuAction>
      ) : null}
      {moves.down ? (
        <ResourceMenuAction icon={ArrowDown} onSelect={runFromMenu(moves.down)}>
          Move down
        </ResourceMenuAction>
      ) : null}
      {moves.into ? (
        <ResourceMenuAction
          icon={FolderInput}
          onSelect={runFromMenu(moves.into.run)}
        >
          Move into {moves.into.label}
        </ResourceMenuAction>
      ) : null}
      {moves.out ? (
        <ResourceMenuAction icon={Undo2} onSelect={runFromMenu(moves.out)}>
          Move out
        </ResourceMenuAction>
      ) : null}
    </>
  );
}
