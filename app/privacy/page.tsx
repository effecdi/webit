"use client"

import { useRouter } from "next/navigation"
import { FloatingBackButton } from "@/components/shared/floating-back-button"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh bg-white dark:bg-[#1a1a1a]">
      <header className="sticky top-0 sticky-header-safe z-50 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
        <div className="flex items-center justify-center px-4 h-14 max-w-md mx-auto">
          <h1 className="text-[18px] font-bold text-[#191F28] dark:text-white">개인정보 처리방침</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 py-6">
        <div className="space-y-8 text-[14px] leading-relaxed text-[#333D4B] dark:text-gray-300">

          <section>
            <p className="mb-4">
              WE:BEAT(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」(제30조에 따른 개인정보 처리방침 공개), 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「전자상거래 등에서의 소비자보호에 관한 법률」, 「통신비밀보호법」 등 관련 법령을 준수하고 있습니다. 본 개인정보 처리방침을 통해 이용자의 개인정보가 어떠한 목적과 방식으로 수집·이용·관리되고 있는지 알려드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제1조 (수집하는 개인정보 항목)</h2>
            <p className="mb-3">서비스는 회원가입 및 서비스 제공을 위해 다음 개인정보를 수집합니다:</p>

            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4 mb-3">
              <p className="font-semibold text-[#191F28] dark:text-white mb-2">1. 필수 수집 항목</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>소셜 로그인 식별자 (Google, Kakao, Apple 계정 ID)</li>
                <li>이름 (닉네임)</li>
                <li>이메일 주소</li>
                <li>프로필 사진 (소셜 계정 연동 시)</li>
              </ul>
            </div>

            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4 mb-3">
              <p className="font-semibold text-[#191F28] dark:text-white mb-2">2. 서비스 이용 과정에서 수집되는 항목</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>커플 관계 정보 (파트너 연결 상태)</li>
                <li>서비스 이용 기록 (일정, 사진, 할 일, 메모 등 사용자가 입력한 콘텐츠)</li>
                <li>기기 정보 (브라우저 종류, OS 버전)</li>
                <li>접속 로그, 접속 IP 주소, 쿠키</li>
                <li>결제 기록 (유료 서비스 이용 시)</li>
              </ul>
            </div>

            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4">
              <p className="font-semibold text-[#191F28] dark:text-white mb-2">3. 선택 수집 항목</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>생년월일</li>
                <li>기념일 정보 (처음 만난 날, 결혼일 등)</li>
                <li>결혼 준비 관련 정보 (예산, 게스트 목록 등)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제2조 (개인정보의 수집 및 이용 목적)</h2>
            <p className="mb-3">수집한 개인정보는 다음의 목적을 위해 이용됩니다:</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-[#d63bf2] font-bold shrink-0">1.</span>
                <div>
                  <p className="font-semibold text-[#191F28] dark:text-white">회원 관리</p>
                  <p className="text-[13px] text-[#8B95A1]">본인 확인, 회원 식별, 서비스 부정 이용 방지, 고지 및 통지사항 전달</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#d63bf2] font-bold shrink-0">2.</span>
                <div>
                  <p className="font-semibold text-[#191F28] dark:text-white">서비스 제공</p>
                  <p className="text-[13px] text-[#8B95A1]">커플 데이터 공유, 캘린더·사진·투두 등 핵심 기능 제공, 커뮤니티 운영</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#d63bf2] font-bold shrink-0">3.</span>
                <div>
                  <p className="font-semibold text-[#191F28] dark:text-white">서비스 개선</p>
                  <p className="text-[13px] text-[#8B95A1]">서비스 이용 통계 분석, 신규 기능 개발, 이용자 맞춤 서비스 제공</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-[#d63bf2] font-bold shrink-0">4.</span>
                <div>
                  <p className="font-semibold text-[#191F28] dark:text-white">결제 처리</p>
                  <p className="text-[13px] text-[#8B95A1]">유료 서비스 결제 및 환불 처리, 구독 관리</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제3조 (개인정보의 보유 및 이용 기간)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원의 개인정보는 서비스 이용 기간 동안 보유하며, 회원 탈퇴 시 지체 없이 파기합니다.</li>
              <li>단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                  <li>소비자의 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)</li>
                  <li>통신사실 확인자료: 3개월 (통신비밀보호법)</li>
                  <li>로그인 기록: 3개월 (통신비밀보호법)</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제4조 (개인정보의 제3자 제공)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.</li>
              <li>다만, 다음의 경우에는 예외로 합니다:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  <li>커플 연결 기능에 따라 파트너에게 공유되는 데이터 (이용자가 커플 연결에 동의한 범위 내)</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제5조 (개인정보의 처리 위탁)</h2>
            <p className="mb-3">서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다:</p>
            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4">
              <div className="grid grid-cols-2 gap-2 text-[13px]">
                <div>
                  <p className="font-semibold text-[#191F28] dark:text-white">수탁 업체</p>
                  <p className="text-[#8B95A1]">위탁 업무</p>
                </div>
                <div className="border-l border-[#E5E8EB] dark:border-gray-700 pl-3">
                  <p className="font-semibold text-[#191F28] dark:text-white">Google, Kakao, Apple</p>
                  <p className="text-[#8B95A1]">소셜 로그인 인증</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제6조 (개인정보의 파기)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>개인정보의 보유 기간이 경과하거나 처리 목적이 달성된 경우 해당 개인정보를 지체 없이 파기합니다.</li>
              <li>전자적 파일 형태의 정보는 복구할 수 없는 방법으로 삭제하며, 종이 문서에 기록된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제7조 (이용자의 권리와 행사 방법)</h2>
            <p className="mb-3">이용자는 언제든지 다음의 권리를 행사할 수 있습니다:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ol>
            <p className="mt-3">
              위 권리 행사는 서비스 내 설정 메뉴 또는 고객센터를 통해 가능하며, 서비스 제공자는 지체 없이 필요한 조치를 취하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제8조 (쿠키의 설치·운영 및 거부)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 쿠키(Cookie)를 사용합니다.</li>
              <li>쿠키는 서비스 이용 시 자동으로 생성되며, 세션 관리 및 이용자 편의를 위해 사용됩니다.</li>
              <li>이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 있을 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제9조 (개인정보 보호를 위한 기술적·관리적 대책)</h2>
            <p className="mb-3">서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>암호화:</strong> 이용자의 비밀번호 및 주요 개인정보는 암호화하여 저장·관리합니다.</li>
              <li><strong>접근 제한:</strong> 개인정보에 대한 접근 권한을 최소한의 인원으로 제한합니다.</li>
              <li><strong>보안 프로그램:</strong> 해킹이나 바이러스 등에 의한 개인정보 유출을 방지하기 위한 보안 시스템을 운영합니다.</li>
              <li><strong>SSL 암호화 통신:</strong> 서비스 내 데이터 전송 시 SSL(Secure Socket Layer) 암호화 프로토콜을 사용합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제10조 (개인정보 보호 책임자)</h2>
            <p className="mb-3">서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 이용자의 불만 처리 및 피해 구제를 위해 아래와 같이 개인정보 보호 책임자를 지정하고 있습니다:</p>
            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4">
              <div className="space-y-2 text-[13px]">
                <div className="flex gap-3">
                  <span className="text-[#8B95A1] w-16 shrink-0">담당자</span>
                  <span className="text-[#191F28] dark:text-white font-medium">WE:BEAT 개인정보 보호 담당</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#8B95A1] w-16 shrink-0">연락처</span>
                  <span className="text-[#191F28] dark:text-white font-medium">앱 내 1:1 문의하기</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제11조 (권익 침해 구제 방법)</h2>
            <p className="mb-3">개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다:</p>
            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4 space-y-2 text-[13px]">
              <div className="flex gap-3">
                <span className="text-[#8B95A1] shrink-0 w-[140px]">개인정보침해신고센터</span>
                <span className="text-[#191F28] dark:text-white">privacy.kisa.or.kr / 118</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B95A1] shrink-0 w-[140px]">개인정보분쟁조정위원회</span>
                <span className="text-[#191F28] dark:text-white">kopico.go.kr / 1833-6972</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B95A1] shrink-0 w-[140px]">대검찰청 사이버수사과</span>
                <span className="text-[#191F28] dark:text-white">spo.go.kr / 1301</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B95A1] shrink-0 w-[140px]">경찰청 사이버안전국</span>
                <span className="text-[#191F28] dark:text-white">cyberbureau.police.go.kr / 182</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제12조 (개인정보 처리방침의 변경)</h2>
            <p>
              본 개인정보 처리방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 수 있으며, 변경 시에는 서비스 내 공지사항을 통해 고지합니다.
            </p>
          </section>

          <section className="pt-4 border-t border-[#E5E8EB] dark:border-gray-700">
            <p className="text-[13px] text-[#8B95A1] dark:text-gray-500">
              시행일: 2026년 2월 9일
            </p>
            <p className="text-[13px] text-[#8B95A1] dark:text-gray-500 mt-1">
              최종 수정일: 2026년 2월 9일
            </p>
          </section>
        </div>
      </div>
      <FloatingBackButton />
    </main>
  )
}
