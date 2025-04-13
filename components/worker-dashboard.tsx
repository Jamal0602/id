"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { WorkerCard } from "@/components/worker-card"
import { FolderView } from "@/components/folder-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Grid, List, Search } from "lucide-react"
import type { Worker } from "@/lib/types"
import { fetchWorkers } from "@/lib/data"
import { useSearchParams, useRouter } from "next/navigation"

export default function WorkerDashboard() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"cards" | "folders" | "list">("cards")

  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedUserId = searchParams.get("user")

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
      setFilteredWorkers(
        workers.filter(
          (worker) =>
            worker.name.toLowerCase().includes(query) ||
            worker.id.toLowerCase().includes(query) ||
            worker.position.toLowerCase().includes(query) ||
            worker.department.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, workers])

  const adminWorkers = filteredWorkers.filter((worker) => worker.isAdmin)
  const regularWorkers = filteredWorkers.filter((worker) => !worker.isAdmin)

  const selectedWorker = selectedUserId ? workers.find((worker) => worker.id === selectedUserId) : null

  if (isLoading) {
    return <div className="flex items-center justify-center p-8 text-foreground">Loading worker data...</div>
  }

  // Add a check for when there are no workers
  if (workers.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium">No workers found</h3>
        <p className="text-sm text-muted-foreground">
          There are no workers in the system. Please add workers to the public folder.
        </p>
      </div>
    )
  }

  if (selectedWorker) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span>←</span> Back to all workers
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-foreground">{selectedWorker.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{selectedWorker.position}</span>
              <span>•</span>
              <span>{selectedWorker.department}</span>
              {selectedWorker.isAdmin && (
                <>
                  <span>•</span>
                  <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                    Admin
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <FolderView worker={selectedWorker} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-md border p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("cards")}
              className={`h-8 w-8 ${viewMode === "cards" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={`h-8 w-8 ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("folders")}
              className={`h-8 w-8 ${viewMode === "folders" ? "bg-primary text-primary-foreground" : ""}`}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Workers ({filteredWorkers.length})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({adminWorkers.length})</TabsTrigger>
          <TabsTrigger value="regular">Regular ({regularWorkers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {viewMode === "cards" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Position</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Join Date</div>
                <div className="col-span-1">Status</div>
              </div>
              <div className="divide-y">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => router.push(`/?user=${worker.id}`)}
                    className="grid cursor-pointer grid-cols-12 gap-4 p-4 transition-colors hover:bg-accent"
                  >
                    <div className="col-span-4 font-medium">{worker.name}</div>
                    <div className="col-span-3">{worker.position}</div>
                    <div className="col-span-2">{worker.department}</div>
                    <div className="col-span-2">{worker.joinDate}</div>
                    <div className="col-span-1">
                      {worker.isAdmin ? (
                        <Badge variant="default" className="bg-emerald-500">
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => router.push(`/?user=${worker.id}`)}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {worker.position} • {worker.department}
                    </div>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">id.cubiz.space/user/{worker.id}</div>
                  {worker.isAdmin && (
                    <Badge variant="default" className="bg-emerald-500">
                      Admin
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="admin" className="mt-6">
          {viewMode === "cards" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adminWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Position</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Join Date</div>
                <div className="col-span-1">Status</div>
              </div>
              <div className="divide-y">
                {adminWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => router.push(`/?user=${worker.id}`)}
                    className="grid cursor-pointer grid-cols-12 gap-4 p-4 transition-colors hover:bg-accent"
                  >
                    <div className="col-span-4 font-medium">{worker.name}</div>
                    <div className="col-span-3">{worker.position}</div>
                    <div className="col-span-2">{worker.department}</div>
                    <div className="col-span-2">{worker.joinDate}</div>
                    <div className="col-span-1">
                      <Badge variant="default" className="bg-emerald-500">
                        Admin
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              {adminWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => router.push(`/?user=${worker.id}`)}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {worker.position} • {worker.department}
                    </div>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">id.cubiz.space/user/{worker.id}</div>
                  <Badge variant="default" className="bg-emerald-500">
                    Admin
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="regular" className="mt-6">
          {viewMode === "cards" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : viewMode === "list" ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-4">Name</div>
                <div className="col-span-3">Position</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Join Date</div>
                <div className="col-span-1">Status</div>
              </div>
              <div className="divide-y">
                {regularWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => router.push(`/?user=${worker.id}`)}
                    className="grid cursor-pointer grid-cols-12 gap-4 p-4 transition-colors hover:bg-accent"
                  >
                    <div className="col-span-4 font-medium">{worker.name}</div>
                    <div className="col-span-3">{worker.position}</div>
                    <div className="col-span-2">{worker.department}</div>
                    <div className="col-span-2">{worker.joinDate}</div>
                    <div className="col-span-1">
                      <Badge variant="outline">Regular</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              {regularWorkers.map((worker) => (
                <div
                  key={worker.id}
                  onClick={() => router.push(`/?user=${worker.id}`)}
                  className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {worker.position} • {worker.department}
                    </div>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">id.cubiz.space/user/{worker.id}</div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
