"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  initialHours?: number;
  onReset?: () => void;
}

const STORAGE_KEY = "voting_start_time";
const DEFAULT_HOURS = 5;

export default function Countdown({ initialHours = DEFAULT_HOURS, onReset }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [startTime, setStartTime] = useState<number | null>(null);

  // Initialize or load start time
  useEffect(() => {
    const savedStartTime = localStorage.getItem(STORAGE_KEY);
    if (savedStartTime) {
      setStartTime(parseInt(savedStartTime, 10));
    } else {
      // Set initial start time
      const now = Date.now();
      localStorage.setItem(STORAGE_KEY, now.toString());
      setStartTime(now);
    }
  }, []);

  useEffect(() => {
    if (!startTime) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const totalSeconds = initialHours * 3600;
      const remainingSeconds = totalSeconds - Math.floor(elapsed / 1000);

      if (remainingSeconds > 0) {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime, initialHours]);

  const handleReset = () => {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    setStartTime(now);
    if (onReset) {
      onReset();
    }
  };

  const formatTime = () => {
    if (timeLeft.hours > 0) {
      const hoursStr = `${timeLeft.hours} ${timeLeft.hours === 1 ? 'oră' : 'ore'}`;
      if (timeLeft.minutes > 0) {
        return `${hoursStr} ${timeLeft.minutes} ${timeLeft.minutes === 1 ? 'minut' : 'minute'}`;
      }
      return hoursStr;
    } else if (timeLeft.minutes > 0) {
      return `${timeLeft.minutes} ${timeLeft.minutes === 1 ? 'minut' : 'minute'}`;
    } else {
      return `${timeLeft.seconds} ${timeLeft.seconds === 1 ? 'secundă' : 'secunde'}`;
    }
  };

  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      Votul se închide în: <strong>{formatTime()}</strong>
      <button
        onClick={handleReset}
        style={{
          marginLeft: 8,
          padding: "4px 12px",
          fontSize: "12px",
          background: "rgba(251, 191, 36, 0.2)",
          border: "1px solid rgba(251, 191, 36, 0.4)",
          borderRadius: 12,
          color: "#fbbf24",
          cursor: "pointer",
          fontWeight: 600,
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(251, 191, 36, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)";
        }}
        title="Resetează countdown-ul (când începe evenimentul)"
      >
        🔄 Reset
      </button>
    </span>
  );
}

