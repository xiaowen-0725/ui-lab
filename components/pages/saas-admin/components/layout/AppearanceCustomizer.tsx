"use client";

import { type ComponentType, type JSX, type SVGProps, useId } from "react";
import {
	CheckIcon,
	CircleHelpIcon,
	PaletteIcon,
	RotateCcwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { DEFAULT_SAAS_ADMIN_APPEARANCE } from "../../appearance";
import { useSaasAdmin, type SaasAdminBrand } from "../../environment";
import { IconLayoutDefault } from "../../assets/svg/icon-layout-default";
import { IconLayoutCompact } from "../../assets/svg/icon-layout-compact";
import { IconLayoutFull } from "../../assets/svg/icon-layout-full";
import { IconSidebarInset } from "../../assets/svg/icon-sidebar-inset";
import { IconSidebarFloating } from "../../assets/svg/icon-sidebar-floating";
import { IconSidebarSidebar } from "../../assets/svg/icon-sidebar-sidebar";

interface Choice {
	value: string;
	label: string;
	icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

interface ChoiceFieldProps {
	label: string;
	value: string;
	choices: readonly Choice[];
	onChange: (value: string) => void;
}

/** A labelled official toggle group; preview illustrations are MIT upstream assets. */
function ChoiceField({
	label,
	value,
	choices,
	onChange,
}: ChoiceFieldProps): JSX.Element {
	const id = useId();
	const { t } = useSaasAdmin();
	const illustrated = choices.some((choice) => choice.icon);
	return (
		<Field>
			<FieldLabel id={id}>{t(label)}</FieldLabel>
			<ToggleGroup
				aria-labelledby={id}
				value={[value]}
				onValueChange={(values) => {
					if (values[0]) onChange(values[0]);
				}}
				variant="outline"
				spacing={illustrated ? 2 : 0}
				className="w-full items-stretch"
			>
				{choices.map(({ value: option, label: title, icon: Icon }) => (
					<ToggleGroupItem
						key={option}
						value={option}
						aria-label={t(title)}
						className={
							illustrated
								? "relative h-auto min-w-0 flex-1 flex-col gap-2 px-1.5 py-2 aria-pressed:border-foreground"
								: "min-w-0 flex-1"
						}
					>
						{Icon && (
							<span
								aria-hidden="true"
								className="block aspect-[79.86/51.14] w-full"
							>
								<Icon className="size-full fill-current stroke-current" />
							</span>
						)}
						<span className={illustrated ? "text-xs" : undefined}>
							{t(title)}
						</span>
						{illustrated && value === option && (
							<span
								aria-hidden="true"
								className="absolute -right-1 -top-1 rounded-full bg-foreground p-0.5 text-background"
							>
								<CheckIcon className="size-3" />
							</span>
						)}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</Field>
	);
}

function SelectField({
	label,
	value,
	choices,
	onChange,
}: ChoiceFieldProps): JSX.Element {
	const id = useId();
	const { t } = useSaasAdmin();
	const items = choices.map((choice) => ({
		value: choice.value,
		label: t(choice.label),
	}));
	return (
		<Field>
			<FieldLabel htmlFor={id}>{t(label)}</FieldLabel>
			<Select
				value={value}
				items={items}
				onValueChange={(next) => {
					if (next) onChange(next);
				}}
			>
				<SelectTrigger id={id} className="w-full">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</Field>
	);
}

export function AppearanceCustomizer(): JSX.Element {
	const { brand, mode, setBrand, setMode, appearance, setAppearance, t } =
		useSaasAdmin();
	const { open, setOpen } = useSidebar();
	const navigationLayout =
		open || appearance.sidebarMode === "none"
			? "default"
			: appearance.sidebarMode;
	function reset(): void {
		setOpen(true);
		setAppearance({ ...DEFAULT_SAAS_ADMIN_APPEARANCE });
		setBrand("default");
		setMode("system");
	}
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						aria-label={t("Theme Customizer")}
					/>
				}
			>
				<PaletteIcon />
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={8}
				className="w-80 max-w-[calc(100vw-1rem)] max-h-[min(90svh,var(--available-height))] overflow-y-auto"
			>
				<PopoverHeader>
					<div className="flex items-center justify-between gap-2">
						<PopoverTitle>{t("Theme Customizer")}</PopoverTitle>
						<div className="flex items-center gap-1">
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={t("Appearance help")}
										/>
									}
								>
									<CircleHelpIcon />
								</TooltipTrigger>
								<TooltipContent>
									{t(
										"Appearance changes keep your current page and unsaved edits.",
									)}
								</TooltipContent>
							</Tooltip>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={reset}
								aria-label={t("Reset appearance")}
							>
								<RotateCcwIcon />
							</Button>
						</div>
					</div>
					<PopoverDescription>
						{t("Customize your theme to your liking.")}
					</PopoverDescription>
				</PopoverHeader>
				<FieldGroup className="gap-4">
					<SelectField
						label="Theme Preset"
						value={brand}
						choices={[
							{ value: "default", label: "Default" },
							{ value: "blue-ink", label: "Blue Ink" },
						]}
						onChange={(value) => setBrand(value as SaasAdminBrand)}
					/>
					<SelectField
						label="Font"
						value={appearance.font}
						choices={[
							{ value: "geist", label: "Geist" },
							{ value: "system", label: "System sans-serif" },
						]}
						onChange={(font) =>
							setAppearance({
								...appearance,
								font: font as typeof appearance.font,
							})
						}
					/>
					<ChoiceField
						label="Color Mode"
						value={mode}
						choices={[
							{ value: "light", label: "Light" },
							{ value: "dark", label: "Dark" },
							{ value: "system", label: "System" },
						]}
						onChange={(value) => setMode(value as typeof mode)}
					/>
					<ChoiceField
						label="Radius"
						value={appearance.radius}
						choices={[
							{ value: "none", label: "None" },
							{ value: "sm", label: "SM" },
							{ value: "md", label: "MD" },
							{ value: "lg", label: "LG" },
						]}
						onChange={(radius) =>
							setAppearance({
								...appearance,
								radius: radius as typeof appearance.radius,
							})
						}
					/>
					<ChoiceField
						label="Content Layout"
						value={appearance.contentLayout}
						choices={[
							{ value: "compact", label: "Compact" },
							{ value: "full", label: "Full" },
						]}
						onChange={(contentLayout) =>
							setAppearance({
								...appearance,
								contentLayout: contentLayout as typeof appearance.contentLayout,
							})
						}
					/>
					<ChoiceField
						label="Scale"
						value={appearance.scale}
						choices={[
							{ value: "sm", label: "SM" },
							{ value: "md", label: "MD" },
							{ value: "lg", label: "LG" },
						]}
						onChange={(scale) =>
							setAppearance({
								...appearance,
								scale: scale as typeof appearance.scale,
							})
						}
					/>
					<ChoiceField
						label="Sidebar"
						value={appearance.sidebarVariant}
						choices={[
							{ value: "inset", label: "Inset", icon: IconSidebarInset },
							{
								value: "floating",
								label: "Floating",
								icon: IconSidebarFloating,
							},
							{ value: "sidebar", label: "Sidebar", icon: IconSidebarSidebar },
						]}
						onChange={(sidebarVariant) =>
							setAppearance({
								...appearance,
								sidebarVariant:
									sidebarVariant as typeof appearance.sidebarVariant,
							})
						}
					/>
					<ChoiceField
						label="Layout"
						value={navigationLayout}
						choices={[
							{ value: "default", label: "Default", icon: IconLayoutDefault },
							{ value: "icon", label: "Compact", icon: IconLayoutCompact },
							{
								value: "offcanvas",
								label: "Full layout",
								icon: IconLayoutFull,
							},
						]}
						onChange={(layout) => {
							const expanded = layout === "default";
							let sidebarMode = appearance.sidebarMode;
							if (!expanded) sidebarMode = layout as "icon" | "offcanvas";
							else if (sidebarMode === "none") sidebarMode = "icon";
							setOpen(expanded);
							setAppearance({
								...appearance,
								sidebarOpen: expanded,
								sidebarMode,
							});
						}}
					/>
					<ChoiceField
						label="Sidebar Mode"
						value={appearance.sidebarMode}
						choices={[
							{ value: "offcanvas", label: "Default" },
							{ value: "icon", label: "Icon" },
							{ value: "none", label: "Full" },
						]}
						onChange={(sidebarMode) =>
							setAppearance({
								...appearance,
								sidebarMode: sidebarMode as typeof appearance.sidebarMode,
							})
						}
					/>
				</FieldGroup>
			</PopoverContent>
		</Popover>
	);
}
