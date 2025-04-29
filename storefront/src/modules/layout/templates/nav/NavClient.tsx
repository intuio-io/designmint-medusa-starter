import {
  HeartIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { Suspense } from "react"
import { HelpCircle } from "lucide-react"
import MobileMenu from "@modules/layout/templates/nav/MobileMenu"

interface NavClientProps {
  customer: any
  initialCategories: any[]
  initialCollections: any[]
  initialBanner: string
}

export default function NavClient({
  customer,
  initialCategories,
  initialCollections,
  initialBanner,
}: NavClientProps) {
  return (
    <div className="sticky top-0 inset-x-0 z-30 group">
      <header className="sticky top-0 w-full z-50 bg-white shadow">
        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            {/* Top bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
              {/* Mobile Menu (hamburger) + Logo + Icons - all in one row on mobile */}
              <div className="flex items-center justify-between w-full md:w-auto">
                {/* Hamburger menu - only on mobile */}
                <div className="md:hidden">
                  <MobileMenu categories={initialCategories} />
                </div>

                {/* Logo */}
                <a
                  href={process.env.NEXT_PUBLIC_BASE_URL}
                  className="mx-4 md:mx-0"
                >
                  <Image
                    priority
                    alt="Logo"
                    src={`${process.env.NEXT_PUBLIC_LOGO}`}
                    width={152}
                    height={92}
                    className="h-16 w-auto"
                  />
                </a>

                {/* Right icons - only on mobile */}
                <div className="flex items-center gap-4 md:hidden">
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base"
                    href="/account"
                  >
                    <UserIcon className="h-6 w-6" />
                  </LocalizedClientLink>
                  <Suspense fallback={<div>...</div>}>
                    <CartButton />
                  </Suspense>
                </div>
              </div>

              {/* Center: Search bar - full width on mobile */}
              <div className="w-full md:flex-1 min-w-[200px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px]">
                <form className="w-full">
                  <label className="sr-only">Search</label>
                  <div className="relative">
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg"
                      placeholder="Search"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Desktop-only icons */}
              <div className="hidden md:flex flex-wrap items-center gap-4 justify-end text-sm text-gray-700">
                {/* Help */}
                <LocalizedClientLink
                  className="flex items-center gap-x-2 hover:text-ui-fg-base"
                  href="/account"
                >
                  <HelpCircle className="h-6 w-6" />
                  <div className="hidden sm:flex flex-col">
                    <span>Help is here</span>
                    <span className="text-sm text-gray-500">9876543210</span>
                  </div>
                </LocalizedClientLink>

                {/* Account */}
                <LocalizedClientLink
                  className="flex items-center gap-x-2 hover:text-ui-fg-base"
                  href="/account"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden sm:inline">
                    {customer ? "My Account" : "Sign In"}
                  </span>
                </LocalizedClientLink>

                {/* Wishlist */}
                <LocalizedClientLink
                  className="flex items-center gap-x-2 hover:text-ui-fg-base"
                  href="/wishlist"
                >
                  <HeartIcon className="h-6 w-6" />
                  <span className="hidden sm:inline">My Favourites</span>
                </LocalizedClientLink>

                {/* Cart */}
                <Suspense fallback={<div>Loading Cart...</div>}>
                  <div className="flex items-center gap-x-2">
                    <CartButton />
                    <span className="hidden sm:inline">Cart</span>
                  </div>
                </Suspense>
              </div>
            </div>

            {/* Categories - visible only on desktop */}
            <div className="py-2 overflow-x-auto hidden md:block">
              <div className="flex space-x-4 min-w-fit">
                {initialCategories.map((category) => (
                  <a
                    key={category.name}
                    href={`/store/?categoryId=${category.id}`}
                    className="max-w-[80px] relative z-10 -mb-px flex text-center items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-500 transition-colors duration-200 ease-out hover:text-gray-800"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
