import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `당신은 한국의 데이트 코스 전문가입니다.
커플의 취향과 상황에 맞는 데이트 코스를 추천합니다.

응답 형식 (JSON):
{
  "recommendations": [
    {
      "title": "코스 이름",
      "description": "간단한 설명 (2-3문장)",
      "places": ["장소1", "장소2", "장소3"],
      "estimatedCost": "예상 비용 (만원 단위)",
      "duration": "예상 소요 시간",
      "mood": "분위기 키워드",
      "tip": "꿀팁 한마디"
    }
  ]
}

규칙:
- 항상 3개의 코스를 추천
- 한국어로 작성
- 실제 존재하는 장소와 현실적인 비용 제시
- 계절과 날씨를 고려
- 다양한 가격대와 분위기 포함`;

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const plan = user?.subscriptionPlan || "free";
    if (plan !== "premium") {
      return NextResponse.json(
        { error: "PREMIUM_REQUIRED", message: "프리미엄 구독이 필요한 기능입니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { location, mood, budget, season } = body;

    const userPrompt = `다음 조건에 맞는 데이트 코스 3개를 추천해주세요:
${location ? `- 지역: ${location}` : "- 지역: 서울/수도권"}
${mood ? `- 원하는 분위기: ${mood}` : ""}
${budget ? `- 예산: ${budget}` : "- 예산: 제한 없음"}
${season ? `- 계절: ${season}` : `- 계절: ${getCurrentSeason()}`}

JSON 형식으로만 응답해주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 응답 파싱 실패" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI date recommend error:", error);
    return NextResponse.json({ error: "추천 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}
