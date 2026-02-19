import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthUserId } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SYSTEM_PROMPT = `당신은 한국의 가족 활동 전문가입니다.
가족 구성과 상황에 맞는 활동과 나들이 코스를 추천합니다.

응답 형식 (JSON):
{
  "recommendations": [
    {
      "title": "활동 이름",
      "description": "간단한 설명 (2-3문장)",
      "places": ["장소1", "장소2"],
      "estimatedCost": "예상 비용 (만원 단위)",
      "duration": "예상 소요 시간",
      "ageGroup": "적합 연령대",
      "tip": "꿀팁 한마디"
    }
  ]
}

규칙:
- 항상 3개의 활동을 추천
- 한국어로 작성
- 아이 동반 가능 여부 명시
- 실제 존재하는 장소와 현실적인 비용 제시
- 계절과 날씨를 고려
- 교육적/체험적 활동 포함`;

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
    const { location, familySize, childAge, activityType } = body;

    const month = new Date().getMonth() + 1;
    let season = "봄";
    if (month >= 6 && month <= 8) season = "여름";
    else if (month >= 9 && month <= 11) season = "가을";
    else if (month >= 12 || month <= 2) season = "겨울";

    const userPrompt = `다음 조건에 맞는 가족 활동 3개를 추천해주세요:
${location ? `- 지역: ${location}` : "- 지역: 서울/수도권"}
${familySize ? `- 가족 인원: ${familySize}명` : ""}
${childAge ? `- 아이 나이: ${childAge}세` : ""}
${activityType ? `- 활동 유형: ${activityType}` : ""}
- 계절: ${season}

JSON 형식으로만 응답해주세요.`;

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
    console.error("AI family recommend error:", error);
    return NextResponse.json({ error: "추천 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
