import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import HeroCarousel from "./hero-carousel"
import fetchClient from "@lib/util/fetchClient"

const Hero = ({ collections }: any) => {
  return <HeroCarousel heroBannerContent={collections} />
}

export default Hero
