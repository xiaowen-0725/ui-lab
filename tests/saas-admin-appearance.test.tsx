import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import {
	DEFAULT_SAAS_ADMIN_APPEARANCE,
	normalizeSaasAdminAppearance,
	type SaasAdminAppearance,
} from "@/components/pages/saas-admin/appearance";
import {
	SaasAdminProvider,
	useSaasAdmin,
} from "@/components/pages/saas-admin/environment";
import { readSaasAdminAppearanceCookie } from "@/components/app/sites/saas-admin-preferences";

afterEach(cleanup);

test("appearance restores valid partial preferences and rejects malformed persisted settings", () => {
	expect(
		normalizeSaasAdminAppearance({ font: "system", sidebarOpen: false }),
	).toEqual({
		...DEFAULT_SAAS_ADMIN_APPEARANCE,
		font: "system",
		sidebarOpen: false,
	});
	expect(
		normalizeSaasAdminAppearance({
			radius: "};body{display:none}",
			scale: "huge",
			sidebarOpen: "false",
		}),
	).toEqual(DEFAULT_SAAS_ADMIN_APPEARANCE);
	expect(readSaasAdminAppearanceCookie("invalid%encoding")).toEqual(
		DEFAULT_SAAS_ADMIN_APPEARANCE,
	);
	expect(
		readSaasAdminAppearanceCookie(
			encodeURIComponent(
				JSON.stringify({ sidebarVariant: "floating", sidebarOpen: false }),
			),
		),
	).toEqual({
		...DEFAULT_SAAS_ADMIN_APPEARANCE,
		sidebarVariant: "floating",
		sidebarOpen: false,
	});
});

function AppearanceConsumer() {
	const { appearance, setAppearance } = useSaasAdmin();
	return (
		<>
			<input aria-label="Draft" defaultValue="Unsaved" />
			<output aria-label="Appearance">{JSON.stringify(appearance)}</output>
			<button
				type="button"
				onClick={() =>
					setAppearance({ ...appearance, sidebarVariant: "inset", scale: "lg" })
				}
			>
				Change appearance
			</button>
			<button
				type="button"
				onClick={() => setAppearance({ ...DEFAULT_SAAS_ADMIN_APPEARANCE })}
			>
				Reset appearance
			</button>
		</>
	);
}

test("nested page providers share local appearance without remounting drafts on changes or reset", () => {
	render(
		<SaasAdminProvider>
			<SaasAdminProvider>
				<AppearanceConsumer />
			</SaasAdminProvider>
		</SaasAdminProvider>,
	);
	fireEvent.change(screen.getByLabelText("Draft"), {
		target: { value: "Edited draft" },
	});
	fireEvent.click(screen.getByText("Change appearance"));
	expect(screen.getByLabelText("Appearance").textContent).toContain(
		'"sidebarVariant":"inset"',
	);
	fireEvent.click(screen.getByText("Reset appearance"));
	expect(screen.getByLabelText("Appearance").textContent).toBe(
		JSON.stringify(DEFAULT_SAAS_ADMIN_APPEARANCE),
	);
	expect((screen.getByLabelText("Draft") as HTMLInputElement).value).toBe(
		"Edited draft",
	);
});

test("controlled consumers own appearance updates and propagate them to nested pages", () => {
	const changes: SaasAdminAppearance[] = [];
	function Consumer() {
		const [appearance, setAppearance] = useState<SaasAdminAppearance>({
			...DEFAULT_SAAS_ADMIN_APPEARANCE,
			font: "system",
		});
		return (
			<SaasAdminProvider
				appearance={appearance}
				onAppearanceChange={(next) => {
					changes.push(next);
					setAppearance(next);
				}}
			>
				<SaasAdminProvider>
					<AppearanceConsumer />
				</SaasAdminProvider>
			</SaasAdminProvider>
		);
	}
	render(<Consumer />);
	fireEvent.click(screen.getByText("Change appearance"));
	expect(changes).toHaveLength(1);
	expect(changes[0].font).toBe("system");
	expect(screen.getByLabelText("Appearance").textContent).toContain(
		'"scale":"lg"',
	);
});
