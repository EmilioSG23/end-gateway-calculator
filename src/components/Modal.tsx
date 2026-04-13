"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

/**
 * Props para el componente `Modal`.
 */
interface ModalProps {
	isOpen: boolean;
	body: ReactNode;
	width?: number;
	onClose: () => void;
}

/**
 * Modal - Diálogo centrado con overlay y animación.
 * @param {ModalProps} props
 * @returns Modal centrado o `null` si `isOpen` es `false`.
 * @example
 * <Modal isOpen={isOpen} body={<div />} onClose={() => setIsOpen(false)} width={384} />
 */
export function Modal({ isOpen, body, width = 384, onClose }: ModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const t = setTimeout(() => setMounted(true), 10);
			return () => clearTimeout(t);
		}
		Promise.resolve().then(() => setMounted(false));
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			aria-modal
			role="dialog"
			className="fixed inset-0 z-50 flex items-center justify-center py-8 px-4"
		>
			<div
				onClick={onClose}
				role="presentation"
				aria-hidden="true"
				className={`absolute inset-0 bg-void/80 backdrop-blur-sm transition-opacity duration-200 ease-out ${
					mounted ? "opacity-100" : "opacity-0"
				}`}
			/>
			<div
				className={`relative bg-surface border border-border rounded-lg`}
				style={{
					width,
					maxHeight: "90vh",
					boxShadow: "0 0 40px rgba(168,85,247,0.15), 0 0 80px rgba(168,85,247,0.05)",
				}}
			>
				<div className="h-px w-full bg-linear-to-r from-transparent via-purpur to-transparent opacity-60" />

				<div className="p-4 sm:p-6 overflow-y-auto">{body}</div>

				<button
					aria-label="Cerrar modal"
					className="absolute top-3 right-4 font-mono text-sm text-text-muted hover:text-bolt-glow transition-colors cursor-pointer"
					onClick={onClose}
				>
					✕
				</button>
			</div>
		</div>
	);
}
