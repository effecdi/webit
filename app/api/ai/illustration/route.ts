import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { requireAuth, isUnauthorized } from "@/lib/api-auth";

const BASE_PROMPT =
  "A beautiful watercolor illustration of a wedding couple, bride in white dress and groom in suit, soft pastel colors, elegant minimalist style, romantic atmosphere, no background, transparent background style with white space, delicate brushstrokes, Korean wedding invitation style illustration";

const REFERENCE_PROMPT =
  "Transform this photo into a beautiful watercolor illustration style. Keep the couple's poses and composition but convert to soft pastel watercolor painting, elegant minimalist style, romantic atmosphere, clean white background, delicate brushstrokes, Korean wedding invitation style illustration";

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

    const body = await request.json();
    const { referenceImage } = body as { referenceImage?: string };

    let b64Result: string | undefined;

    if (referenceImage) {
      // Reference image provided — use images.edit to transform the photo
      const base64Data = referenceImage.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      const imageFile = new File([imageBuffer], "reference.png", { type: "image/png" });

      const response = await openai.images.edit({
        model: "gpt-image-1",
        image: imageFile,
        prompt: REFERENCE_PROMPT,
        size: "1024x1024",
      });

      b64Result = response.data?.[0]?.b64_json;
    } else {
      // No reference — generate from scratch
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: BASE_PROMPT,
        n: 1,
        size: "1024x1024",
        quality: "medium",
      });

      b64Result = response.data?.[0]?.b64_json;
    }

    if (!b64Result) {
      return NextResponse.json(
        { error: "이미지 생성에 실패했습니다." },
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
