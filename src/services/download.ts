import type { Coords } from "@/types/Coords";
import { downloadBlob, filenamePrefix } from "@/utils/downloadHelper";
import ExcelJS from "exceljs";

/**
 * Tuple of all supported export format identifiers.
 * Used as the source of truth for both the {@link DOWNLOAD_FORMAT} type and
 * runtime dispatch in {@link downloadBlockList}.
 */
export const DOWNLOAD_FORMATS = ["xlsx", "csv", "json", "txt"] as const;

/** Union of all valid download format strings derived from {@link DOWNLOAD_FORMATS}. */
export type DOWNLOAD_FORMAT = (typeof DOWNLOAD_FORMATS)[number];

/**
 * Dispatches a block-list download in the requested format.
 *
 * @remarks
 * Acts as the single public entry point for all export functionality.
 * Delegates to one of the four private format-specific helpers depending on
 * `format`.
 *
 * @param params          - Download parameters.
 * @param params.blocks   - Ordered list of block coordinates to export.
 * @param params.origin   - Gateway origin coordinates.
 * @param params.distance - Target travel distance in blocks.
 * @param params.format   - Output format; must be one of {@link DOWNLOAD_FORMAT}.
 * @returns A promise that resolves once the browser download has been
 *   triggered.
 */
export async function downloadBlockList({
	blocks,
	origin,
	distance,
	format,
}: {
	blocks: Coords[];
	origin: Coords;
	distance: number;
	format: DOWNLOAD_FORMAT;
}): Promise<void> {
	if (format === "json") {
		downloadAsJson({ blocks, origin, distance });
		return;
	}
	if (format === "csv") {
		downloadAsCsv({ blocks, origin, distance });
		return;
	}
	if (format === "xlsx") {
		await downloadAsXlsx({ blocks, origin, distance });
		return;
	}
	if (format === "txt") {
		downloadAsTxt({ blocks, origin, distance });
		return;
	}
}

/**
 * Serialises the block list to a pretty-printed JSON file and triggers a
 * browser download.
 *
 * @param blocks   - Ordered list of block coordinates.
 * @param origin   - Gateway origin coordinates.
 * @param distance - Target travel distance in blocks.
 */
function downloadAsJson({
	blocks,
	origin,
	distance,
}: {
	blocks: Coords[];
	origin: Coords;
	distance: number;
}) {
	const blocksWithIndex = blocks.map((b, i) => ({ index: i + 1, x: b.x, z: b.z }));
	const payload = { origin, distance, blocks: blocksWithIndex };
	const text = JSON.stringify(payload, null, 2);
	const name = `${filenamePrefix(origin, distance)}.json`;
	downloadBlob(text, "application/json", name);
}

/**
 * Serialises the block list to a CSV file (columns: `#`, `x`, `z`) and
 * triggers a browser download.
 *
 * @param blocks   - Ordered list of block coordinates.
 * @param origin   - Gateway origin coordinates.
 * @param distance - Target travel distance in blocks.
 */
function downloadAsCsv({
	blocks,
	origin,
	distance,
}: {
	blocks: Coords[];
	origin: Coords;
	distance: number;
}) {
	const header = ["#", "x", "z"].join(",");
	const lines = blocks.map((b, i) => `${i + 1},${b.x},${b.z}`);
	const csv = [header, ...lines].join("\n");
	const name = `${filenamePrefix(origin, distance)}.csv`;
	downloadBlob(csv, "text/csv;charset=utf-8;", name);
}

/**
 * Serialises the block list to an XLSX workbook using ExcelJS and triggers a
 * browser download.
 *
 * @remarks
 * The generated spreadsheet includes four columns (`#`, `X`, `Z`, `Placed`).
 * The `Placed` column is constrained to a `TRUE/FALSE` dropdown via Excel
 * data-validation, making the sheet directly usable as a placement checklist.
 *
 * @param blocks   - Ordered list of block coordinates.
 * @param origin   - Gateway origin coordinates.
 * @param distance - Target travel distance in blocks.
 */
async function downloadAsXlsx({
	blocks,
	origin,
	distance,
}: {
	blocks: Coords[];
	origin: Coords;
	distance: number;
}) {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Blocks");

	sheet.columns = [
		{ header: "#", key: "index", width: 6 },
		{ header: "X", key: "x", width: 12 },
		{ header: "Z", key: "z", width: 12 },
		{ header: "Placed", key: "placed", width: 10 },
	];

	blocks.forEach((b, i) => {
		const row = sheet.addRow({ index: i + 1, x: b.x, z: b.z, placed: false });
		const cell = row.getCell(4);
		cell.dataValidation = {
			type: "list",
			allowBlank: true,
			formulae: ['"TRUE,FALSE"'],
		};
	});

	const buf = await workbook.xlsx.writeBuffer();
	const name = `${filenamePrefix(origin, distance)}.xlsx`;
	downloadBlob(buf, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name);
}

/**
 * Serialises the block list to a tab-separated plain-text file (`#`, `x`, `z`
 * per line) and triggers a browser download.
 *
 * @param blocks   - Ordered list of block coordinates.
 * @param origin   - Gateway origin coordinates.
 * @param distance - Target travel distance in blocks.
 */
function downloadAsTxt({
	blocks,
	origin,
	distance,
}: {
	blocks: Coords[];
	origin: Coords;
	distance: number;
}) {
	// include index as first column: #\tX\tZ
	const header = ["#", "x", "z"].join("\t");
	const lines = blocks.map((b, i) => `${i + 1}\t${b.x}\t${b.z}`);
	const txt = [header, ...lines].join("\n");
	const name = `${filenamePrefix(origin, distance)}.txt`;
	downloadBlob(txt, "text/plain;charset=utf-8;", name);
}
