import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `당신은 WE:BEAT(위브) 앱의 AI 고객지원 상담사입니다.
WE:BEAT는 커플의 연애, 결혼, 가정 생활을 지원하는 한국어 모바일 앱입니다.

앱의 주요 기능:
- 데이팅 모드: 커플 캘린더, 포토 갤러리, 투두리스트, D-Day 추적
- 웨딩 모드: 예산 관리, 체크리스트, 디지털 청첩장 편집기(9가지 템플릿), 하객 관리
- 패밀리 모드: 추억 아카이브, 공유 캘린더, 사진 정리
- 여행 모듈: 여행 계획, 일정, 체크리스트, 예산 관리
- 구독 시스템: Advanced/Premium 멤버십
- 카카오톡/구글 소셜 로그인

상담 지침:
- 친절하고 따뜻한 톤으로 답변하세요
- 간결하고 이해하기 쉬운 한국어를 사용하세요
- 앱 기능에 대한 질문에 정확하게 답변하세요
- 기술적 문제는 가능한 해결 방법을 안내하세요
- 답변을 모르면 솔직히 말하고, 추가 문의를 안내하세요
- 이모지를 사용하지 마세요
- 답변은 300자 이내로 간결하게 해주세요`;

export async function POST(request: NextRequest) {
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

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_completion_tokens: 500,
    });

    const reply = response.choices[0]?.message?.content || "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "AI 응답을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
