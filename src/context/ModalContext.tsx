import { createContext, type ReactNode } from "react";

/**
 * Shape of the value provided by {@link ModalContext}.
 */
export interface ModalContextType {
	/** Whether the modal is currently visible. */
	isOpen: boolean;
	/** The React node rendered as the modal body. `null` when closed. */
	body: ReactNode;
	/**
	 * Opens the modal and sets its body content.
	 *
	 * @param content - The React node to render inside the modal.
	 */
	openModal: (content: ReactNode) => void;
	/** Closes the modal and clears its body content. */
	closeModal: () => void;
	/**
	 * Replaces the modal body without opening or closing it.
	 *
	 * @param body - The new React node to render.
	 */
	setBody: (body: ReactNode) => void;
	/** Current modal width in pixels. */
	width: number;
	/**
	 * Updates the modal width.
	 *
	 * @param width - Desired pixel width.
	 */
	setWidth: (width: number) => void;
}

/**
 * React context that exposes the global modal state and its mutators.
 * Consume via {@link useModal} rather than directly.
 */
export const ModalContext = createContext<ModalContextType | undefined>(undefined);
