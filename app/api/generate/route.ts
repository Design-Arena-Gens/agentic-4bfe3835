import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function POST(request: NextRequest) {
  try {
    const client = getOpenAI();

    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const prompt = `Analyze this person's identity, gender, mood, age, and all accessories (glasses, jewelry, hats, etc.). Then create a macro photography of a small handcrafted white plaster bust sculpture (head and elongated neck only) that preserves all these characteristics. The sculpture must be: unpainted white plaster with smooth yet textured surface, high-fashion art doll aesthetic with hyper-exaggerated proportions (oversized head, elongated neck, thin elegant forms, delicate sculpted facial features), cartoon-like elegance with fashion-doll surreal exaggeration. Place the bust front-facing on a clean plaster cubic stand, centered in frame, surrounded by free space. Plain white background, cinematic studio-like lighting emphasizing sculptural depth and polished plaster qualities. Ultra-realistic macro capture, frontal view. 3:4 vertical aspect ratio.`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const analysis = response.choices[0]?.message?.content || '';

    // Generate the plaster bust using DALL-E 3
    const generationPrompt = `${analysis}

Create a macro photography of a small handcrafted white plaster bust sculpture incorporating these characteristics. Head and elongated neck only, unpainted smooth yet textured plaster surface. High-fashion art doll aesthetic with hyper-exaggerated proportions: oversized head, elongated neck, thin elegant forms, delicate sculpted facial features. Cartoon-like elegance with fashion-doll surreal exaggeration. Front-facing on a clean plaster cubic stand, centered in frame, surrounded by free space. Plain white background, cinematic studio-like lighting emphasizing sculptural depth. Ultra-realistic macro capture.`;

    const imageResponse = await client.images.generate({
      model: 'dall-e-3',
      prompt: generationPrompt,
      n: 1,
      size: '1024x1792',
      quality: 'hd',
      response_format: 'url',
    });

    const imageUrl = imageResponse.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
