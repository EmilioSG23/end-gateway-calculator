import type { Coords } from "@/types/Coords";

export function filenamePrefix(origin: Coords, distance: number) {
	return `blocklist_${origin.x}_${origin.z}_${distance}`;
}

export function downloadBlob(data: BlobPart, mime: string, filename: string) {
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
