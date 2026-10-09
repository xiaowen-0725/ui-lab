import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SaasAdminProvider } from "@/components/pages/saas-admin/environment";
import { useUserApp } from "@/components/pages/saas-admin/hooks/use-user-app";

afterEach(cleanup);

function QueryConsumer() {
	const { filters, currentPage, rowsPerPage, sorting, handleSearchChange } =
		useUserApp();
	return (
		<>
			<input
				aria-label="Search"
				value={filters.search}
				onChange={(event) => handleSearchChange(event.target.value)}
			/>
			<output>
				{JSON.stringify({
					role: filters.role,
					currentPage,
					rowsPerPage,
					sorting,
				})}
			</output>
		</>
	);
}

test("user query restores state, preserves unknown parameters and resets pagination when searching", () => {
	const navigations: string[] = [];
	const view = (search: string) => (
		<SaasAdminProvider
			pathname="/apps/users/list"
			search={search}
			onNavigate={(path) => navigations.push(path)}
		>
			<QueryConsumer />
		</SaasAdminProvider>
	);
	const { container, rerender } = render(
		view("q=John&role=Admin&size=25&sort=user&direction=desc&campaign=example"),
	);
	expect((screen.getByLabelText("Search") as HTMLInputElement).value).toBe(
		"John",
	);
	expect(container.querySelector("output")?.textContent).toContain(
		'"rowsPerPage":25',
	);
	expect(container.querySelector("output")?.textContent).toContain(
		'"desc":true',
	);
	fireEvent.change(screen.getByLabelText("Search"), {
		target: { value: "Jane" },
	});
	const next = new URL(navigations.at(-1)!, "https://example.test");
	expect(next.searchParams.get("q")).toBe("Jane");
	expect(next.searchParams.get("campaign")).toBe("example");
	expect(next.searchParams.get("page")).toBeNull();
	rerender(
		view("q=John&role=Admin&size=25&sort=user&direction=desc&campaign=example"),
	);
	// A genuinely different history entry restores its query rather than retaining the draft.
	rerender(view("q=Earlier&role=Guest"));
	expect((screen.getByLabelText("Search") as HTMLInputElement).value).toBe(
		"Earlier",
	);
});

test("malformed query values use valid filter, sort and pagination defaults", () => {
	const { container } = render(
		<SaasAdminProvider
			pathname="/apps/users/list"
			search="role=Unknown&size=-1&page=NaN&sort=missing"
		>
			<QueryConsumer />
		</SaasAdminProvider>,
	);
	expect(container.querySelector("output")?.textContent).toBe(
		'{"role":"all","currentPage":1,"rowsPerPage":10,"sorting":null}',
	);
});
