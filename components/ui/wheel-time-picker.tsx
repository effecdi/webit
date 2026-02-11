"use client"

import { useState, useCallback, useEffect } from "react"
import Picker from "react-mobile-picker"
import { BottomSheet } from "@/components/ui/bottom-sheet"

interface WheelTimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

function generateOptions() {
  const hours: string[] = []
  for (let h = 0; h <= 23; h++) {
    hours.push(String(h).padStart(2, "0"))
  }
  const minutes: string[] = []
  for (let m = 0; m <= 59; m += 5) {
    minutes.push(String(m).padStart(2, "0"))
  }
  return { hours, minutes }
}

const { hours, minutes } = generateOptions()

function formatDisplay(hour: string, minute: string) {
  const h = Number(hour)
  const period = h < 12 ? "오전" : "오후"
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${period} ${displayH}시 ${Number(minute)}분`
}

export default function WheelTimePicker({
  value,
  onChange,
  placeholder = "시간 선택",
  className = "",
  label,
}: WheelTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)


  const parsed = value ? value.split(":") : null
  const initialHour = parsed ? parsed[0] : "12"
  const initialMinuteRaw = parsed ? Number(parsed[1]) : 0
  const initialMinute = String(Math.round(initialMinuteRaw / 5) * 5).padStart(2, "0")

  const [pickerValue, setPickerValue] = useState({
    hour: initialHour,
    minute: initialMinute,
  })

  useEffect(() => {
    if (value) {
      const parts = value.split(":")
      if (parts.length >= 2) {
        const roundedMin = Math.round(Number(parts[1]) / 5) * 5
        setPickerValue({
          hour: parts[0],
          minute: String(Math.min(roundedMin, 55)).padStart(2, "0"),
        })
      }
    }
  }, [value])

  const handlePickerChange = useCallback(
    (newValue: { hour: string; minute: string }) => {
      setPickerValue(newValue)
    },
    []
  )

  const handleConfirm = () => {
    const timeStr = `${pickerValue.hour}:${pickerValue.minute}`
    onChange(timeStr)
    setIsOpen(false)
  }

  const handleCancel = () => {
    if (value) {
      const parts = value.split(":")
      if (parts.length >= 2) {
        const roundedMin = Math.round(Number(parts[1]) / 5) * 5
        setPickerValue({
          hour: parts[0],
          minute: String(Math.min(roundedMin, 55)).padStart(2, "0"),
        })
      }
    }
    setIsOpen(false)
  }

  const displayValue = value
    ? formatDisplay(value.split(":")[0], value.split(":")[1])
    : ""

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full text-left px-4 py-3 rounded-xl border border-[#E5E8EB] bg-white text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#e0b3f5] ${
          displayValue ? "text-[#191919]" : "text-[#B0B8C1]"
        } ${className}`}
        data-testid="button-time-picker"
      >
        {displayValue || placeholder}
      </button>

      <BottomSheet
        open={isOpen}
        onOpenChange={(open) => { if (!open) handleCancel() }}
        className="bg-white z-[9999] overflow-hidden"
        overlayClassName="z-[9999]"
        showHandle={false}
      >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2F3F5]">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[15px] text-[#8B95A1] font-medium"
                data-testid="button-time-cancel"
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
                data-testid="button-time-confirm"
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
                <Picker.Column name="hour">
                  {hours.map((h) => (
                    <Picker.Item key={h} value={h}>
                      {({ selected }) => (
                        <div
                          className={`text-center py-1 text-[18px] transition-all ${
                            selected
                              ? "font-semibold text-[#191919] scale-105"
                              : "text-[#B0B8C1]"
                          }`}
                        >
                          {Number(h) < 12 ? "오전" : "오후"} {Number(h) === 0 ? 12 : Number(h) > 12 ? Number(h) - 12 : Number(h)}시
                        </div>
                      )}
                    </Picker.Item>
                  ))}
                </Picker.Column>
                <Picker.Column name="minute">
                  {minutes.map((m) => (
                    <Picker.Item key={m} value={m}>
                      {({ selected }) => (
                        <div
                          className={`text-center py-1 text-[18px] transition-all ${
                            selected
                              ? "font-semibold text-[#191919] scale-105"
                              : "text-[#B0B8C1]"
                          }`}
                        >
                          {Number(m)}분
                        </div>
                      )}
                    </Picker.Item>
                  ))}
                </Picker.Column>
              </Picker>

              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[42px] border-y border-[#E5E8EB] pointer-events-none rounded-lg bg-[#F7F8FA]/50" />
            </div>
      </BottomSheet>
    </>
  )
}
