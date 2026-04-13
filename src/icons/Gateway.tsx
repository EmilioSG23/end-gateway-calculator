export function GatewayIcon({ className }: { className?: string }) {
	return (
		<div className={`inline-flex items-center justify-center ${className ?? ""}`}>
			<div className="relative size-16 flex items-center justify-center ">
				<img
					src="/end_gateway.png"
					alt="gateway"
					className="relative z-10 size-12 object-contain rounded-full p-0.5"
				/>
			</div>
		</div>
	);
}
