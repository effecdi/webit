"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export default function TermsPage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh bg-white dark:bg-[#1a1a1a]">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
        <div className="flex items-center gap-3 px-4 h-14 max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            data-testid="button-terms-back"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#191F28] dark:text-white" />
          </button>
          <h1 className="text-[18px] font-bold text-[#191F28] dark:text-white">이용약관</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5 py-6">
        <div className="space-y-8 text-[14px] leading-relaxed text-[#333D4B] dark:text-gray-300">

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 WE:VE(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 서비스 제공자와 이용자 간의 권리·의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다. 본 약관은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「콘텐츠산업 진흥법」 등 관련 법령을 준수합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제1조의2 (서비스 제공자 정보)</h2>
            <div className="bg-[#F7F8FA] dark:bg-gray-800 rounded-[12px] p-4 space-y-2 text-[13px]">
              <div className="flex gap-3">
                <span className="text-[#8B95A1] w-20 shrink-0">서비스명</span>
                <span className="text-[#191F28] dark:text-white font-medium">WE:VE</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B95A1] w-20 shrink-0">운영 책임자</span>
                <span className="text-[#191F28] dark:text-white font-medium">WE:VE 운영팀</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#8B95A1] w-20 shrink-0">고객 문의</span>
                <span className="text-[#191F28] dark:text-white font-medium">앱 내 1:1 문의하기 (AI 상담)</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제2조 (정의)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>&quot;서비스&quot;란 WE:VE가 제공하는 커플 라이프사이클 관리 애플리케이션 및 관련 서비스 일체를 말합니다.</li>
              <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
              <li>&quot;회원&quot;이란 서비스에 가입하여 이용자 계정을 부여받은 자를 말합니다.</li>
              <li>&quot;커플 연결&quot;이란 두 명의 회원이 파트너로 연결되어 데이터를 공유하는 상태를 말합니다.</li>
              <li>&quot;콘텐츠&quot;란 회원이 서비스 내에 게시한 텍스트, 사진, 영상 등 모든 형태의 정보를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
              <li>서비스 제공자는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 내에서 약관을 변경할 수 있으며, 변경된 약관은 공지 후 적용됩니다.</li>
              <li>회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제4조 (서비스의 제공)</h2>
            <p className="mb-2">서비스는 다음과 같은 기능을 제공합니다:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>커플 캘린더 및 일정 관리</li>
              <li>사진 갤러리 및 앨범 공유</li>
              <li>할 일 목록(투두) 관리</li>
              <li>D-Day 및 기념일 관리</li>
              <li>결혼 준비 도구 (예산, 체크리스트, 청첩장 등)</li>
              <li>커뮤니티 기능</li>
              <li>여행 계획 관리</li>
              <li>기타 서비스가 정하는 기능</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제5조 (회원가입 및 계정)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원가입은 소셜 로그인(Google, Kakao, Apple 등)을 통해 이루어집니다.</li>
              <li>회원은 자신의 계정 정보를 정확하게 유지해야 하며, 타인에게 계정을 양도하거나 공유할 수 없습니다.</li>
              <li>회원은 자신의 계정에서 발생하는 모든 활동에 대해 책임을 집니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제6조 (커플 연결 및 데이터 공유)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>커플 연결은 초대 코드를 통해 이루어지며, 양 당사자의 동의가 필요합니다.</li>
              <li>커플 연결 시 캘린더, 사진, 할 일 목록, 가계부 등의 데이터가 파트너와 공유됩니다.</li>
              <li>커플 연결 해제 시 공유 데이터의 처리에 대해서는 별도의 안내에 따릅니다.</li>
              <li>커플 연결은 1:1 관계만 허용되며, 동시에 여러 파트너와 연결할 수 없습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제7조 (유료 서비스)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스의 일부 기능은 유료로 제공될 수 있으며, 유료 서비스의 내용과 가격은 서비스 내에 별도로 표시됩니다.</li>
              <li>유료 서비스 결제는 서비스가 정하는 결제 수단을 통해 이루어집니다.</li>
              <li>결제 완료 후 환불은 관련 법령 및 서비스의 환불 정책에 따릅니다.</li>
              <li>구독형 서비스의 경우, 갱신일 이전에 해지하지 않으면 자동으로 갱신됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제7조의2 (청약철회 및 환불)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>이용자는 유료 서비스 구매일로부터 7일 이내에 청약철회를 요청할 수 있습니다. 다만, 이미 서비스를 이용한 경우에는 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조에 따라 청약철회가 제한될 수 있습니다.</li>
              <li>디지털 콘텐츠의 경우, 이용자가 다운로드하거나 사용을 시작한 이후에는 청약철회가 제한됩니다. 이 경우 서비스 제공자는 사전에 이용자에게 고지합니다.</li>
              <li>환불은 원래 결제 수단과 동일한 방법으로 처리되며, 환불 처리에 소요되는 기간은 결제 수단에 따라 다를 수 있습니다.</li>
              <li>구독형 서비스의 환불은 남은 이용 기간에 해당하는 금액을 일할 계산하여 환불합니다.</li>
              <li>서비스 제공자의 귀책사유로 인해 결제가 이루어진 경우 전액 환불합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제8조 (회원의 의무)</h2>
            <p className="mb-2">회원은 다음 행위를 하여서는 안 됩니다:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스를 이용하여 법령 또는 공서양속에 반하는 행위</li>
              <li>타인의 명예를 훼손하거나 불이익을 주는 행위</li>
              <li>서비스의 안정적 운영을 방해하는 행위</li>
              <li>서비스를 통해 수집된 정보를 서비스 제공자의 동의 없이 상업적으로 이용하는 행위</li>
              <li>음란물, 폭력적 콘텐츠 등 부적절한 콘텐츠를 게시하는 행위</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제9조 (콘텐츠의 관리)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원이 서비스에 게시한 콘텐츠의 저작권은 해당 회원에게 귀속됩니다.</li>
              <li>서비스 제공자는 관련 법령에 위반되거나 약관에 반하는 콘텐츠를 사전 통지 없이 삭제하거나 비공개 처리할 수 있습니다.</li>
              <li>커뮤니티에 게시된 콘텐츠는 다른 이용자에게 공개되며, 이에 대한 책임은 게시한 회원에게 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제10조 (서비스의 변경 및 중단)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스 제공자는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.</li>
              <li>서비스 변경 또는 중단 시 사전에 공지하며, 불가피한 경우 사후에 공지할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제11조 (회원 탈퇴 및 자격 제한)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원은 서비스 내 설정을 통해 언제든지 탈퇴를 요청할 수 있습니다.</li>
              <li>서비스 제공자는 회원이 본 약관을 위반한 경우 사전 경고 후 또는 즉시 이용을 제한하거나 자격을 상실시킬 수 있습니다.</li>
              <li>탈퇴 시 회원의 개인정보 및 콘텐츠는 개인정보 처리방침에 따라 처리됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제12조 (면책조항)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스 제공자는 천재지변, 기술적 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
              <li>서비스 제공자는 회원 간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해에 대해 책임을 지지 않습니다.</li>
              <li>서비스 제공자는 회원이 서비스에 게시한 정보의 신뢰도 및 정확성에 대해 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제13조 (손해배상)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스 제공자는 무료로 제공하는 서비스의 이용과 관련하여 이용자에게 발생한 어떠한 손해에 대해서도 책임을 지지 않습니다.</li>
              <li>유료 서비스의 경우, 서비스 제공자의 고의 또는 중과실로 인하여 이용자에게 손해가 발생한 때에는 관련 법령에 따라 손해를 배상합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제14조 (분쟁 해결)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 서비스 제공자와 이용자는 원만한 해결을 위해 성실히 협의합니다.</li>
              <li>분쟁이 해결되지 않는 경우 「전자상거래 등에서의 소비자보호에 관한 법률」, 「소비자기본법」 등 관련 법령에 따른 분쟁 해결 절차를 이용할 수 있습니다.</li>
              <li>이용자는 한국소비자원(www.kca.go.kr / 1372), 전자거래분쟁조정위원회(www.ecmc.or.kr) 등에 분쟁 조정을 신청할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-[16px] font-bold text-[#191F28] dark:text-white mb-3">제15조 (준거법 및 관할)</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관의 해석 및 서비스 이용에 관한 분쟁은 대한민국 법률에 따릅니다.</li>
              <li>서비스 이용과 관련하여 발생한 소송은 「민사소송법」에 따른 관할 법원에 제기합니다.</li>
            </ol>
          </section>

          <section className="pt-4 border-t border-[#E5E8EB] dark:border-gray-700">
            <p className="text-[13px] text-[#8B95A1] dark:text-gray-500">
              시행일: 2025년 1월 1일
            </p>
            <p className="text-[13px] text-[#8B95A1] dark:text-gray-500 mt-1">
              최종 수정일: 2025년 2월 1일
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
