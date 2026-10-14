import { render, screen, fireEvent } from "@testing-library/react";
import { FeedbackView } from "@/components/UI/FeedbackView/FeedbackView";
test("FeedbackView: comportamento acessível", () => {
	render(<FeedbackView title="Recebido">Mensagem</FeedbackView>);
	expect(screen.getByRole("status")).toHaveTextContent("Recebido");
});
