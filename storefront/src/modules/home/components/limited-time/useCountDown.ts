"use client"

import { useEffect, useState } from "react";

function useCountDown(lastDate: any) {
    const [showDate, setDate] = useState(0);
    const [showHour, setHour] = useState(0);
    const [showMinute, setMinute] = useState(0);
    const [showSecond, setDateSecond] = useState(0);

    const provideDate = new Date(lastDate);

    const year = provideDate.getFullYear();
    const month = provideDate.getMonth();

    const date = provideDate.getDate();

    const hours = provideDate.getHours();

    const minutes = provideDate.getMinutes();

    const seconds = provideDate.getSeconds();

    const _seconds = 1000;
    const _minutes = _seconds * 60;
    const _hours = _minutes * 60;
    const _date = _hours * 24;

    const startInterval = () => {
        const timer = setInterval(() => {
            const now = new Date();
            const distance =
                new Date(year, month, date, hours, minutes, seconds).getTime() -
                now.getTime();
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            setDate(Math.floor(distance / _date));
            setMinute(Math.floor((distance % _hours) / _minutes));
            setHour(Math.floor((distance % _date) / _hours));
            setDateSecond(Math.floor((distance % _minutes) / _seconds));
        }, 1000);
    };

    useEffect(() => {
        if (lastDate !== "") {
            startInterval();
        }
    });
    return { showDate, showHour, showMinute, showSecond };
}

export default useCountDown;