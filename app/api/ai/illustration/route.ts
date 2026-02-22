import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

const BASE_PROMPT =
  "A beautiful watercolor illustration of a wedding couple, bride in white dress and groom in suit, soft pastel colors, elegant minimalist style, romantic atmosphere, no background, transparent background style with white space, delicate brushstrokes, Korean wedding invitation style illustration";

const REFERENCE_PROMPT =
  "Transform this photo into a beautiful watercolor illustration style. Keep the couple's poses and composition but convert to soft pastel watercolor painting, elegant minimalist style, romantic atmosphere, clean white background, delicate brushstrokes, Korean wedding invitation style illustration";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  try {
    const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
    const baseUrl =
      process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ||
      "https://generativelanguage.googleapis.com/v1beta";

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 설정이 되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { referenceImage } = body as { referenceImage?: string };

    // Build request parts
    const parts: Array<Record<string, unknown>> = [];

    if (referenceImage) {
      const base64Data = referenceImage.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: base64Data,
        },
      });
      parts.push({ text: REFERENCE_PROMPT });
    } else {
      parts.push({ text: BASE_PROMPT });
    }

    const geminiUrl = `${baseUrl}/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          responseMimeType: "image/png",
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const imagePart = geminiData.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      console.error("No image in Gemini response:", JSON.stringify(geminiData).slice(0, 500));
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const url = `data:${mimeType};base64,${imagePart.inlineData.data}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("AI illustration generation error:", error);
    return NextResponse.json(
      { error: "일러스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
