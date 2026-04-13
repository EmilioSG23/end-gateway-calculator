import { createContext, type ReactNode } from "react";

interface ModalContextType {
	isOpen: boolean;
	body: ReactNode;
	openModal: (content: ReactNode) => void;
	closeModal: () => void;
	setBody: (body: ReactNode) => void;
	width: number;
	setWidth: (width: number) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);
