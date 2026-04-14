import type { Coords } from "@/types/Coords";
import { downloadBlob, filenamePrefix } from "@/utils/downloadHelper";
import ExcelJS from "exceljs";

export const DOWNLOAD_FORMATS = ["xlsx", "csv", "json", "txt"] as const;
export type DOWNLOAD_FORMAT = (typeof DOWNLOAD_FORMATS)[number];

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
