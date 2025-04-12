"use client"

import { useEffect, useState } from "react"
import type { Worker } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface WorkerReportProps {
  worker: Worker
}

interface ReportData {
  headers: string[]
  rows: string[][]
}

export function WorkerReport({ worker }: WorkerReportProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(worker.reportUrl)
        const xmlText = await response.text()

        // Parse XML
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlText, "text/xml")

        // Extract headers
        const headerElements = xmlDoc.getElementsByTagName("header")
        const headers = Array.from(headerElements).map((el) => el.textContent || "")

        // Extract rows
        const rowElements = xmlDoc.getElementsByTagName("row")
        const rows = Array.from(rowElements).map((rowEl) => {
          const cells = rowEl.getElementsByTagName("cell")
          return Array.from(cells).map((cell) => cell.textContent || "")
        })

        setReportData({ headers, rows })
      } catch (error) {
        console.error("Error fetching worker report:", error)
        setError("Failed to load worker report.")
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [worker.reportUrl])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!reportData || reportData.headers.length === 0) {
    return <div className="text-center text-muted-foreground">No report data available.</div>
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {reportData.headers.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportData.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
