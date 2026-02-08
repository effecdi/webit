"use client"

import { useState } from "react"

interface MapEmbedProps {
  address: string
  height?: number
  borderColor?: string
  bgColor?: string
}

export function MapEmbed({ address, height = 200, borderColor = "#E5E8EB", bgColor = "#F5F5F0" }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  if (!address || address.trim().length === 0) {
    return (
      <div
        className="flex items-center justify-center relative overflow-hidden"
        style={{ height, border: `1px solid ${borderColor}`, backgroundColor: bgColor }}
      >
        <div className="text-center">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" className="mx-auto mb-2">
            <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0zm0 22c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#B0B8C1"/>
          </svg>
          <p className="text-[12px] text-[#B0B8C1]">주소를 입력하면 지도가 표시됩니다</p>
        </div>
      </div>
    )
  }

  const encodedAddress = encodeURIComponent(address)
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`

  return (
    <div
      className="relative overflow-hidden"
      style={{ height, border: `1px solid ${borderColor}` }}
    >
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-[#B0B8C1] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[12px] text-[#B0B8C1]">지도 불러오는 중...</p>
          </div>
        </div>
      )}
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        title="Wedding venue map"
        data-testid="map-embed"
      />
    </div>
  )
}

export function openNaverDirections(address: string) {
  if (!address) return
  const encodedAddress = encodeURIComponent(address)
  const naverMapUrl = `nmap://search?query=${encodedAddress}&appname=weve`
  const webFallback = `https://map.naver.com/v5/search/${encodedAddress}`

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isIOS || isAndroid) {
    const start = Date.now()
    window.location.href = naverMapUrl
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.open(webFallback, "_blank")
      }
    }, 1500)
  } else {
    window.open(webFallback, "_blank")
  }
}

export function openKakaoTransfer() {
  const kakaoPayUrl = "https://qr.kakaopay.com/"
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isIOS || isAndroid) {
    const deepLink = "kakaotalk://kakaopay/money/to/send"
    const start = Date.now()
    window.location.href = deepLink
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.open(kakaoPayUrl, "_blank")
      }
    }, 1500)
  } else {
    window.open(kakaoPayUrl, "_blank")
  }
}

export function openKakaoGift() {
  const giftUrl = "https://gift.kakao.com/search/%EA%B2%B0%ED%98%BC%EC%84%A0%EB%AC%BC"
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isIOS || isAndroid) {
    const deepLink = "kakaotalk://store/search?keyword=결혼선물"
    const start = Date.now()
    window.location.href = deepLink
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.open(giftUrl, "_blank")
      }
    }, 1500)
  } else {
    window.open(giftUrl, "_blank")
  }
}
