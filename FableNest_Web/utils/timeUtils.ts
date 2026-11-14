// utils/timeUtils.ts
export interface TimeDifference {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeDifference = (
  startTime: string | Date,
  endTime: string | Date
): TimeDifference => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMs = Math.abs(end.getTime() - start.getTime());

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export const formatTimeDifference = (timeDiff: TimeDifference): string => {
  const parts = [];

  if (timeDiff.days > 0) {
    parts.push(`${timeDiff.days} day${timeDiff.days !== 1 ? "s" : ""}`);
  }

  if (timeDiff.hours > 0) {
    parts.push(`${timeDiff.hours} hour${timeDiff.hours !== 1 ? "s" : ""}`);
  }

  if (timeDiff.minutes > 0 && timeDiff.days === 0) {
    parts.push(
      `${timeDiff.minutes} minute${timeDiff.minutes !== 1 ? "s" : ""}`
    );
  }

  if (timeDiff.seconds > 0 && timeDiff.days === 0 && timeDiff.hours === 0) {
    parts.push(
      `${timeDiff.seconds} second${timeDiff.seconds !== 1 ? "s" : ""}`
    );
  }

  return parts.length > 0 ? parts.join(" ") : "Just now";
};

export const getExpirationStatus = (
  isActive: boolean,
  startTime: string,
  endTime: string
): { status: "active" | "expired" | "pending"; timeText: string } => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (!isActive) {
    const timeSinceExpiry = calculateTimeDifference(end, now);
    return {
      status: "expired",
      timeText: `Expired ${formatTimeDifference(timeSinceExpiry)} ago`,
    };
  }

  if (now < start) {
    const timeUntilStart = calculateTimeDifference(now, start);
    return {
      status: "pending",
      timeText: `Starts in ${formatTimeDifference(timeUntilStart)}`,
    };
  }

  if (now >= start && now <= end) {
    const timeRemaining = calculateTimeDifference(now, end);
    return {
      status: "active",
      timeText: `${timeRemaining.days}d ${timeRemaining.hours}h ${timeRemaining.minutes}m left`,
    };
  }

  // Fallback for edge cases
  return {
    status: "expired",
    timeText: "Expired",
  };
};
