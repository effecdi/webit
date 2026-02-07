import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

type TextType = "title" | "message" | "fundingMessage" | "fundingThanks" | "noticeTitle" | "endingContent";

const SYSTEM_PROMPT = `당신은 한국 결혼식 청첩장 문구 전문 카피라이터입니다.
아름답고 정제된 한국어로 청첩장에 어울리는 문구를 작성합니다.
- 격식 있으면서도 따뜻한 톤
- 간결하고 우아한 표현
- 줄바꿈(\\n)으로 적절히 문단 구분
- 이모지 절대 사용 금지
- JSON 형식으로 응답: { "text": "생성된 문구" }`;

function getPrompt(type: TextType, context: { groomName?: string; brideName?: string; date?: string; venue?: string }): string {
  const names = context.groomName && context.brideName
    ? `신랑: ${context.groomName}, 신부: ${context.brideName}`
    : "";
  const dateInfo = context.date ? `날짜: ${context.date}` : "";
  const venueInfo = context.venue ? `장소: ${context.venue}` : "";
  const contextStr = [names, dateInfo, venueInfo].filter(Boolean).join(", ");

  switch (type) {
    case "title":
      return `청첩장의 제목(타이틀)을 하나만 생성해주세요. 10자 이내의 짧고 인상적인 문구여야 합니다. 예시: "소중한 날에 초대합니다", "사랑으로 하나 되는 날"${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;

    case "message":
      return `청첩장의 초대 인사말을 하나만 작성해주세요. 3~5문장 정도의 따뜻한 초대 메시지입니다. 줄바꿈(\\n)으로 적절히 구분해주세요.${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;

    case "fundingMessage":
      return `축의금/펀딩 안내 문구를 하나만 작성해주세요. 하객분들께 축의금 대신 마음을 모아달라는 정중한 안내입니다. 2~3문장, 줄바꿈(\\n)으로 구분.${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;

    case "fundingThanks":
      return `축의금/펀딩 감사 인사 문구를 하나만 작성해주세요. 축의금을 보내준 분께 감사하는 짧은 메시지입니다. 2~3문장, 줄바꿈(\\n)으로 구분.`;

    case "noticeTitle":
      return `청첩장의 공지사항/안내사항 섹션 제목을 하나만 생성해주세요. 5~10자 이내의 짧은 제목입니다. 예시: "안내사항", "참석 안내", "식장 안내"`;

    case "endingContent":
      return `청첩장의 엔딩(마무리) 메시지를 하나만 작성해주세요. 감사의 마음을 담은 따뜻한 마무리 인사입니다. 2~4문장, 줄바꿈(\\n)으로 구분.${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;

    default:
      return "청첩장에 어울리는 문구를 하나 작성해주세요.";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, context = {} } = body as { type: TextType; context?: { groomName?: string; brideName?: string; date?: string; venue?: string } };

    if (!type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    const prompt = getPrompt(type, context);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "{}";
    let parsed: { text?: string };
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { text: content };
    }

    return NextResponse.json({ text: parsed.text || "" });
  } catch (error: any) {
    console.error("AI invitation text generation error:", error);
    return NextResponse.json(
      { error: "AI 문구 생성에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
