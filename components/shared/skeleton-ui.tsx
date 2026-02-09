"use client"

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#E5E8EB] dark:bg-[#2a2a2a] animate-pulse ${className}`} />
  )
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <SkeletonBox className="h-4 w-32 rounded-md" />
        <SkeletonBox className="w-14 h-14 rounded-full" />
      </div>
      <SkeletonBox className="h-9 w-20 rounded-md mb-2" />
      <SkeletonBox className="h-4 w-48 rounded-md" />
    </div>
  )
}

export function QuickActionsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4 gap-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <SkeletonBox className="w-14 h-14 rounded-[18px]" />
          <SkeletonBox className="h-3 w-12 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function TodoListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 py-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBox className="w-6 h-6 rounded-full flex-shrink-0" />
          <SkeletonBox className={`h-4 rounded-md flex-1 ${i === 0 ? "w-3/4" : i === 1 ? "w-2/3" : "w-1/2"}`} />
          <SkeletonBox className="h-5 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function EventListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3 py-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBox className="w-12 h-12 rounded-[14px] flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className={`h-4 rounded-md ${i === 0 ? "w-2/3" : "w-1/2"}`} />
            <SkeletonBox className="h-3 rounded-full w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AlbumGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-3 pb-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36">
          <SkeletonBox className="w-full aspect-square rounded-[12px] mb-2" />
          <SkeletonBox className="h-4 rounded-md w-2/3 mb-1" />
          <SkeletonBox className="h-3 rounded-md w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-[16px] p-5">
          <div className="flex items-center justify-between mb-3">
            <SkeletonBox className="h-5 w-14 rounded-full" />
            <SkeletonBox className="h-3 w-16 rounded-md" />
          </div>
          <SkeletonBox className={`h-5 rounded-md mb-3 ${i === 0 ? "w-3/4" : i === 1 ? "w-2/3" : "w-4/5"}`} />
          <SkeletonBox className="h-3 rounded-md w-full mb-2" />
          <SkeletonBox className="h-3 rounded-md w-2/3 mb-4" />
          <div className="flex items-center justify-between pt-3 border-t border-[#F2F4F6] dark:border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <SkeletonBox className="w-5 h-5 rounded-full" />
              <SkeletonBox className="h-3 w-12 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBox className="h-3 w-8 rounded-md" />
              <SkeletonBox className="h-3 w-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BudgetSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-5 w-20 rounded-md" />
        <SkeletonBox className="h-4 w-16 rounded-md" />
      </div>
      <SkeletonBox className="h-2 w-full rounded-full mb-4" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <SkeletonBox className="h-3 w-12 rounded-md" />
            <SkeletonBox className="h-5 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChecklistSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBox className="w-5 h-5 rounded-full flex-shrink-0" />
          <SkeletonBox className={`h-4 rounded-md flex-1 ${i % 2 === 0 ? "w-3/4" : "w-2/3"}`} />
          <SkeletonBox className="h-3 w-14 rounded-md" />
        </div>
      ))}
    </div>
  )
}

export function MoodSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-5 w-16 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <SkeletonBox className="w-16 h-16 rounded-full" />
          <SkeletonBox className="h-3 w-10 rounded-md" />
        </div>
        <SkeletonBox className="w-6 h-6 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <SkeletonBox className="w-16 h-16 rounded-full" />
          <SkeletonBox className="h-3 w-10 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-5 max-w-md mx-auto">
      <div className="flex items-center gap-4">
        <SkeletonBox className="w-20 h-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBox className="h-5 w-24 rounded-md" />
          <SkeletonBox className="h-3 w-40 rounded-md" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-[16px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBox className="w-10 h-10 rounded-[12px]" />
              <SkeletonBox className="h-4 w-24 rounded-md" />
            </div>
            <SkeletonBox className="w-5 h-5 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="animate-pulse p-5 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBox className="h-6 w-24 rounded-md" />
        <SkeletonBox className="h-8 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonBox key={i} className="aspect-square rounded-[8px]" />
        ))}
      </div>
    </div>
  )
}

export function TravelSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-5 max-w-md mx-auto">
      <SkeletonBox className="h-48 w-full rounded-[20px]" />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <SkeletonBox className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-4 w-2/3 rounded-md" />
            <SkeletonBox className="h-3 w-1/3 rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <SkeletonBox key={i} className="h-9 flex-1 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <SkeletonBox key={i} className="h-16 w-full rounded-[14px]" />
        ))}
      </div>
    </div>
  )
}

