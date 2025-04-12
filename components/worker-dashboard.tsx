"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { WorkerCard } from "@/components/worker-card"
import type { Worker } from "@/lib/types"
import { fetchWorkers } from "@/lib/data"

export default function WorkerDashboard() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getWorkers = async () => {
      try {
        const data = await fetchWorkers()
        setWorkers(data)
        setFilteredWorkers(data)
      } catch (error) {
        console.error("Failed to fetch workers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getWorkers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorkers(workers)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredWorkers(workers.filter((worker) => worker.name.toLowerCase().includes(query)))
    }
  }, [searchQuery, workers])

  const adminWorkers = filteredWorkers.filter((worker) => worker.isAdmin)
  const regularWorkers = filteredWorkers.filter((worker) => !worker.isAdmin)

  if (isLoading) {
    return <div>Loading worker data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search workers..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="text-sm text-muted-foreground">
          {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Workers ({filteredWorkers.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({adminWorkers.length})</TabsTrigger>
          <TabsTrigger value="regular">Regular ({regularWorkers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="admin" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adminWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="regular" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
