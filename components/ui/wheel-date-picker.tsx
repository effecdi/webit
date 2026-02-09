"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Picker from "react-mobile-picker"

interface WheelDatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minYear?: number
  maxYear?: number
  label?: string
}

function generateOptions(minYear: number, maxYear: number) {
  const years: string[] = []
  for (let y = minYear; y <= maxYear; y++) {
    years.push(String(y))
  }
  const months: string[] = []
  for (let m = 1; m <= 12; m++) {
    months.push(String(m).padStart(2, "0"))
  }
  const days: string[] = []
  for (let d = 1; d <= 31; d++) {
    days.push(String(d).padStart(2, "0"))
  }
  return { years, months, days }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export default function WheelDatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  className = "",
  minYear = 1950,
  maxYear = 2035,
  label,
}: WheelDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const parsed = value ? value.split("-") : null
  const initialYear = parsed ? parsed[0] : String(new Date().getFullYear())
  const initialMonth = parsed ? parsed[1] : String(new Date().getMonth() + 1).padStart(2, "0")
  const initialDay = parsed ? parsed[2] : String(new Date().getDate()).padStart(2, "0")

  const [pickerValue, setPickerValue] = useState({
    year: initialYear,
    month: initialMonth,
    day: initialDay,
  })

  useEffect(() => {
    if (value) {
      const parts = value.split("-")
      if (parts.length === 3) {
        setPickerValue({
          year: parts[0],
          month: parts[1],
          day: parts[2],
        })
      }
    }
  }, [value])

  const { years, months } = generateOptions(minYear, maxYear)

  const currentDaysInMonth = getDaysInMonth(
    Number(pickerValue.year),
    Number(pickerValue.month)
  )
  const days: string[] = []
  for (let d = 1; d <= currentDaysInMonth; d++) {
    days.push(String(d).padStart(2, "0"))
  }

  const handlePickerChange = useCallback(
    (newValue: { year: string; month: string; day: string }) => {
      const maxDay = getDaysInMonth(Number(newValue.year), Number(newValue.month))
      const adjustedDay = Number(newValue.day) > maxDay
        ? String(maxDay).padStart(2, "0")
        : newValue.day
      setPickerValue({ ...newValue, day: adjustedDay })
    },
    []
  )

  const handleConfirm = () => {
    const dateStr = `${pickerValue.year}-${pickerValue.month}-${pickerValue.day}`
    onChange(dateStr)
    setIsOpen(false)
  }

  const handleCancel = () => {
    if (value) {
      const parts = value.split("-")
      if (parts.length === 3) {
        setPickerValue({ year: parts[0], month: parts[1], day: parts[2] })
      }
    }
    setIsOpen(false)
  }

  const displayValue = value
    ? `${value.split("-")[0]}년 ${Number(value.split("-")[1])}월 ${Number(value.split("-")[2])}일`
    : ""

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full text-left px-4 py-3 rounded-xl border border-[#E5E8EB] bg-white text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#e0b3f5] ${
          displayValue ? "text-[#191919]" : "text-[#B0B8C1]"
        } ${className}`}
        data-testid="button-date-picker"
      >
        {displayValue || placeholder}
      </button>

      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40"
          onClick={(e) => {
            if (e.target === overlayRef.current) handleCancel()
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2F3F5]">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[15px] text-[#8B95A1] font-medium"
                data-testid="button-date-cancel"
              >
                취소
              </button>
              {label && (
                <span className="text-[15px] font-semibold text-[#191919]">{label}</span>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className="text-[15px] text-[#d63bf2] font-semibold"
                data-testid="button-date-confirm"
              >
                확인
              </button>
            </div>

            <div className="relative px-4 py-2">
              <Picker
                value={pickerValue}
                onChange={handlePickerChange}
                wheelMode="natural"
                height={216}
              >
                <Picker.Column name="year">
                  {years.map((y) => (
                    <Picker.Item key={y} value={y}>
                      {({ selected }) => (
                        <div
                          className={`text-center py-1 text-[18px] transition-all ${
                            selected
                              ? "font-semibold text-[#191919] scale-105"
                              : "text-[#B0B8C1]"
                          }`}
                        >
                          {y}년
                        </div>
                      )}
                    </Picker.Item>
                  ))}
                </Picker.Column>
                <Picker.Column name="month">
                  {months.map((m) => (
                    <Picker.Item key={m} value={m}>
                      {({ selected }) => (
                        <div
                          className={`text-center py-1 text-[18px] transition-all ${
                            selected
                              ? "font-semibold text-[#191919] scale-105"
                              : "text-[#B0B8C1]"
                          }`}
                        >
                          {Number(m)}월
                        </div>
                      )}
                    </Picker.Item>
                  ))}
                </Picker.Column>
                <Picker.Column name="day">
                  {days.map((d) => (
                    <Picker.Item key={d} value={d}>
                      {({ selected }) => (
                        <div
                          className={`text-center py-1 text-[18px] transition-all ${
                            selected
                              ? "font-semibold text-[#191919] scale-105"
                              : "text-[#B0B8C1]"
                          }`}
                        >
                          {Number(d)}일
                        </div>
                      )}
                    </Picker.Item>
                  ))}
                </Picker.Column>
              </Picker>

              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[42px] border-y border-[#E5E8EB] pointer-events-none rounded-lg bg-[#F7F8FA]/50" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
