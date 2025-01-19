export interface DataRow {
  domain: string;
  niche1: string;
  niche2: string;
  traffic: number;
  dr: number;
  da: number;
  language: string;
  price: number;
  spamScore: number;
}

export interface SortConfig {
  key: keyof DataRow | null;
  direction: "asc" | "desc";
}
