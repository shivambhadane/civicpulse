import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AISimilarityResult } from '@/types/ai';

const requestSchema = z.object({
  description: z.string(),
  nearby_complaints: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      distance_meters: z.number(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);

    const candidateDesc = parsed.description.toLowerCase();

    // Compute semantic cosine similarity approximation or keyword match
    const matches = parsed.nearby_complaints
      .map(nc => {
        const targetText = (nc.title + ' ' + nc.description).toLowerCase();

        // Calculate overlap & keyword similarity
        const candWords = new Set(candidateDesc.split(/\s+/).filter(w => w.length > 3));
        const targetWords = new Set(targetText.split(/\s+/).filter(w => w.length > 3));

        let intersection = 0;
        candWords.forEach(w => {
          if (targetWords.has(w)) intersection++;
        });

        const jaccard = candWords.size > 0 ? intersection / Math.min(candWords.size, targetWords.size) : 0;
        // High spatial proximity boosts score
        const proximityBoost = nc.distance_meters <= 150 ? 0.35 : nc.distance_meters <= 300 ? 0.20 : 0.05;
        const similarity_score = Math.min(0.98, Number((jaccard * 0.65 + proximityBoost).toFixed(2)));

        return {
          complaint_id: nc.id,
          similarity_score,
          reason: `High spatial proximity (${nc.distance_meters}m away) and semantic keyword match.`,
        };
      })
      .filter(m => m.similarity_score >= 0.75) // Architecture approved 0.75 threshold
      .sort((a, b) => b.similarity_score - a.similarity_score);

    const result: AISimilarityResult = {
      has_similar: matches.length > 0,
      matches: matches.slice(0, 3),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
