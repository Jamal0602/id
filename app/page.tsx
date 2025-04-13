import { Suspense } from "react"
import WorkerDashboard from "@/components/worker-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Worker ID Management</h1>
          <ThemeSwitcher />
        </div>
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
