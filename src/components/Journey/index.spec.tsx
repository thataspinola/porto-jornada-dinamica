import { render, screen } from "@testing-library/react";
import { Journey } from ".";
import { journeyWithSingleStepMock } from "../../mock";
import type { JourneyConfig } from "../../types";

const makeSut = (
  config: JourneyConfig,
  initialData: Record<string, unknown>,
  slug: string,
) => {
  const sut = render(
    <Journey config={config} initialData={initialData} slug={slug} />,
  );

  return sut;
};

test("loads and displays greeting", async () => {
  // ARRANGE
  const sut = makeSut(journeyWithSingleStepMock, {}, "dados-do-equipamentos");

  // ACT
  // await userEvent.click(screen.getByText('Load Greeting'))
  // await screen.findByRole('heading')

  screen.debug(sut.container);

  // ASSERT
  // expect(screen.getByRole('heading')).toHaveTextContent('hello there')
});
