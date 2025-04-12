"use client"

import { useEffect, useState } from "react"
import type { Worker } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkerDetailsProps {
  worker: Worker
}

export function WorkerDetails({ worker }: WorkerDetailsProps) {
  const [details, setDetails] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(worker.detailsUrl)
        const text = await response.text()
        setDetails(text)
      } catch (error) {
        console.error("Error fetching worker details:", error)
        setDetails("Failed to load worker details.")
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [worker.detailsUrl])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  // Format the details text with line breaks
  const formattedDetails = details.split("\n").map((line, index) => (
    <p key={index} className="py-1">
      {line || <br />}
    </p>
  ))

  return (
    <div className="rounded-lg border p-4">
      <div className="prose prose-sm max-w-none">{formattedDetails}</div>
    </div>
  )
}
