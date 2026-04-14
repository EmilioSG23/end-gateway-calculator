/**
 * Displays the End Gateway block sprite as a circular icon.
 *
 * @param props            - Component props.
 * @param props.className  - Optional CSS class applied to the outer container.
 * @returns A `<div>` wrapper containing the gateway `<img>` element.
 */
export function GatewayIcon({ className }: { className?: string }) {
	return (
		<div className={`inline-flex items-center justify-center ${className ?? ""}`}>
			<div className="relative size-16 flex items-center justify-center ">
				<img
					src={import.meta.env.BASE_URL + "end_gateway.png"}
					alt="gateway"
					className="relative z-10 size-12 object-contain rounded-full p-0.5"
				/>
			</div>
		</div>
	);
}
