"use client"

import React from "react"
import LimitedTimeItem from "./LimitedTimeItem"
import { Carousel } from "@material-tailwind/react"

const LimitedTimeCarousel = ({ limitedTimeContent }: any) => {
  return (
    <div data-component="limited_time_banner">
      {limitedTimeContent.length > 1 ? (
        <Carousel
          loop={true}
          autoplay={true}
          navigation={() => <div></div>}
          prevArrow={() => <div></div>}
          nextArrow={() => <div></div>}
        >
          {limitedTimeContent.map((content: any, index: number) => (
            <LimitedTimeItem
              key={index}
              lastDate={`${content?.metadata.end_date} 24:00:00`}
              title={content?.metadata.title}
              desc={content?.metadata.description}
              imgSrc={content?.metadata.image1}
              redirectUrl={content?.metadata.button_href}
              buttonText={content?.metadata.button_text}
              startDate={`${content?.metadata.start_date}`}
            />
          ))}
        </Carousel>
      ) : (
        <LimitedTimeItem
          lastDate={`${limitedTimeContent[0]?.metadata.end_date} 24:00:00`}
          title={limitedTimeContent[0]?.metadata.title}
          desc={limitedTimeContent[0]?.metadata.description}
          imgSrc={limitedTimeContent[0]?.metadata.image1}
          redirectUrl={limitedTimeContent[0]?.metadata.button_href}
          buttonText={limitedTimeContent[0]?.metadata.button_text}
          startDate={`${limitedTimeContent[0]?.metadata.start_date}`}
        />
      )}
    </div>
  )
}

export default LimitedTimeCarousel