export function WidgetStoreSkeleton() {
  return (
    <div className="animate-pulse p-5 max-w-md mx-auto space-y-6">
      <div className="space-y-3">
        <SkeletonBox className="h-5 w-24 rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-[16px] p-4 space-y-3">
              <SkeletonBox className="w-10 h-10 rounded-[12px]" />
              <SkeletonBox className="h-4 w-2/3 rounded-md" />
              <SkeletonBox className="h-3 w-full rounded-md" />
              <SkeletonBox className="h-8 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MembershipSkeleton() {
  return (
    <div className="animate-pulse p-5 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <SkeletonBox className="h-7 w-40 rounded-md mx-auto" />
        <SkeletonBox className="h-4 w-56 rounded-md mx-auto" />
      </div>
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-[20px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-6 w-24 rounded-md" />
              <SkeletonBox className="h-5 w-20 rounded-full" />
            </div>
            <SkeletonBox className="h-8 w-32 rounded-md" />
            <div className="space-y-2">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex items-center gap-2">
                  <SkeletonBox className="w-4 h-4 rounded-full" />
                  <SkeletonBox className="h-3 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
            <SkeletonBox className="h-12 w-full rounded-[14px]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CommunityDetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[16px] p-5">
        <SkeletonBox className="h-5 w-16 rounded-full mb-4" />
        <SkeletonBox className="h-6 w-3/4 rounded-md mb-4" />
        <div className="flex items-center gap-2 mb-5">
          <SkeletonBox className="w-6 h-6 rounded-full" />
          <SkeletonBox className="h-3 w-16 rounded-md" />
          <SkeletonBox className="h-3 w-20 rounded-md" />
        </div>
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-full rounded-md" />
          <SkeletonBox className="h-4 w-full rounded-md" />
          <SkeletonBox className="h-4 w-3/4 rounded-md" />
          <SkeletonBox className="h-4 w-1/2 rounded-md" />
        </div>
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-[#F2F4F6] dark:border-[#2a2a2a]">
          <SkeletonBox className="h-8 w-16 rounded-full" />
          <SkeletonBox className="h-8 w-16 rounded-full" />
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[16px] p-5">
        <SkeletonBox className="h-5 w-20 rounded-md mb-4" />
        {[1, 2].map(i => (
          <div key={i} className="py-3 space-y-2">
            <div className="flex items-center gap-2">
              <SkeletonBox className="w-6 h-6 rounded-full" />
              <SkeletonBox className="h-3 w-16 rounded-md" />
            </div>
            <SkeletonBox className="h-4 w-full rounded-md ml-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function DatingDashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-2">
            <SkeletonBox className="h-4 w-32 rounded-md" />
            <SkeletonBox className="h-7 w-48 rounded-md" />
          </div>
          <SkeletonBox className="w-12 h-12 rounded-full" />
        </div>
        <SkeletonBox className="h-4 w-24 rounded-full mt-2" />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <MoodSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <SkeletonBox className="h-5 w-20 rounded-md mb-4" />
        <QuickActionsSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-20 rounded-md" />
          <SkeletonBox className="h-4 w-12 rounded-md" />
        </div>
        <TodoListSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-28 rounded-md" />
          <SkeletonBox className="h-4 w-12 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#F2F4F6] dark:bg-[#222] rounded-[16px] p-4 space-y-2">
              <SkeletonBox className="w-8 h-8 rounded-full" />
              <SkeletonBox className="h-6 w-12 rounded-md" />
              <SkeletonBox className="h-3 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function WeddingDashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-6 shadow-weve">
        <DashboardHeaderSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <SkeletonBox className="h-5 w-20 rounded-md mb-4" />
        <QuickActionsSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <BudgetSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-24 rounded-md" />
          <SkeletonBox className="h-4 w-12 rounded-md" />
        </div>
        <ChecklistSkeleton />
      </div>
    </div>
  )
}

export function FamilyDashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="space-y-2 mb-4">
          <SkeletonBox className="h-4 w-32 rounded-md" />
          <SkeletonBox className="h-7 w-48 rounded-md" />
        </div>
        <SkeletonBox className="h-4 w-24 rounded-full" />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <SkeletonBox className="h-5 w-20 rounded-md mb-4" />
        <QuickActionsSkeleton count={3} />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-24 rounded-md" />
          <SkeletonBox className="h-4 w-12 rounded-md" />
        </div>
        <EventListSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-20 rounded-md" />
          <SkeletonBox className="h-4 w-12 rounded-md" />
        </div>
        <TodoListSkeleton />
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-[24px] p-5 shadow-weve">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-28 rounded-md" />
          <SkeletonBox className="h-4 w-12 rounded-md" />
        </div>
        <AlbumGridSkeleton />
      </div>
    </div>
  )
}
