export interface Worker {
  id: string
  name: string
  position: string
  department: string
  isAdmin: boolean
  detailsUrl: string
  idImageUrl: string
  reportUrl: string
  joinDate: string
}

export interface WorkerFile {
  name: string
  url: string
  type: "image" | "text" | "xml" | "other"
  size?: number
  lastModified?: string
}
