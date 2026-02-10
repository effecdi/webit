import type { InvitationData } from "@/app/wedding/editor/page"

export const FONT_FAMILIES: Record<string, string> = {
  KyoboHandwriting2019: "'KyoboHandwriting2019', cursive",
  KyoboHandwriting2021: "'KyoboHandwriting2021', cursive",
  KyoboHandwriting2022: "'KyoboHandwriting2022', cursive",
  KotraHandwriting: "'KotraHandwriting', cursive",
  MaruBuri: "'MaruBuri', serif",
  Caveat: "'Caveat', cursive",
  "Dancing Script": "'Dancing Script', cursive",
  "Great Vibes": "'Great Vibes', cursive",
  Satisfy: "'Satisfy', cursive",
  "Nanum Pen Script": "'Nanum Pen Script', cursive",
}

export function getKoreanFont(data: InvitationData, fallback: string = "'Pretendard', sans-serif"): string {
  if (data.fontKorean && FONT_FAMILIES[data.fontKorean]) {
    return FONT_FAMILIES[data.fontKorean]
  }
  return fallback
}

export function getEnglishFont(data: InvitationData, fallback: string = "Georgia, serif"): string {
  if (data.fontEnglish && FONT_FAMILIES[data.fontEnglish]) {
    return FONT_FAMILIES[data.fontEnglish]
  }
  return fallback
}
