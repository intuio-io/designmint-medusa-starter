"use client"

import React, { useEffect, useState } from "react"
import useCountDown from "./useCountDown"
import useZStore from "zustand/useZStore"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type LimitedTimeItemProps = {
  lastDate?: string
  title?: string
  desc?: string
  imgSrc?: string
  redirectUrl?: string
  buttonText?: string
  startDate?: string
}

const LimitedTimeItem = ({
  lastDate,
  title,
  desc,
  imgSrc,
  redirectUrl,
  buttonText,
  startDate,
}: LimitedTimeItemProps) => {
  const { showDate, showHour, showMinute, showSecond } = useCountDown(lastDate)
  const { colors }: any = useZStore()
  const [isStartCorrect, setIsStartCorrect] = useState(false)

  useEffect(() => {
    if (typeof startDate !== "undefined") {
      setIsStartCorrect(isTodayOrPast(startDate))
    }
  }, [startDate])

  function isTodayOrPast(dateString: string) {
    const [day, month, year] = dateString.split("-").map(Number)
    const inputDate = new Date(year, month - 1, day)
    const today = new Date()
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    return inputDate <= currentDate
  }

  if (
    !isStartCorrect ||
    (showDate === 0 && showHour === 0 && showMinute === 0 && showSecond === 0)
  ) {
    return null
  }

  return (
    <div className="bg-white px-[7%]">
      <div className="flex flex-col border-b border-gray-200 lg:border-0">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
          />
          <div className="relative bg-gray-100 lg:bg-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
              <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-24">
                <div className="lg:pr-20 flex justify-between items-center mb-[20px]">
                  <div
                    className="flex flex-col items-center"
                    data-days={isNaN(showDate) ? 0 : showDate}
                  >
                    <span className="text-4xl font-bold">
                      {isNaN(showDate) ? 0 : showDate}
                    </span>
                    <span>Days</span>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div
                    className="flex flex-col items-center"
                    data-hours={isNaN(showDate) ? 0 : showDate}
                  >
                    <span className="text-4xl font-bold">
                      {isNaN(showDate) ? 0 : showDate}
                    </span>
                    <span>Hours</span>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div
                    className="flex flex-col items-center"
                    data-minutes={isNaN(showMinute) ? 0 : showMinute}
                  >
                    <span className="text-4xl font-bold">
                      {isNaN(showMinute) ? 0 : showMinute}
                    </span>
                    <span>Minutes</span>
                  </div>
                  <div className="text-2xl font-bold">:</div>
                  <div
                    className="flex flex-col items-center"
                    data-seconds={isNaN(showSecond) ? 0 : showSecond}
                  >
                    <span className="text-4xl font-bold">
                      {isNaN(showSecond) ? 0 : showSecond}
                    </span>
                    <span>Seconds</span>
                  </div>
                </div>
                <div className="lg:pr-16">
                  <h1
                    className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl"
                    data-title={title}
                  >
                    {title}
                  </h1>
                  <p
                    className="mt-4 text-xl text-gray-600"
                    data-description={desc}
                  >
                    {desc}
                  </p>
                  <div className="mt-6">
                    <LocalizedClientLink href={`${redirectUrl}`}>
                      <div
                        style={{
                          background: colors?.primaryColor,
                          cursor: "pointer",
                        }}
                        className="inline-block rounded-md border border-transparent px-8 py-3 font-medium text-white"
                        data-button-text={buttonText}
                        data-button-href={redirectUrl}
                      >
                        {buttonText}
                      </div>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-40 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
            <img
              alt=""
              src={imgSrc}
              className="h-full w-full object-cover object-center"
              data-image1={imgSrc}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LimitedTimeItem
