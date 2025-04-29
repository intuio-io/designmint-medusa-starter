import React from "react"
import { Carousel } from "@material-tailwind/react"

const Slider = ({ children }: any) => {
  return (
    <Carousel
      loop={true}
      autoplay={true}
      autoplayDelay={3500}
      className="overflow-hidden"
      navigation={() => <div></div>}
      prevArrow={() => <div></div>}
      nextArrow={() => <div></div>}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      {children}
    </Carousel>
  )
}

export default Slider
