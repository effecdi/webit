"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MapPin,
  Clock,
  Edit2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import WheelTimePicker from "@/components/ui/wheel-time-picker";

type ScheduleOwner = "me" | "you" | "we";

interface Schedule {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category?: string;
}

const OWNER_COLORS: Record<
  ScheduleOwner,
  { bg: string; dot: string; light: string }
> = {
  me: { bg: "bg-pink-500", dot: "bg-pink-400", light: "bg-pink-50" },
  you: { bg: "bg-[#d63bf2]", dot: "bg-[#e06cf7]", light: "bg-[#F3E8FF]" },
  we: { bg: "bg-purple-500", dot: "bg-purple-400", light: "bg-purple-50" },
};

const OWNER_LABELS: Record<ScheduleOwner, string> = {
  me: "나",
  you: "상대",
  we: "우리",
};

export function CoupleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null,
  );
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    time: "",
    location: "",
    owner: "we" as ScheduleOwner,
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events?mode=dating");
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setSchedules(
        items.map(
          (e: {
            id: number;
            title: string;
            date: string;
            time?: string;
            location?: string;
            category?: string;
          }) => ({
            ...e,
            date: e.date.split("T")[0],
          }),
        ),
      );
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getSchedulesForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return schedules.filter((s) => s.date === dateStr);
  };

  const getCategoryColor = (category?: string): ScheduleOwner => {
    if (category === "me") return "me";
    if (category === "you") return "you";
    return "we";
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      title: schedule.title,
      time: schedule.time || "",
      location: schedule.location || "",
      owner: getCategoryColor(schedule.category),
    });
    setSelectedDate(schedule.date);
    setShowModal(true);
  };

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (scheduleToDelete) {
      try {
        await fetch(`/api/events?id=${scheduleToDelete.id}`, {
          method: "DELETE",
        });
        setSchedules(schedules.filter((s) => s.id !== scheduleToDelete.id));
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
      setScheduleToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!newSchedule.title || !selectedDate) return;

    try {
      if (editingSchedule) {
        // Update existing schedule
        await fetch("/api/events", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingSchedule.id,
            title: newSchedule.title,
            date: selectedDate,
            time: newSchedule.time || undefined,
            location: newSchedule.location || undefined,
            category: newSchedule.owner,
          }),
        });
        setSchedules(
          schedules.map((s) =>
            s.id === editingSchedule.id
              ? {
                  ...s,
                  title: newSchedule.title,
                  date: selectedDate,
                  time: newSchedule.time || undefined,
                  location: newSchedule.location || undefined,
                  category: newSchedule.owner,
                }
              : s,
          ),
        );
      } else {
        // Create new schedule
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newSchedule.title,
            date: selectedDate,
            time: newSchedule.time || undefined,
            location: newSchedule.location || undefined,
            category: newSchedule.owner,
            mode: "dating",
          }),
        });
        const newItem = await res.json();
        setSchedules([
          ...schedules,
          { ...newItem, date: newItem.date.split("T")[0] },
        ]);
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }

    setNewSchedule({ title: "", time: "", location: "", owner: "we" });
    setEditingSchedule(null);
    setShowModal(false);
  };

  const resetAndCloseModal = () => {
    setNewSchedule({ title: "", time: "", location: "", owner: "we" });
    setEditingSchedule(null);
    setShowModal(false);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const selectedSchedules = selectedDate
    ? schedules.filter((s) => s.date === selectedDate)
    : [];

  return (
    <>
      <div className="px-5 pt-5 pb-5 max-w-md mx-auto">
        <div className="bg-white rounded-[20px] shadow-weve overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#F2F4F6]">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-[#F2F4F6]"
            >
              <ChevronLeft className="w-5 h-5 text-[#4E5968]" />
            </button>
            <h2 className="text-[18px] font-bold text-[#191F28]">
              {year}년 {month + 1}월
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-[#F2F4F6]"
            >
              <ChevronRight className="w-5 h-5 text-[#4E5968]" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[13px] font-medium text-[#8B95A1] py-3 border-b border-[#F2F4F6]">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div
                key={day}
                className={
                  day === "일"
                    ? "text-[#FF6B6B]"
                    : day === "토"
                      ? "text-[#d63bf2]"
                      : ""
                }
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 p-3">
            {days.map((day, index) => {
              const daySchedules = day ? getSchedulesForDate(day) : [];
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <button
                  key={index}
                  onClick={() => day && handleDateClick(day)}
                  disabled={!day}
                  className={`aspect-square p-1 rounded-[10px] flex flex-col items-center justify-start gap-0.5 transition-colors ${
                    day ? "hover:bg-[#F2F4F6]" : ""
                  } ${isToday ? "bg-pink-50" : ""}`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-[14px] font-medium ${
                          isToday
                            ? "text-pink-500 font-bold"
                            : index % 7 === 0
                              ? "text-[#FF6B6B]"
                              : index % 7 === 6
                                ? "text-[#d63bf2]"
                                : "text-[#333D4B]"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {daySchedules.slice(0, 3).map((s) => (
                          <div
                            key={s.id}
                            className={`w-1.5 h-1.5 rounded-full ${OWNER_COLORS[getCategoryColor(s.category)].dot}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            {(["me", "you", "we"] as ScheduleOwner[]).map((owner) => (
              <div key={owner} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${OWNER_COLORS[owner].dot}`}
                />
                <span className="text-[13px] text-[#8B95A1]">
                  {OWNER_LABELS[owner]}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-[17px] font-bold text-[#191F28] mb-3">
            다가오는 일정
          </h3>

          {isLoading ? (
            <div className="space-y-3 py-2 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#E5E8EB] dark:bg-[#2a2a2a] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#E5E8EB] dark:bg-[#2a2a2a] rounded-md w-2/3" />
                    <div className="h-3 bg-[#E5E8EB] dark:bg-[#2a2a2a] rounded-md w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : schedules.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#8B95A1] text-[14px]">등록된 일정이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">
                날짜를 클릭해서 일정을 추가해보세요
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedules
                .filter(
                  (s) =>
                    new Date(s.date) >=
                    new Date(new Date().toISOString().split("T")[0]),
                )
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                .slice(0, 5)
                .map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-4 rounded-[16px] ${OWNER_COLORS[getCategoryColor(schedule.category)].light}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[15px] font-medium text-[#191F28]">
                          {schedule.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[13px] text-[#8B95A1]">
                          <span>{schedule.date.replace(/-/g, ".")}</span>
                          {schedule.time && (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>{schedule.time}</span>
                            </>
                          )}
                        </div>
                        {schedule.location && (
                          <div className="flex items-center gap-1 mt-1 text-[12px] text-[#8B95A1]">
                            <MapPin className="w-3 h-3" />
                            <span>{schedule.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-1.5 rounded-full hover:bg-white/50"
                        >
                          <Edit2 className="w-4 h-4 text-[#8B95A1]" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(schedule)}
                          className="p-1.5 rounded-full hover:bg-white/50"
                        >
                          <Trash2 className="w-4 h-4 text-[#8B95A1]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={resetAndCloseModal}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F2F4F6]">
              <h3 className="text-[17px] font-bold text-[#191F28]">
                {editingSchedule ? "일정 수정" : "새 일정"}
              </h3>
              <button
                onClick={resetAndCloseModal}
                className="p-2 rounded-full hover:bg-[#F2F4F6]"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>

            {selectedSchedules.length > 0 && !editingSchedule && (
              <div className="px-5 py-3 border-b border-[#F2F4F6]">
                <p className="text-[13px] text-[#8B95A1] mb-2">이 날의 일정</p>
                {selectedSchedules.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${OWNER_COLORS[getCategoryColor(s.category)].dot}`}
                      />
                      <span className="text-[14px] text-[#333D4B]">
                        {s.title}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditSchedule(s)}
                        className="p-1"
                      >
                        <Edit2 className="w-4 h-4 text-[#8B95A1]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s)}
                        className="p-1"
                      >
                        <Trash2 className="w-4 h-4 text-[#8B95A1]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-5 space-y-4">
              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1 block">
                  일정 제목
                </label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, title: e.target.value })
                  }
                  placeholder="일정을 입력하세요"
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                  data-testid="input-schedule-title"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-[#8B95A1] mb-1 block">
                    시간
                  </label>
                  <WheelTimePicker
                    value={newSchedule.time}
                    onChange={(val) =>
                      setNewSchedule({ ...newSchedule, time: val })
                    }
                    placeholder="시간 선택"
                    className="!px-4 !py-3 !rounded-[12px] !text-[15px] !border-0"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-[#8B95A1] mb-1 block">
                    장소
                  </label>
                  <input
                    type="text"
                    value={newSchedule.location}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        location: e.target.value,
                      })
                    }
                    placeholder="장소"
                    className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-2 block">
                  담당
                </label>
                <div className="flex gap-2">
                  {(["me", "you", "we"] as ScheduleOwner[]).map((owner) => (
                    <button
                      key={owner}
                      onClick={() => setNewSchedule({ ...newSchedule, owner })}
                      className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors ${
                        newSchedule.owner === owner
                          ? `${OWNER_COLORS[owner].bg} text-white`
                          : `${OWNER_COLORS[owner].light} text-[#4E5968]`
                      }`}
                    >
                      {OWNER_LABELS[owner]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={handleSaveSchedule}
                disabled={!newSchedule.title}
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-[#E5E8EB] disabled:cursor-not-allowed text-white font-bold rounded-[14px] transition-colors"
                data-testid="button-save-schedule"
              >
                {editingSchedule ? "수정하기" : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5">
          <div className="bg-white rounded-[24px] w-full max-w-xs p-6 text-center">
            <h3 className="text-[17px] font-bold text-[#191F28] mb-2">
              일정 삭제
            </h3>
            <p className="text-[14px] text-[#8B95A1] mb-5">
              이 일정을 삭제할까요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setScheduleToDelete(null);
                }}
                className="flex-1 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-[12px]"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-[#FF6B6B] text-white font-medium rounded-[12px]"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0]);
          setShowModal(true);
        }}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
        data-testid="button-add-schedule-fab"
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="h-20" />
    </>
  );
}
