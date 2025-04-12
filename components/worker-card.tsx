"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share, Download, FileText, BadgeIcon as IdCard, ClipboardList, ExternalLink } from "lucide-react"
import type { Worker } from "@/lib/types"
import { WorkerDetails } from "@/components/worker-details"
import { WorkerReport } from "@/components/worker-report"

interface WorkerCardProps {
  worker: Worker
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = `id.cubiz.space/user/${worker.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${worker.name}'s ID`,
          text: `View ${worker.name}'s worker ID`,
          url: `https://${shareUrl}`,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        copyToClipboard(shareUrl)
      }
    } else {
      copyToClipboard(shareUrl)
    }
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

    // Create a temporary link element
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{worker.name}</CardTitle>
          {worker.isAdmin && (
            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
              Admin
            </Badge>
          )}
        </div>
        <CardDescription>ID: {worker.id}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={worker.idImageUrl || "/placeholder.svg"}
            alt={`${worker.name}'s ID Card`}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
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
                    src={worker.idImageUrl || "/placeholder.svg"}
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
        <Button variant="outline" size="icon" onClick={handleShare} title={copied ? "Copied!" : "Share"}>
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
