import type { Metadata } from 'next'
import { db } from '@/db'
import { invitations } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Props = {
  params: Promise<{ shareId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params

  try {
    const result = await db.select().from(invitations)
      .where(eq(invitations.shareId, shareId))
      .limit(1)

    if (result.length > 0 && result[0].invitationData) {
      const data = result[0].invitationData as any
      const groomName = data.groomName || "신랑"
      const brideName = data.brideName || "신부"
      const title = `${groomName} ♥ ${brideName} 결혼합니다`
      const description = data.weddingDate
        ? `${data.weddingDate}에 열리는 결혼식에 초대합니다.`
        : "저희 결혼식에 초대합니다."
      const imageUrl = data.sharePhoto || data.mainPhotos?.[0] || undefined

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          ...(imageUrl ? { images: [imageUrl] } : {}),
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: '청첩장 - WE:BEAT',
    description: '결혼식에 초대합니다.',
  }
}

export default function SharedInvitationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
