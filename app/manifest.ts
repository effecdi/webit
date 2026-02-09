import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WE:BEAT - 우리의 모든 순간',
    short_name: 'WE:BEAT',
    description: '커플의 생애주기를 함께하는 슈퍼앱',
    start_url: '/splash',
    display: 'standalone',
    background_color: '#F2F4F6',
    theme_color: '#d63bf2',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: '캘린더',
        short_name: '캘린더',
        description: '커플 일정을 확인하세요',
        url: '/dating/calendar',
        icons: [
          {
            src: '/shortcut-calendar.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: '사진 앨범',
        short_name: '사진',
        description: '함께한 추억을 감상하세요',
        url: '/dating/photos',
        icons: [
          {
            src: '/shortcut-photos.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: '할 일',
        short_name: '할 일',
        description: '커플 할 일 목록을 확인하세요',
        url: '/dating/todos',
        icons: [
          {
            src: '/shortcut-todos.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  }
}
