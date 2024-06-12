import React, { useEffect, useState } from "react";

export const torontoTimeOptions = {
  timeZone: "America/Toronto",
  hour12: true,
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>{time.toLocaleString("en-US", torontoTimeOptions)}</p>
    </div>
  );
}
