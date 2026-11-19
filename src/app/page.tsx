import { Header } from "@/components/site/header";
import { ActionBar } from "@/components/site/action-bar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/home/hero";
import { Journey } from "@/components/home/journey";
import { Collections } from "@/components/home/collections";
import { Counter } from "@/components/home/counter";
import { Craft } from "@/components/home/craft";
import { Visit } from "@/components/home/visit";

/**
 * Phase 6 homepage — "Velvet & Gold".
 * Hero → Journey (Discover…Make it yours) → Signature collections →
 * Velvet counter → Craftsmanship → Visit / actions.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Journey />
        <Collections />
        <Counter />
        <Craft />
        <Visit />
      </main>
      <Footer />
      <ActionBar />
    </>
  );
}
