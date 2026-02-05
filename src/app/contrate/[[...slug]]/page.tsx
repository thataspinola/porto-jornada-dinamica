import { Journey } from "../../../components";
import { getJourneyConfig } from "../../../service/getJourneyService";

interface PageProps {
  params: { slug: string };
}

/**
 * Usuário acessa /contrate/seguro-auto
 * -> SlugPage busca no CMS o um endpoint respectivo para buscar o JSON do serviço
 *  ->
 *   ->
*/

export default async function SlugPage({ params }: PageProps) {
  const currentSlug = params.slug;

  const config = await getJourneyConfig(currentSlug);

  return (<Journey config={config} slug={currentSlug} />);
}
