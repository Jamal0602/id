"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  BadgeIcon as IdCard,
  ClipboardList,
  ExternalLink,
  FolderOpen,
  Copy,
  Check,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Worker } from "@/lib/types"
import { WorkerDetails } from "@/components/worker-details"
import { WorkerReport } from "@/components/worker-report"

interface WorkerCardProps {
  worker: Worker
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleShare = () => {
    // Copy the URL to the clipboard
    copyToClipboard(`id.cubiz.space/user/${worker.id}`)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`https://${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (type: "details" | "id" | "report") => {
    let filename = ""
    let url = ""

    switch (type) {
      case "details":
        filename = `${worker.id}.txt`
        url = worker.detailsUrl
        break
      case "id":
        filename = `${worker.id}_id.jpg`
        url = worker.idImageUrl
        break
      case "report":
        filename = `${worker.id}_report.xml`
        url = worker.reportUrl
        break
    }

    try {
      // Create a temporary link element
      const a = document.createElement("a")

      // For local files, we need to fetch them first
      if (url.startsWith("http")) {
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        // For files that might need CORS handling
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob)
            a.href = blobUrl
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(blobUrl)
          })
          .catch((error) => {
            console.error("Error downloading file:", error)
            // Fallback to direct download
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          })
      }
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{worker.name}</CardTitle>
            <CardDescription className="mt-1">{worker.position}</CardDescription>
          </div>
          {worker.isAdmin && (
            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
              Admin
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <CardDescription>ID: {worker.id}</CardDescription>
          <CardDescription>{worker.department}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={worker.idImageUrl || "/placeholder.svg?height=300&width=600"}
            alt={`${worker.name}'s ID Card`}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{worker.name}</span>
                  {worker.isAdmin && (
                    <Badge variant="default" className="bg-emerald-500">
                      Admin
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="id" className="flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    <span>ID Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span>Report</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <WorkerDetails worker={worker} />
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("details")}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Details
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="id" className="mt-4">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={worker.idImageUrl || "/placeholder.svg?height=300&width=600"}
                      alt={`${worker.name}'s ID Card`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("id")}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download ID Card
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="report" className="mt-4">
                  <WorkerReport worker={worker} />
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload("report")}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <a
                    href={`https://id.cubiz.space/user/${worker.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    id.cubiz.space/user/{worker.id}
                  </a>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => router.push(`/?user=${worker.id}`)}
            className="flex items-center gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Open Folder</span>
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}
