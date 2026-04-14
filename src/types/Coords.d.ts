/**
 * Represents a pair of block coordinates in the End dimension.
 *
 * @remarks
 * The End dimension uses X and Z axes only — Y is not relevant for
 * gateway line calculations. All positions are expressed in blocks.
 */
export interface Coords {
	/** Block coordinate on the X axis. */
	x: number;
	/** Block coordinate on the Z axis. */
	z: number;
}
