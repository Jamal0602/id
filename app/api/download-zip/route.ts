import { type NextRequest, NextResponse } from "next/server"
import { fetchWorkerFiles } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Fetch all files for the user
    // 2. Create a zip file using a library like JSZip
    // 3. Return the zip file as a blob

    // For this demo, we'll simulate a delay and then redirect to a dummy file
    const files = await fetchWorkerFiles(userId)

    // In a real implementation, you would create a zip file here
    // For now, we'll just redirect to the first file as a demonstration
    if (files.length > 0) {
      return NextResponse.redirect(files[0].url)
    }

    return NextResponse.json({ error: "No files found for this user" }, { status: 404 })
  } catch (error) {
    console.error("Error creating zip file:", error)
    return NextResponse.json({ error: "Failed to create zip file" }, { status: 500 })
  }
}
