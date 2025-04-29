import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="relative mx-auto mt-12 px-4 md:px-6 bg-[#2f3a53] text-white">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-y-8 py-16">
          {/* Logo / Brand */}
          <div>
            <LocalizedClientLink
              href="/"
              className="uppercase text-lg font-semibold tracking-wide"
            >
              Brandify Store
            </LocalizedClientLink>
          </div>

          {/* Navigation Blocks */}
          <div className="text-sm grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 w-full max-w-4xl">
            {/* Categories */}
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-white">Categories</span>
                <ul
                  className="flex flex-col gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li className="flex flex-col gap-1" key={c.id}>
                        <LocalizedClientLink
                          className="hover:underline text-white"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="ml-3 flex flex-col gap-1">
                            {children.map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="hover:underline text-white"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link"
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Collections */}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="font-medium text-white">Collections</span>
                <ul
                  className={clx("flex flex-col gap-2", {
                    "grid grid-cols-2": collections.length > 3,
                  })}
                >
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:underline text-white"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Brandify Links */}
            <div className="flex flex-col gap-y-2">
              <span className="font-medium text-white">Brandify</span>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Source Code
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-white/20 text-sm">
          <Text className="text-white">
            © {new Date().getFullYear()} Brandify. All rights reserved.
          </Text>
          <div className="mt-2 sm:mt-0">
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
