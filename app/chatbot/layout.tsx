import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "1:1 문의하기 - WE:BEAT",
  description: "WE:BEAT AI 상담사에게 궁금한 점을 문의하세요.",
}

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
