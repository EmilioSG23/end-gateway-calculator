import { ModalContext } from "@/context/ModalContext";
import { useContext } from "react";

/**
 * Custom hook that provides access to the global modal context.
 *
 * @remarks
 * Must be called inside a component tree wrapped by {@link ModalProvider}.
 * Throws a descriptive error if used outside of the provider so misuse is
 * caught early during development.
 *
 * @throws {Error} When used outside of a `ModalProvider`.
 * @returns The {@link ModalContextType} value, containing `isOpen`,
 *   `openModal`, `closeModal`, `body`, `setBody`, `width`, and `setWidth`.
 */
export function useModal() {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("useModal must be used inside ModalProvider");
	return ctx;
}
