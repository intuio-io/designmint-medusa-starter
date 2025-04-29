import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import Categories from "@modules/home/components/categories"
import LimitedTimeCarousel from "@modules/home/components/limited-time/LimitedTimeCarousel"
import SocialMediaFeed from "@modules/home/components/SocialMediaFeed/SocialMediaFeed"
import FeaturedPro from "@modules/home/components/Featured"
import DiscountBlock from "@modules/home/components/discount"
import RecentlyViewed from "@modules/products/components/recently-viewed"
import SubscriptionForm from "@modules/home/components/subscription"
import Info from "@modules/home/components/info"

export const metadata: Metadata = {
  title: "Brandify",
  description: "Customise all your printing needs.",
  openGraph: {
    images: [
      {
        url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1744085618/bd_qvco7u.png", // Path to your image
        width: 1200,
        height: 630,
        alt: "Brandify Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://res.cloudinary.com/dqhzef5yz/image/upload/v1744085618/bd_qvco7u.png",
    ],
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title,metadata",
  })

  if (!collections || !region) {
    return null
  }

  const filteredLTItems = collections.filter(
    (item: any) =>
      item.handle.includes("home_page-limited_time_banner") &&
      item.metadata?.active === true
  )

  const filteredDBItems = collections.filter(
    (item: any) =>
      item.handle.includes("home_page-discount_banner") &&
      item.metadata?.active === true
  )

  return (
    <>
      <Hero collections={collections} />
      <Categories />
      <RecentlyViewed />
      {filteredLTItems.length > 0 && (
        <LimitedTimeCarousel limitedTimeContent={filteredLTItems} />
      )}
      <FeaturedPro region={region} />
      <SocialMediaFeed />
      {/* <DiscountBlock disocuntConetent={filteredDBItems} /> */}
      <SubscriptionForm />
      <Info />
    </>
  )
}
