// Loads the editable data files from /data at build time.
import type { Buyer, Method, Product, Rubric, Scenario, Settings } from "../../shared/types";
import rubricJson from "../../data/rubric.json";
import settingsJson from "../../data/settings.json";
import { loadCustomProduct } from "./storage";

const pick = <T>(files: Record<string, T>) => Object.values(files);

export const methods: Method[] = pick(import.meta.glob<Method>("../../data/methods/*.json", { eager: true, import: "default" }));
export const buyers: Buyer[] = pick(import.meta.glob<Buyer>("../../data/buyers/*.json", { eager: true, import: "default" })).sort(
  (a, b) => a.ladderRank - b.ladderRank,
);
export const scenarios: Scenario[] = pick(
  import.meta.glob<Scenario>("../../data/scenarios/*.json", { eager: true, import: "default" }),
).sort((a, b) => a.order - b.order);
const shippedProducts: Product[] = pick(import.meta.glob<Product>("../../data/products/*.json", { eager: true, import: "default" }));
export const rubric = rubricJson as Rubric;
export const settings = settingsJson as Settings;

export function products(): Product[] {
  const custom = loadCustomProduct();
  return custom ? [...shippedProducts, custom] : shippedProducts;
}

export const getMethod = (id: string) => methods.find((m) => m.id === id) ?? methods[0];
export const getBuyer = (id: string) => buyers.find((b) => b.id === id) ?? buyers[0];
export const getScenario = (id: string) => scenarios.find((s) => s.id === id) ?? scenarios[0];
export const getProduct = (id: string) => products().find((p) => p.id === id) ?? products()[0];
