import { Suspense } from "react"
import WorkerDashboard from "@/components/worker-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Worker ID Management</h1>
        <Suspense fallback={<DashboardSkeleton />}>
          <WorkerDashboard />
        </Suspense>
      </div>
    </main>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
      </div>
    </div>
  )
}
