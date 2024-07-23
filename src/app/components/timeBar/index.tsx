import React, { useEffect, useState, useRef } from "react";

import { TimeBarProps } from "@/shared/interface";
import { convertTime } from "@/shared/common";

const TimeBar: React.FC<TimeBarProps> = ({
  startTime,
  duration,
  status,
  currentPeriodTime,
  breakTime,
}) => {
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [displayTime, setDisplayTime] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatElapsedTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleNotStarted = () => {
    setProgress(0);
    setElapsedSeconds(0);
    setDisplayTime(false);
    clearCurrentInterval();
  };

  const handleInProgress = () => {
    clearCurrentInterval();

    intervalRef.current = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      let elapsed = now - currentPeriodTime!;
      let currentTime = now - startTime;
      let newProgress = 0;
      const isHaltTime = currentTime >= 45 * 60 && currentTime < 60 * 60;

      if (currentTime >= 60 * 60) {
        elapsed += 45 * 60;
      }

      setDisplayTime(true);
      newProgress = Math.min((elapsed / (duration * 60)) * 100, 100);

      if (isHaltTime) {
        newProgress = 50;
      }

      setProgress(newProgress);
      setElapsedSeconds(elapsed);
    }, 1000);
  };

  const handleFinished = () => {
    setProgress(100);
    setElapsedSeconds(duration * 60);
    setDisplayTime(false);
    clearCurrentInterval();
  };

  const handleMatchTime = () => {
    switch (status) {
      case "not_started":
        handleNotStarted();
        break;
      case "inprogress":
        handleInProgress();
        break;
      case "finished":
        handleFinished();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleMatchTime();
    return () => clearCurrentInterval();
  }, [status, startTime, duration, currentPeriodTime]);

  useEffect(() => {
    setDisplayTime(breakTime !== "HT" && breakTime !== "FT");
    if (breakTime === "HT") {
      setProgress(50);
      clearCurrentInterval();
      return;
    }
    if (breakTime === "FT") {
      setProgress(100);
      clearCurrentInterval();
      return;
    }
    handleMatchTime();
  }, [breakTime]);

  const isActive = (position: number) => progress >= position;

  return (
    <div className="timebar-container">
      <div className="timebar-background">
        <div className="timebar-progress" style={{ width: `${progress}%` }} />
        <div className="timebar-current-time" style={{ left: `${progress}%` }}>
          {displayTime && formatElapsedTime(elapsedSeconds)}
        </div>
      </div>
      <div
        className={`timebar-marker timebar-marker-left  ${
          isActive(0) ? "active" : ""
        }`}
      >
        <div className="timebar-marker-icon"></div>
        {convertTime(startTime)}
      </div>
      <div
        className={`timebar-marker timebar-marker-middle ${
          isActive(50) ? "active" : ""
        }`}
      >
        <div className="timebar-marker-icon"></div>
        HT
      </div>
      <div
        className={`timebar-marker timebar-marker-right  ${
          isActive(100) ? "active" : ""
        }`}
      >
        <div className="timebar-marker-icon"></div>
        FT
      </div>
    </div>
  );
};

export default TimeBar;
