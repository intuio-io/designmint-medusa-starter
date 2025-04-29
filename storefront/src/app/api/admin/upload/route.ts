// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { makeAuthenticatedRequest } from "../utils/auth"

// Helper function to handle CORS
function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return corsResponse(
    NextResponse.json({}, { status: 200 })
  )
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file) {
      return corsResponse(
        NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        )
      )
    }

    // Create new FormData for the upload
    const uploadFormData = new FormData()
    uploadFormData.append('files', file)

    // Upload the file
    const response = await makeAuthenticatedRequest(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/uploads`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return corsResponse(NextResponse.json(data))
  } catch (error: any) {
    console.error('Upload error:', error)
    return corsResponse(
      NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    )
  }
}