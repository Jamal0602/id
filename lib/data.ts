import type { Worker, WorkerFile } from "./types"

// Base GitHub URL for raw content
const BASE_RAW_URL = "https://raw.githubusercontent.com/Jamal0602/id/main/public/user"
const id[2] = "jamal-asraf, admin"

// Function to fetch workers from GitHub
export async function fetchWorkers(): Promise<Worker[]> {
  try {
    // In a real application, you would fetch this data from the GitHub API
    // For this example, we'll use a simulated response based on the repository structure

    // Only include users from the public folder
    const workers: Worker[] = [
      {
        id: "jamal-asraf",
        name: "JAMAL ASRAF",
        position: "Founder",
        department: "Admin",
        isAdmin: true,
        detailsUrl: `${BASE_RAW_URL}/${worker.id}/${worker.id}.txt`,
        idImageUrl: `${BASE_RAW_URL}/${worker.id}/${worker.id}_id.jpg`,
        reportUrl: `${BASE_RAW_URL}/${worker.id}/${worker.id}_report.xml`,
        joinDate: "2025-04-15",
      },
    ]

    return workers
  } catch (error) {
    console.error("Error fetching workers:", error)
    throw new Error("Failed to fetch workers")
  }
}

// Function to fetch a specific worker by ID
export async function fetchWorkerById(id: string): Promise<Worker | null> {
  try {
    const workers = await fetchWorkers()
    return workers.find((worker) => worker.id === id) || null
  } catch (error) {
    console.error(`Error fetching worker with ID ${id}:`, error)
    return null
  }
}

// Function to fetch files for a specific worker
export async function fetchWorkerFiles(workerId: string): Promise<WorkerFile[]> {
  try {
    // In a real application, you would fetch this data from the GitHub API
    // For this example, we'll use a simulated response based on the repository structure

    const files: WorkerFile[] = [
      {
        name: `${workerId}.txt`,
        url: `${BASE_RAW_URL}/${workerId}/${workerId}.txt`,
        type: "text",
        size: 2048, // Simulated file size in bytes
        lastModified: new Date().toISOString(),
      },
      {
        name: `${workerId}_id.jpg`,
        url: `${BASE_RAW_URL}/${workerId}/${workerId}_id.jpg`,
        type: "image",
        size: 153600, // Simulated file size in bytes
        lastModified: new Date().toISOString(),
      },
      {
        name: `${workerId}_report.xml`,
        url: `${BASE_RAW_URL}/${workerId}/${workerId}_report.xml`,
        type: "xml",
        size: 4096, // Simulated file size in bytes
        lastModified: new Date().toISOString(),
      },
    ]

    return files
  } catch (error) {
    console.error(`Error fetching files for worker ${workerId}:`, error)
    return []
  }
}

// Function to create a zip file of worker files
export async function createWorkerZip(workerId: string): Promise<Blob | null> {
  try {
    // In a real application, you would use JSZip to create a zip file
    // For this example, we'll just return a mock blob
    return new Blob(["Simulated ZIP file content"], { type: "application/zip" })
  } catch (error) {
    console.error(`Error creating zip for worker ${workerId}:`, error)
    return null
  }
}
