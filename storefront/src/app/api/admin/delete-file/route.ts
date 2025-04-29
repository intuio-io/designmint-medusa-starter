import { NextRequest, NextResponse } from "next/server"
import { makeAuthenticatedRequest } from "../utils/auth"

export async function DELETE(req: NextRequest) {
  try {
    const { file_key } = await req.json()

    if (!file_key) {
      return NextResponse.json(
        { error: "No file key provided" },
        { status: 400 }
      )
    }

    const response = await makeAuthenticatedRequest(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/uploads/${file_key}`,
        {
          method: 'DELETE',
          headers: {
             'Content-Type': 'application/json'
          }
        }
      )
  
      if (!response.ok) {
        throw new Error('Delete failed')
      }
  
      const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}