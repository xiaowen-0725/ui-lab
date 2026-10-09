import { expect, test } from "bun:test";
import { act, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useHydratedReducedMotion } from "@/lib/hooks/use-hydrated-reduced-motion";

function Preference() {
	const reduced = useHydratedReducedMotion();
	return <output>{reduced === null ? "unknown" : String(reduced)}</output>;
}

test("motion preference is unknown on the server, responds after mount and unsubscribes", () => {
	const original = window.matchMedia;
	let reduced = false;
	const listeners = new Set<() => void>();
	window.matchMedia = (() => ({
		get matches() {
			return reduced;
		},
		media: "(prefers-reduced-motion: reduce)",
		addListener() {},
		removeListener() {},
		addEventListener: (_event: string, listener: () => void) =>
			listeners.add(listener),
		removeEventListener: (_event: string, listener: () => void) =>
			listeners.delete(listener),
	})) as unknown as typeof window.matchMedia;
	try {
		expect(renderToString(<Preference />)).toContain("unknown");
		const { container, unmount } = render(<Preference />);
		expect(container.textContent).toBe("false");
		act(() => {
			reduced = true;
			for (const listener of listeners) listener();
		});
		expect(container.textContent).toBe("true");
		act(() => {
			reduced = false;
			for (const listener of listeners) listener();
		});
		expect(container.textContent).toBe("false");
		unmount();
		expect(listeners.size).toBe(0);
	} finally {
		window.matchMedia = original;
	}
});
