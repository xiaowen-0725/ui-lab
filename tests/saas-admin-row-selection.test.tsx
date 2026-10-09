import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { SaasAdminProvider } from "@/components/pages/saas-admin/environment";
import {
	DataTableDemo,
	type Payment,
} from "@/components/pages/saas-admin/views/datatables/basic/basic-datatable";
import {
	DataTableFilters,
	type Item,
} from "@/components/pages/saas-admin/views/datatables/filters/filters-datatable";

afterEach(cleanup);

const payments: Payment[] = [
	{ id: "A", name: "Alpha", amount: 10, status: "paid", email: "a@example.com" },
	{ id: "B", name: "Beta", amount: 20, status: "paid", email: "b@example.com" },
];

const items: Item[] = [
	{
		id: "A",
		product: "Alpha",
		productImage: "",
		fallback: "A",
		price: 10,
		availability: "In Stock",
		rating: 4,
	},
	{
		id: "B",
		product: "Beta",
		productImage: "",
		fallback: "B",
		price: 20,
		availability: "Limited",
		rating: 5,
	},
];

function verifySelectionAfterReorder(
	container: HTMLElement,
	reverseConsumerData: () => void,
) {
	const table = within(container);
	const checkboxFor = (name: string) =>
		within(table.getByRole("row", { name: new RegExp(name) })).getByRole(
			"checkbox",
			{ name: "Select row" },
		);
	const expectSelection = (alpha: boolean, beta: boolean) => {
		expect(checkboxFor("Alpha").getAttribute("aria-checked")).toBe(String(alpha));
		expect(checkboxFor("Beta").getAttribute("aria-checked")).toBe(String(beta));
	};

	fireEvent.click(checkboxFor("Alpha"));
	expectSelection(true, false);
	reverseConsumerData();
	expect(table.getAllByRole("row").slice(1).map((row) =>
		row.textContent?.includes("Alpha") ? "Alpha" : "Beta",
	)).toEqual(["Beta", "Alpha"]);
	expectSelection(true, false);

	fireEvent.click(table.getByRole("checkbox", { name: "Select all" }));
	expectSelection(true, true);
	fireEvent.click(table.getByRole("checkbox", { name: "Select all" }));
	expectSelection(false, false);
}

describe("SaaS admin row selection", () => {
	test("Basic keeps Alpha selected after consumer data reverses, then selects and clears all", () => {
		const view = (data: Payment[]) => (
			<SaasAdminProvider locale="en">
				<DataTableDemo data={data} />
			</SaasAdminProvider>
		);
		const { container, rerender } = render(view(payments));
		verifySelectionAfterReorder(container, () =>
			rerender(view([...payments].reverse())),
		);
	});

	test("Filters keeps Alpha selected after consumer data reverses, then selects and clears all", () => {
		const view = (data: Item[]) => (
			<SaasAdminProvider locale="en">
				<DataTableFilters data={data} />
			</SaasAdminProvider>
		);
		const { container, rerender } = render(view(items));
		verifySelectionAfterReorder(container, () =>
			rerender(view([...items].reverse())),
		);
	});
});
