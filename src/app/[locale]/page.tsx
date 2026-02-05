import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuGrid from "@/components/MenuGrid";
import Entries from "@/components/Entries";
import ComposeTonCrousty from "@/components/ComposeTonCrousty";
import DrinksAndDesserts from "@/components/DrinksAndDesserts";
import OrderButtons from "@/components/OrderButtons";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <MenuGrid />
      <Entries />
      <ComposeTonCrousty />
      <DrinksAndDesserts />
      <OrderButtons />
      <Location />
      <Footer />
    </main>
  );
}
