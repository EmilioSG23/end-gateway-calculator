import { ModalProvider } from "@/context/ModalProvider";
import { Calculator } from "@/pages/Calculator";

/**
 * Root application component.
 *
 * @remarks
 * Wraps the {@link Calculator} page in a {@link ModalProvider} so that any
 * descendant can open modals via the {@link useModal} hook.
 *
 * @returns The top-level component tree.
 */
function App() {
	return (
		<ModalProvider>
			<Calculator />
		</ModalProvider>
	);
}

export default App;
