"use client";

// Source: shadcn/studio Free AdminCN, MIT, copyright 2026.
// Revision: dd1afd2f3a794ea9e746197de314f81d43670ea1; path: src/hooks/use-pagination.ts
// Adaptation: named exports and portable import/navigation boundaries.
type UsePaginationProps = {
	currentPage: number;
	totalPages: number;
	paginationItemsToDisplay: number;
};

type UsePaginationReturn = {
	pages: number[];
	showLeftEllipsis: boolean;
	showRightEllipsis: boolean;
};

export function usePagination({
	currentPage,
	totalPages,
	paginationItemsToDisplay,
}: UsePaginationProps): UsePaginationReturn {
	function calculatePaginationRange(): number[] {
		if (totalPages <= paginationItemsToDisplay) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const halfDisplay = Math.floor(paginationItemsToDisplay / 2);

		const initialRange = {
			start: currentPage - halfDisplay,
			end: currentPage + halfDisplay,
		};

		const adjustedRange = {
			start: Math.max(1, initialRange.start),
			end: Math.min(totalPages, initialRange.end),
		};

		if (adjustedRange.start === 1) {
			adjustedRange.end = Math.min(paginationItemsToDisplay, totalPages);
		}

		if (adjustedRange.end === totalPages) {
			adjustedRange.start = Math.max(
				1,
				totalPages - paginationItemsToDisplay + 1,
			);
		}

		return Array.from(
			{ length: adjustedRange.end - adjustedRange.start + 1 },
			(_, i) => adjustedRange.start + i,
		);
	}

	const pages = calculatePaginationRange();

	// Determine ellipsis display based on the actual pages shown
	const showLeftEllipsis = pages.length > 0 && pages[0] > 1 && pages[0] > 2;

	const showRightEllipsis =
		pages.length > 0 &&
		pages[pages.length - 1] < totalPages &&
		pages[pages.length - 1] < totalPages - 1;

	return {
		pages,
		showLeftEllipsis,
		showRightEllipsis,
	};
}

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
