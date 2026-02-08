import { getAvailableProducts } from "@/actions/menu-actions";
import { productToMenuItem, productToEntryItem } from "@/data/menu";
import MenuSlideshow from "@/components/MenuSlideshow";

export default async function SlideshowPage() {
  // Fetch all products from database
  const [dishes, entries] = await Promise.all([
    getAvailableProducts("dish"),
    getAvailableProducts("entry"),
  ]);

  const menuItems = dishes.map(productToMenuItem);
  const entryItems = entries.map(productToEntryItem);

  return <MenuSlideshow menuItems={menuItems} entryItems={entryItems} />;
}
