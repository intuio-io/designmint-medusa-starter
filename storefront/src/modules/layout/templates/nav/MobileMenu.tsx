"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

interface MobileMenuProps {
  categories: { id: string; name: string }[]
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="sm:hidden p-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-64 h-screen bg-white shadow-md z-50 p-4 flex flex-col gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/store/?categoryId=${category.id}`}
              className="text-gray-800 hover:underline"
              onClick={() => setOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
