import { Modal } from "@/components/Modal";
import { ModalContext } from "@/context/ModalContext";
import React, { useState, type ReactNode } from "react";

/**
 * Provides the global {@link ModalContext} to its children and renders a
 * singleton {@link Modal} component at the root of the tree.
 *
 * @remarks
 * Only one modal can be open at a time. `openModal` sets the body and makes
 * the modal visible; `closeModal` hides it and resets the body and width back
 * to their defaults. The default width is `384` px.
 *
 * @param props          - Component props.
 * @param props.children - The application subtree that needs modal access.
 * @returns A `ModalContext.Provider` wrapper that also renders the modal overlay.
 *
 * @example
 * ```tsx
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [body, setBody] = useState<ReactNode>(null);
	const [width, setWidth] = useState<number>(384);

	/**
	 * Sets the modal body content and opens the modal.
	 *
	 * @param content - React node to display inside the modal.
	 */
	const openModal = (content: ReactNode) => {
		setBody(content);
		setIsOpen(true);
	};

	/**
	 * Closes the modal and resets the body and width to their default values.
	 */
	const closeModal = () => {
		setIsOpen(false);
		setBody(null);
		setWidth(384);
	};

	return (
		<ModalContext.Provider
			value={{ isOpen, body, openModal, closeModal, setBody, width, setWidth }}
		>
			{children}
			<Modal body={body} isOpen={isOpen} onClose={closeModal} width={width} />
		</ModalContext.Provider>
	);
}
