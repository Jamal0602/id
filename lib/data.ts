import type { Worker } from "./types"

// Base GitHub URL for raw content
const BASE_RAW_URL = "https://raw.githubusercontent.com/Jamal0602/id/main/user"

// Function to fetch workers from GitHub
export async function fetchWorkers(): Promise<Worker[]> {
  try {
    // In a real application, you would fetch this data from the GitHub API
    // For this example, we'll use a simulated response based on the repository structure

    // Simulated worker data based on the GitHub repository
    const workers: Worker[] = [
      {
        id: "jamal-asraf",
        name: "Jamal Asraf",
        isAdmin: true, // Based on roll-admin.txt
        detailsUrl: `${BASE_RAW_URL}/jamal-asraf/jamal-asraf.txt`,
        idImageUrl: `${BASE_RAW_URL}/jamal-asraf/jamal-asraf_id.jpg`,
        reportUrl: `${BASE_RAW_URL}/jamal-asraf/jamal-asraf_report.xml`,
      },
      // In a real application, you would fetch the list of directories
      // and create worker objects for each one
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
