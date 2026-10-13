import { render, screen, fireEvent } from "@testing-library/react";
import { FeedbackView } from "./FeedbackView";
test("FeedbackView: comportamento acessível", () => {
	render(<FeedbackView title="Recebido">Mensagem</FeedbackView>);
	expect(screen.getByRole("status")).toHaveTextContent("Recebido");
});
