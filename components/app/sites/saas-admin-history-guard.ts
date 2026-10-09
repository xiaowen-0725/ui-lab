/** Consumer-only navigation guard. Preserves all framework-owned history state. */
export function installSaasAdminHistoryGuard({
	isDirty,
	confirm,
}: {
	isDirty: (target: URL, current: URL) => boolean;
	confirm: (continueNavigation: () => void) => void;
}) {
	const key = "uilabSaasAdminEntry";
	const history = window.history;
	const originalPush = history.pushState;
	const originalReplace = history.replaceState;
	let cursor = Number(history.state?.[key] ?? 0);
	let currentUrl = new URL(location.href);
	let restoring: (() => void) | null = null;
	const push: History["pushState"] = function (state, title, url) {
		const next = cursor + 1;
		originalPush.call(history, { ...state, [key]: next }, title, url);
		cursor = next;
		currentUrl = new URL(location.href);
	};
	const replace: History["replaceState"] = function (state, title, url) {
		originalReplace.call(history, { ...state, [key]: cursor }, title, url);
		currentUrl = new URL(location.href);
	};
	originalReplace.call(history, { ...history.state, [key]: cursor }, "");
	history.pushState = push;
	history.replaceState = replace;
	const pop = (event: PopStateEvent) => {
		if (restoring) {
			event.stopImmediatePropagation();
			const restored = restoring;
			restoring = null;
			restored();
			return;
		}
		// An entry before the preview mounted is immediately behind the initial entry.
		const target = Number(event.state?.[key] ?? cursor - 1);
		const delta = target - cursor;
		const targetUrl = new URL(location.href);
		if (!isDirty(targetUrl, currentUrl) || !delta) {
			cursor = target;
			currentUrl = targetUrl;
			return;
		}
		// Restore the URL before opening the dialog; the router never sees the rejected traversal.
		event.stopImmediatePropagation();
		restoring = () => confirm(() => history.go(delta));
		history.go(-delta);
	};
	window.addEventListener("popstate", pop, true);
	return () => {
		window.removeEventListener("popstate", pop, true);
		if (history.pushState === push) history.pushState = originalPush;
		if (history.replaceState === replace)
			history.replaceState = originalReplace;
	};
}
