import { ModalProvider } from "@/context/ModalProvider";
import { Calculator } from "@/pages/Calculator";

function App() {
	return (
		<ModalProvider>
			<Calculator />
		</ModalProvider>
	);
}

export default App;
