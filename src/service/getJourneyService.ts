import { journeis } from "../mock/journeyMock";

const mockCmsService = (slug: string) => {
  const currentSlug = journeis[slug];

  if (!currentSlug) return null;

  return currentSlug;
}

export async function getJourneyConfig(slug: string) {
  const response = mockCmsService(slug);
  // const response = await fetch(`https://api.seucms.com/v1/journey/${slug}`, {
  //   next: { revalidate: 3600 },
  // });

  if (!response) {
    throw new Error('Jornada não encontrada');
  }

  return response;
}
