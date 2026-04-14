import type { Coords } from "@/types/Coords";

/**
 * Builds a consistent filename prefix for block-list download files.
 *
 * @remarks
 * The returned string is intended to be used as the base name (without
 * extension) for all exported formats (CSV, XLSX, JSON, TXT).
 *
 * @param origin - The gateway origin coordinates.
 * @param distance - The target distance in blocks from the world centre.
 * @returns A string of the form `blocklist_<x>_<z>_<distance>`.
 *
 * @example
 * filenamePrefix({ x: 96, z: 0 }, 1024) // → "blocklist_96_0_1024"
 */
export function filenamePrefix(origin: Coords, distance: number): string {
	return `blocklist_${origin.x}_${origin.z}_${distance}`;
}

/**
 * Creates a temporary `<a>` element to trigger a browser file download, then
 * immediately removes the element and revokes the object URL to free memory.
 *
 * @remarks
 * This helper works in all modern browsers that support the
 * `URL.createObjectURL` / `download` attribute combination. It is **not**
 * suitable for server-side rendering contexts.
 *
 * @param data - The raw content to include in the file. Accepts anything that
 *   the `Blob` constructor accepts (`string`, `ArrayBuffer`, etc.).
 * @param mime - MIME type string (e.g. `"text/csv;charset=utf-8;"`).
 * @param filename - The suggested filename the browser will use when saving.
 */
export function downloadBlob(data: BlobPart, mime: string, filename: string): void {
	const blob = new Blob([data], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
