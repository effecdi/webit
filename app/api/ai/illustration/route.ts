import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isUnauthorized(auth)) return auth;

  try {
    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 설정이 되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt:
        "A beautiful watercolor illustration of a wedding couple, bride in white dress and groom in suit, soft pastel colors, elegant minimalist style, romantic atmosphere, no background, transparent background style with white space, delicate brushstrokes, Korean wedding invitation style illustration",
      n: 1,
      size: "1024x1024",
      quality: "medium",
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    const url = `data:image/png;base64,${imageData.b64_json}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("AI illustration generation error:", error);
    return NextResponse.json(
      { error: "일러스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
