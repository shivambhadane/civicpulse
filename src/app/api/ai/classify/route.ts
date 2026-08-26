import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { AIClassificationResult } from '@/types/ai';

const requestSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  image_url: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const systemPrompt = `You are an expert urban infrastructure classification AI for Indian municipal corporations (PMC, BBMP, BMC).
Analyze the civic complaint description (and optional image context) and categorize it accurately.
Return JSON matching schema:
{
  "category_slug": "roads-traffic" | "sanitation-garbage" | "water-drainage" | "electricity-lighting" | "public-safety",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "summary": "1-sentence concise summary title",
  "tags": ["tag1", "tag2"]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Complaint Description: "${parsed.description}"` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const aiResult: AIClassificationResult = JSON.parse(content);
          return NextResponse.json({ success: true, data: aiResult });
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to rule engine:', err);
      }
    }

    // Rule-based Fallback Classifier Engine
    const text = parsed.description.toLowerCase();
    let category_slug: AIClassificationResult['category_slug'] = 'roads-traffic';
    let severity: AIClassificationResult['severity'] = 'MEDIUM';
    let tags: string[] = ['civic', 'infrastructure'];

    if (text.includes('garbage') || text.includes('dump') || text.includes('trash') || text.includes('waste') || text.includes('smell') || text.includes('sanitation')) {
      category_slug = 'sanitation-garbage';
      severity = text.includes('overflowing') || text.includes('foul') || text.includes('days') ? 'CRITICAL' : 'HIGH';
      tags = ['garbage', 'sanitation', 'cleanliness'];
    } else if (text.includes('water') || text.includes('leak') || text.includes('drain') || text.includes('sewage') || text.includes('flood') || text.includes('pipe')) {
      category_slug = 'water-drainage';
      severity = text.includes('burst') || text.includes('flooding') || text.includes('sewage') ? 'CRITICAL' : 'HIGH';
      tags = ['water', 'leakage', 'drainage'];
    } else if (text.includes('light') || text.includes('pole') || text.includes('electric') || text.includes('wire') || text.includes('dark') || text.includes('zap')) {
      category_slug = 'electricity-lighting';
      severity = text.includes('dark') || text.includes('hanging') ? 'HIGH' : 'MEDIUM';
      tags = ['streetlights', 'electricity'];
    } else if (text.includes('manhole') || text.includes('open') || text.includes('danger') || text.includes('safety') || text.includes('tree') || text.includes('hazard')) {
      category_slug = 'public-safety';
      severity = 'CRITICAL';
      tags = ['safety', 'hazard', 'urgent'];
    } else if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('footpath') || text.includes('crater')) {
      category_slug = 'roads-traffic';
      severity = text.includes('deep') || text.includes('traffic') || text.includes('damage') ? 'HIGH' : 'MEDIUM';
      tags = ['pothole', 'roads', 'traffic'];
    }

    const result: AIClassificationResult = {
      category_slug,
      severity,
      summary: parsed.description.length > 60 ? `${parsed.description.substring(0, 57)}...` : parsed.description,
      tags,
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
