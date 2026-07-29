import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useSharedValue } from "react-native-reanimated";

type TimeFormat = "12" | "24";

function getCurrentTime(format: TimeFormat = "24") {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  if (Number(format) === 12) {
    hours = hours % 12 || 12;
    return `${hours}:${minutes}`;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

export function useCurrentTimeShared(timeFormat: TimeFormat) {
  const [currentTime, setCurrentTime] = useState(() =>
    getCurrentTime(timeFormat),
  );

  useEffect(() => {
    const update = () => {
      setCurrentTime(getCurrentTime(timeFormat));
    };

    update();

    const interval = setInterval(update, 60_000);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        update();
      }
    });

    return () => {
      clearInterval(interval);

      subscription.remove();
    };
  }, [timeFormat]);

  return currentTime;
}

function getShortDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function useCurrentDateShared() {
  const currentDate = useSharedValue(getShortDate());

  useEffect(() => {
    const update = () => {
      const date = getShortDate();
      console.log("new date:", date);
      currentDate.value = date;
    };

    update();

    const interval = setInterval(update, 60_000);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        update();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  return currentDate;
}
