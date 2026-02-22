import { NextRequest, NextResponse } from "next/server";

type TextType = "title" | "message" | "fundingMessage" | "fundingThanks" | "noticeTitle" | "endingContent";

const TEMPLATES: Record<TextType, string[]> = {
  message: [
    "서로 다른 두 사람이\n하나의 사랑으로 만나\n평생을 함께하고자 합니다.\n\n소중한 분들을 모시고\n사랑의 서약을 하려 합니다.\n귀한 걸음으로 축복해 주세요.",
    "사랑이 꽃피는 계절,\n저희 두 사람이\n영원한 사랑을 약속합니다.\n\n함께해 주시면\n더없는 기쁨이겠습니다.",
    "오래도록 간직할\n소중한 날을 맞이합니다.\n\n두 사람의 작은 시작을\n따뜻한 마음으로\n축복해 주시면 감사하겠습니다.",
    "좋은 인연으로 만나\n사랑을 키워온 저희가\n이제 하나의 가정을 이루려 합니다.\n\n바쁘시더라도 오셔서\n축하해 주시면 감사하겠습니다.",
    "하늘이 맺어준 인연으로\n한 길을 걸어가려 합니다.\n\n저희의 새 출발을\n가까이에서 지켜봐 주시고\n축복해 주세요.",
    "서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어가고자 합니다.\n\n저희의 앞날을 축복해 주세요.",
  ],
  title: [
    "우리의 시작",
    "사랑의 약속",
    "함께하는 영원",
    "두 사람의 이야기",
    "새로운 시작",
    "소중한 만남",
    "우리, 결혼합니다",
    "사랑으로 하나 되는 날",
    "소중한 날에 초대합니다",
    "평생의 약속",
  ],
  fundingMessage: [
    "축하의 마음을 전해주세요.\n여러분의 따뜻한 마음이\n저희의 새 출발에 큰 힘이 됩니다.",
    "직접 오시기 어려운 분들을 위해\n마음을 전할 수 있는 공간을 마련했습니다.\n감사한 마음으로 잘 쓰겠습니다.",
    "소중한 축하의 마음,\n감사히 받겠습니다.\n행복한 가정을 만들어 가는 데\n소중히 사용하겠습니다.",
  ],
  fundingThanks: [
    "따뜻한 마음 감사합니다.\n행복하게 잘 살겠습니다.",
    "보내주신 축하에 진심으로 감사드립니다.\n예쁘게 살겠습니다.",
    "감사합니다.\n좋은 모습으로 보답하겠습니다.",
    "소중한 마음 잘 받았습니다.\n늘 감사하며 살겠습니다.",
  ],
  noticeTitle: [
    "오시는 길 안내",
    "알려드립니다",
    "참석 안내",
    "안내사항",
    "식사 안내",
    "식장 안내",
  ],
  endingContent: [
    "오늘 이 자리에 함께해 주셔서\n진심으로 감사합니다.\n\n앞으로도 예쁜 사랑 나누며\n행복하게 살겠습니다.",
    "저희의 새 출발을\n축복해 주셔서 감사합니다.\n\n늘 감사하는 마음으로\n함께 살아가겠습니다.",
    "소중한 분들의 축하 속에\n아름다운 시작을 하게 되었습니다.\n\n감사의 마음을 잊지 않고\n행복한 가정을 만들겠습니다.",
  ],
};

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { type, context = {} } = await request.json() as {
      type: TextType;
      context?: { groomName?: string; brideName?: string; date?: string; venue?: string };
    };

    const templates = TEMPLATES[type] || TEMPLATES.message;
    let text = pick(templates);

    // 이름이 있으면 메시지에 반영
    if (type === "message" && context.groomName && context.brideName) {
      text = `${context.groomName} 그리고 ${context.brideName}\n\n${text}`;
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Invitation text generation error:", error);
    return NextResponse.json({ error: "문구 생성에 실패했습니다." }, { status: 500 });
  }
}
