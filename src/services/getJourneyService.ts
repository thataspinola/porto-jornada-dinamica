export async function getJourneyConfig(slug: string) {
  const response = await fetch(`http://localhost:3001/finaciamento-de-veiculos`);
  const parsedResponse = await response.json();

  if (!parsedResponse) {
    throw new Error('Jornada não encontrada');
  }

  return parsedResponse;
}
