"use client";

import {
  Building2,
  ChevronDown,
  CreditCard,
  Palette,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/motion/dropdown-menu";

const THEMES = ["Light", "Dark", "System"] as const;

export function DropdownMenuPreview() {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("System");

  return (
    <div className="flex min-h-[30rem] w-full items-start justify-center pt-4">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger className="group">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          Acme workspace
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-aria-expanded:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuItem
            icon={<User />}
            description="Personal details"
            shortcut="⌘P"
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem icon={<CreditCard />} description="Plans & invoices">
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Email notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<Palette />}>
              Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {THEMES.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={theme === t}
                  onCheckedChange={() => setTheme(t)}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem shortcut="?">Help center</DropdownMenuItem>
          <DropdownMenuItem disabled description="Available on Enterprise">
            Enterprise controls
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive icon={<Trash2 />}>
            Delete workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
