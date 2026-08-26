import { SeverityLevel } from './database';

export interface AIClassificationResult {
  category_slug: 'roads-traffic' | 'sanitation-garbage' | 'water-drainage' | 'electricity-lighting' | 'public-safety';
  severity: SeverityLevel;
  summary: string;
  tags: string[];
}

export interface AIDepartmentRoutingResult {
  department_code: string;
  department_name: string;
  confidence_score: number;
  reasoning: string;
}

export interface AISimilarityMatch {
  complaint_id: string;
  similarity_score: number;
  reason: string;
}

export interface AISimilarityResult {
  has_similar: boolean;
  matches: AISimilarityMatch[];
}
