import { buildListing } from "@/lib/filters";
import type { CategoryId, Product } from "@/lib/types";
import { getDeals, getProductsByCategory, products, toSummary } from "./catalog";

export function categoryListing(id: CategoryId) {
  return buildListing(getProductsByCategory(id), toSummary, { facetsFor: id });
}

export function peripheralsListing() {
  const list = products.filter((p) => ["monitor", "keyboard", "mouse", "headset"].includes(p.category));
  return buildListing(list, toSummary, { withCategory: true });
}

export function dealsListing() {
  return buildListing(getDeals(), toSummary, { withCategory: true });
}

export function searchListing(list: Product[]) {
  return buildListing(list, toSummary, { withCategory: true });
}
