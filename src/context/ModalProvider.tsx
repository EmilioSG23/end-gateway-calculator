import { Modal } from "@/components/Modal";
import { ModalContext } from "@/context/ModalContext";
import React, { useState, type ReactNode } from "react";

/**
 * ModalProvider - Contexto que gestiona un modal global reutilizable.
 * @param {{children: React.ReactNode}} props - Hijos envueltos por el provider.
 * @returns JSX que provee `ModalContext` y renderiza un `Modal` singleton.
 * @example
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 */
export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [body, setBody] = useState<ReactNode>(null);
	const [width, setWidth] = useState<number>(384);

	const openModal = (content: ReactNode) => {
		setBody(content);
		setIsOpen(true);
	};

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
