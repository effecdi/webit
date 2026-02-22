import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

const BASE_PROMPT =
  "A beautiful watercolor illustration of a wedding couple, bride in white dress and groom in suit, soft pastel colors, elegant minimalist style, romantic atmosphere, no background, transparent background style with white space, delicate brushstrokes, Korean wedding invitation style illustration";

const REFERENCE_PROMPT =
  "Transform this photo into a beautiful watercolor illustration style. Keep the couple's poses and composition but convert to soft pastel watercolor painting, elegant minimalist style, romantic atmosphere, clean white background, delicate brushstrokes, Korean wedding invitation style illustration";

async function generateWithGeminiFlash(
  apiKey: string,
  baseUrl: string,
  parts: Array<Record<string, unknown>>
): Promise<string | null> {
  const url = `${baseUrl}/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini Flash API error:", res.status, errText);
    return null;
  }

  const data = await res.json();
  const imagePart = data.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
  );
  return imagePart?.inlineData?.data || null;
}

async function generateWithImagen(
  apiKey: string,
  baseUrl: string,
  prompt: string
): Promise<string | null> {
  const url = `${baseUrl}/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Imagen API error:", res.status, errText);
    return null;
  }

  const data = await res.json();
  return data.predictions?.[0]?.bytesBase64Encoded || null;
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  try {
    const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
    const baseUrl = (
      process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ||
      "https://generativelanguage.googleapis.com/v1beta"
    ).replace(/\/+$/, "");

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 설정이 되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { referenceImage } = body as { referenceImage?: string };

    let b64Result: string | null = null;

    if (referenceImage) {
      // Reference image: use Gemini Flash (supports image input)
      const base64Data = referenceImage.replace(/^data:image\/\w+;base64,/, "");
      const parts: Array<Record<string, unknown>> = [
        { inlineData: { mimeType: "image/png", data: base64Data } },
        { text: REFERENCE_PROMPT },
      ];
      b64Result = await generateWithGeminiFlash(apiKey, baseUrl, parts);
    } else {
      // No reference: try Gemini Flash first, fallback to Imagen
      const parts: Array<Record<string, unknown>> = [{ text: BASE_PROMPT }];
      b64Result = await generateWithGeminiFlash(apiKey, baseUrl, parts);

      if (!b64Result) {
        console.log("Gemini Flash failed, trying Imagen...");
        b64Result = await generateWithImagen(apiKey, baseUrl, BASE_PROMPT);
      }
    }

    if (!b64Result) {
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }

    const url = `data:image/png;base64,${b64Result}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("AI illustration generation error:", error);
    return NextResponse.json(
      { error: "일러스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
