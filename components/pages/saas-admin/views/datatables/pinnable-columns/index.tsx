"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/datatables/pinnable-columns/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Component Imports
import { Card } from "@/components/ui/card";
import {
	DataTablePinnableColumns,
	type Product,
} from "@/components/pages/saas-admin/views/datatables/pinnable-columns/pinnable-columns-datatable";

const productData: Product[] = [
	{
		productId: 1,
		productName: "Apple iPhone 14",
		category: "Smartphones",
		stockQuantity: 4550,
		price: 1500,
		supplier: "Dixon Electronics",
		discontinued: "no",
	},
	{
		productId: 2,
		productName: "Metal frame table",
		category: "Furniture",
		stockQuantity: 150,
		price: 540,
		supplier: "Milton Furniture",
		discontinued: "no",
	},
	{
		productId: 3,
		productName: "Xiaomi A series",
		category: "electronics",
		stockQuantity: 1500,
		price: 2200,
		supplier: "Xiaomi Electronics",
		discontinued: "yes",
	},
	{
		productId: 4,
		productName: "RC Monster Truck",
		category: "Toys",
		stockQuantity: 10500,
		price: 250,
		supplier: "Lego Toys",
		discontinued: "no",
	},
	{
		productId: 5,
		productName: "Glass Water Bottle",
		category: "Kitchenware",
		stockQuantity: 5503,
		price: 69,
		supplier: "Kitchen Essentials",
		discontinued: "no",
	},
	{
		productId: 6,
		productName: "BenQ Monitor 24",
		category: "Electronics",
		stockQuantity: 600,
		price: 1000,
		supplier: "BenQ Electronics",
		discontinued: "yes",
	},
];

const DataTablePinnableColumn = () => {
	return (
		<Card className="py-0">
			<DataTablePinnableColumns data={productData} />
		</Card>
	);
};

export { DataTablePinnableColumn };
/*
MIT License

Copyright (c) 2026 shadcn/studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
