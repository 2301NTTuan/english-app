import { GrammarBrowser } from "@/components/grammar-browser";
import { queryGrammarCatalogue } from "@/lib/content/database";

export const dynamic = "force-dynamic";

export default async function GrammarPage() {
  const catalogue = await queryGrammarCatalogue();
  return <GrammarBrowser topics={catalogue.items}/>;
}
