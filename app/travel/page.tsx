"use client"

import { useState } from "react"
import Link from "next/link"
import WheelDatePicker from "@/components/ui/wheel-date-picker"
import { useRouter } from "next/navigation"
import { FloatingBackButton } from "@/components/shared/floating-back-button"
import { 
  ArrowLeft, 
  Plus, 
  Plane, 
  MapPin, 
  Calendar,
  X
} from "lucide-react"

interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  status: "upcoming" | "past"
  image?: string
}


function calculateDday(targetDate: string) {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startStr = startDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  const endStr = endDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  return `${startStr} - ${endStr}`
}

function getDuration(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return `${diff - 1}박 ${diff}일`
}

export default function TravelListPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTrip, setNewTrip] = useState({
    destination: "",
    startDate: "",
    endDate: ""
  })
  
  const upcomingTrips = trips.filter(t => t.status === "upcoming")
  const pastTrips = trips.filter(t => t.status === "past")

  const handleAddTrip = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) return
    
    const trip: Trip = {
      id: Date.now().toString(),
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      status: "upcoming"
    }
    
    setTrips([...trips, trip])
    setNewTrip({ destination: "", startDate: "", endDate: "" })
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      <header className="fixed top-0 fixed-header-safe left-0 right-0 z-50 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-center px-5 py-3 max-w-md mx-auto">
          <h1 className="text-[17px] font-bold text-[#191F28]">우리의 여행</h1>
        </div>
      </header>

      <main className="pt-16 px-5 max-w-md mx-auto">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-6">
              <Plane className="w-12 h-12 text-[#3B82F6]" />
            </div>
            <h2 className="text-[19px] font-bold text-[#191F28] mb-2">아직 여행이 없어요</h2>
            <p className="text-[14px] text-[#8B95A1] text-center mb-6">
              첫 여행을 계획해보세요!<br/>
              함께하는 여행이 더 특별해져요
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#3B82F6] text-white font-bold rounded-[12px] flex items-center gap-2"
              data-testid="button-add-first-trip"
            >
              <Plus className="w-5 h-5" />
              첫 여행 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {upcomingTrips.length > 0 && (
              <section>
                <h2 className="text-[13px] font-bold text-[#8B95A1] mb-3 px-1">다가오는 여행</h2>
                <div className="space-y-3">
                  {upcomingTrips.map(trip => {
                    const dday = calculateDday(trip.startDate)
                    return (
                      <Link 
                        key={trip.id} 
                        href={`/travel/${trip.id}`}
                        className="block"
                        data-testid={`card-trip-${trip.id}`}
                      >
                        <div className="bg-white rounded-[20px] p-5 shadow-weve hover:scale-[1.01] active:scale-[0.99] transition-transform">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center flex-shrink-0">
                              <Plane className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[12px] font-bold text-white bg-[#3B82F6] px-2 py-0.5 rounded-full">
                                  D-{dday}
                                </span>
                                <span className="text-[12px] text-[#8B95A1]">
                                  {getDuration(trip.startDate, trip.endDate)}
                                </span>
                              </div>
                              <h3 className="text-[19px] font-bold text-[#191F28] mb-1">{trip.destination}</h3>
                              <div className="flex items-center gap-1 text-[13px] text-[#8B95A1]">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
            
            {pastTrips.length > 0 && (
              <section>
                <h2 className="text-[13px] font-bold text-[#8B95A1] mb-3 px-1">지난 여행</h2>
                <div className="space-y-3">
                  {pastTrips.map(trip => (
                    <Link 
                      key={trip.id} 
                      href={`/travel/${trip.id}`}
                      className="block"
                      data-testid={`card-trip-${trip.id}`}
                    >
                      <div className="bg-white rounded-[20px] p-5 shadow-weve opacity-60 grayscale hover:opacity-80 transition-opacity">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-[16px] bg-[#8B95A1] flex items-center justify-center flex-shrink-0">
                            <Plane className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[12px] text-[#8B95A1]">
                                {getDuration(trip.startDate, trip.endDate)}
                              </span>
                            </div>
                            <h3 className="text-[17px] font-bold text-[#191F28] mb-1">{trip.destination}</h3>
                            <div className="flex items-center gap-1 text-[13px] text-[#8B95A1]">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#3B82F6] rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40"
        data-testid="button-add-trip"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setShowAddModal(false)} 
          />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-[#191F28]">새 여행 추가</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center"
                data-testid="button-close-add-modal"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">여행지</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1]" />
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    placeholder="어디로 떠나세요?"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    data-testid="input-destination"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">출발일</label>
                  <WheelDatePicker
                    value={newTrip.startDate}
                    onChange={(val) => setNewTrip({ ...newTrip, startDate: val })}
                    placeholder="출발일 선택"
                    className="!px-4 !py-3.5 !bg-[#F2F4F6] !rounded-[12px] !text-[15px]"
                    label="출발일"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">도착일</label>
                  <WheelDatePicker
                    value={newTrip.endDate}
                    onChange={(val) => setNewTrip({ ...newTrip, endDate: val })}
                    placeholder="도착일 선택"
                    className="!px-4 !py-3.5 !bg-[#F2F4F6] !rounded-[12px] !text-[15px]"
                    label="도착일"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddTrip}
                disabled={!newTrip.destination || !newTrip.startDate || !newTrip.endDate}
                className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-[12px] disabled:bg-[#B0B8C1] disabled:cursor-not-allowed mt-2"
                data-testid="button-confirm-add-trip"
              >
                여행 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
      <FloatingBackButton />
    </div>
  )
}
