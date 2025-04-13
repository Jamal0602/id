"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileIcon, FolderIcon, Download, Copy, Check, Archive, FileText, FileImage, FileCode } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatFileSize } from "@/lib/utils"
import Image from "next/image"
import type { Worker, WorkerFile } from "@/lib/types"
import { fetchWorkerFiles } from "@/lib/data"
import { WorkerDetails } from "@/components/worker-details"
import { WorkerReport } from "@/components/worker-report"

interface FolderViewProps {
  worker: Worker
}

export function FolderView({ worker }: FolderViewProps) {
  const [files, setFiles] = useState<WorkerFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<WorkerFile | null>(null)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const getFiles = async () => {
      try {
        const workerFiles = await fetchWorkerFiles(worker.id)
        setFiles(workerFiles)
        if (workerFiles.length > 0) {
          setSelectedFile(workerFiles[0])
        }
      } catch (error) {
        console.error("Failed to fetch worker files:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getFiles()
  }, [worker.id])

  const handleCopyLink = () => {
    const linkPath = selectedFile
      ? `https://id.cubiz.space/user/${worker.id}/${selectedFile.name}`
      : `https://id.cubiz.space/user/${worker.id}`

    navigator.clipboard.writeText(linkPath)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (file: WorkerFile) => {
    try {
      // Create a temporary link element
      const a = document.createElement("a")

      // For local files, we need to fetch them first
      if (file.url.startsWith("http")) {
        a.href = file.url
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        // For files that might need CORS handling
        fetch(file.url)
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob)
            a.href = url
            a.download = file.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          })
          .catch((error) => {
            console.error("Error downloading file:", error)
            // Fallback to direct download
            a.href = file.url
            a.download = file.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          })
      }
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true)

      // In a real application, you would use JSZip to create a zip file
      // For this demo, we'll simulate the download with a delay
      setTimeout(() => {
        const zipFilename = `${worker.id}_files.zip`

        // Create a temporary link to download the zip
        const a = document.createElement("a")
        a.href = `/api/download-zip?userId=${worker.id}`
        a.download = zipFilename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        setIsDownloading(false)
      }, 1500)
    } catch (error) {
      console.error("Error creating zip file:", error)
      setIsDownloading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return <FileImage className="h-5 w-5 text-blue-500" />
      case "text":
        return <FileText className="h-5 w-5 text-green-500" />
      case "xml":
        return <FileCode className="h-5 w-5 text-orange-500" />
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const renderFilePreview = () => {
    if (!selectedFile) return null

    switch (selectedFile.type) {
      case "image":
        return (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={selectedFile.url || "/placeholder.svg"}
              alt={selectedFile.name}
              fill
              className="object-contain"
            />
          </div>
        )
      case "text":
        if (selectedFile.name.endsWith(".txt")) {
          return <WorkerDetails worker={worker} />
        }
        return <div className="text-sm">Text preview not available</div>
      case "xml":
        return <WorkerReport worker={worker} />
      default:
        return <div className="text-sm">Preview not available for this file type</div>
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8 text-foreground">Loading files...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Files
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
              className="flex items-center gap-1"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <span className="flex items-center gap-1">
                  <Archive className="h-4 w-4 animate-pulse" />
                  <span>Preparing...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Archive className="h-4 w-4" />
                  <span>Download All</span>
                </span>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            {files.length} file{files.length !== 1 ? "s" : ""} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className={`flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-accent ${
                  selectedFile?.name === file.name ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <div>
                    <span className="text-sm font-medium">{file.name}</span>
                    {file.size && <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(file)
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {selectedFile ? (
              <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-muted-foreground">id.cubiz.space/user/{worker.id}/</span>
                <span>{selectedFile.name}</span>
              </div>
            ) : (
              "File Preview"
            )}
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex items-center gap-1">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>Copy Link</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy link to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(selectedFile)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {selectedFile
              ? `${selectedFile.type.charAt(0).toUpperCase() + selectedFile.type.slice(1)} file`
              : "Select a file to preview"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedFile ? (
            renderFilePreview()
          ) : (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FolderIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No file selected</h3>
              <p className="text-sm text-muted-foreground">Select a file from the list to preview its contents</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
