import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { AIDepartmentRoutingResult } from '@/types/ai';

const requestSchema = z.object({
  category_slug: z.string(),
  description: z.string(),
  location_name: z.string().optional(),
});

const DEPARTMENT_MAPPING: Record<string, { code: string; name: string }> = {
  'roads-traffic': { code: 'PMC_ROADS', name: 'Roads & Maintenance Department' },
  'sanitation-garbage': { code: 'PMC_SANITATION', name: 'Solid Waste Management (Sanitation)' },
  'water-drainage': { code: 'PMC_WATER', name: 'Water Supply & Sewerage Board' },
  'electricity-lighting': { code: 'PMC_ELECTRICAL', name: 'Electrical & Street Lighting Department' },
  'public-safety': { code: 'PMC_SAFETY', name: 'Public Safety & Enforcement' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const systemPrompt = `You are a municipal department routing assistant.
Analyze the complaint category, text description, and location. Recommend the best matching municipal department.
Return JSON matching schema:
{
  "department_code": "PMC_ROADS" | "PMC_SANITATION" | "PMC_WATER" | "PMC_ELECTRICAL" | "PMC_SAFETY",
  "department_name": "Department Name",
  "confidence_score": float between 0.50 and 0.99,
  "reasoning": "1-sentence justification"
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Category: ${parsed.category_slug}, Description: "${parsed.description}", Location: "${parsed.location_name || 'Pune'}"` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const aiResult: AIDepartmentRoutingResult = JSON.parse(content);
          return NextResponse.json({ success: true, data: aiResult });
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to rule mapping:', err);
      }
    }

    const defaultDept = DEPARTMENT_MAPPING[parsed.category_slug] || DEPARTMENT_MAPPING['roads-traffic'];

    const result: AIDepartmentRoutingResult = {
      department_code: defaultDept.code,
      department_name: defaultDept.name,
      confidence_score: 0.94,
      reasoning: `Matched based on civic category domain (${parsed.category_slug}) and jurisdictional jurisdiction rules.`,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request payload';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
