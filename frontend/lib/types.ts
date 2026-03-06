export interface Pick {
  symbol: string;
  thesis: string;
  catalyst: string;
  risk: string;
  confidence: number;
  evidence: string[];
}

export interface RecommendationResponse {
  picks?: Pick[];
  market_summary?: string;
  universe?: string[];
  errors?: Record<string, string>;
  error?: string;
  valid_universe?: string[];
}