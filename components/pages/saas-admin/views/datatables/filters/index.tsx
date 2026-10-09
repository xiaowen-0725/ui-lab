"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/views/datatables/filters/index.tsx
// Adaptation: named exports and portable import/navigation boundaries.
// Component Imports
import { Card } from "@/components/ui/card";
import {
	imageProductsProduct10Png,
	imageProductsProduct1Png,
	imageProductsProduct2Png,
	imageProductsProduct3Png,
	imageProductsProduct4Png,
	imageProductsProduct5Png,
	imageProductsProduct6Png,
	imageProductsProduct8Png,
} from "@/components/pages/saas-admin/assets/images";
import {
	DataTableFilters,
	type Item,
} from "@/components/pages/saas-admin/views/datatables/filters/filters-datatable";

const productData: Item[] = [
	{
		id: "1",
		product: "Black Chair",
		productImage: imageProductsProduct1Png,
		fallback: "BC",
		price: 159,
		availability: "In Stock",
		rating: 3.9,
	},
	{
		id: "2",
		product: "Nike Jordan",
		productImage: imageProductsProduct2Png,
		fallback: "NJ",
		price: 599,
		availability: "Limited",
		rating: 4.4,
	},
	{
		id: "3",
		product: "OnePlus 7 Pro",
		productImage: imageProductsProduct3Png,
		fallback: "O7P",
		price: 1299,
		availability: "Out of Stock",
		rating: 3.5,
	},
	{
		id: "4",
		product: "Nintendo Switch",
		productImage: imageProductsProduct4Png,
		fallback: "NS",
		price: 499,
		availability: "In Stock",
		rating: 4.9,
	},
	{
		id: "5",
		product: "Apple magic mouse",
		productImage: imageProductsProduct5Png,
		fallback: "AMM",
		price: 970,
		availability: "Limited",
		rating: 4.1,
	},
	{
		id: "6",
		product: "Apple watch",
		productImage: imageProductsProduct6Png,
		fallback: "AW",
		price: 1500,
		availability: "Limited",
		rating: 3.1,
	},
	{
		id: "7",
		product: "Casio G-Shock",
		productImage: imageProductsProduct8Png,
		fallback: "CGS",
		price: 194,
		availability: "Out of Stock",
		rating: 1.5,
	},
	{
		id: "8",
		product: "RayBan Sunglasses",
		productImage: imageProductsProduct10Png,
		fallback: "RBS",
		price: 199,
		availability: "Out of Stock",
		rating: 2.4,
	},
];

const DataTableWithFilters = () => {
	return (
		<Card className="py-0">
			<DataTableFilters data={productData} />
		</Card>
	);
};

export { DataTableWithFilters };
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
