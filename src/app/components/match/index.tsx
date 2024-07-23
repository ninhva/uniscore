"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import Image from "next/image";

import TimeLineChart from "../chart";
import TimeBar from "../timeBar";
import MatchNote from "../note";
import {
  EventProps,
  GraphPoint,
  Incident,
  MatchProps,
} from "@/shared/interface";
import {
  FOOTBALL_END_MATCH_STATUS,
  footballStatusCodeMapping,
} from "@/shared/common";

const REQUEST_TIME = 30000;

const Match = ({ id, home, away }: MatchProps) => {
  const [event, setEvent] = useState<EventProps>();
  const [labels, setLabels] = useState<number[]>([]);
  const [timeLines, setTimelines] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getTimeLineData = async (): Promise<GraphPoint[]> =>
    axios
      .get(`https://api-n1.uniscore.com/api/v1/event/${id}/graph`)
      .then((response) => response?.data?.data?.graphPoints || []);

  const getIncidentData = async (): Promise<Incident[]> =>
    axios
      .get(`https://api-n1.uniscore.com/api/v1/event/${id}/incidents`)
      .then((response) => [
        ...(response?.data?.data?.incidents || []),
        ...(response?.data?.data?.corners || []),
      ]);

  const getEventData = async (): Promise<EventProps> =>
    axios
      .get(`https://api-n1.uniscore.com/api/v1/event/${id}`)
      .then((response) => response?.data?.data?.event || {});

  const handleTimeLineData = useCallback(async () => {
    const timeLineResponse = await getTimeLineData();
    const incidentResponse = await getIncidentData();

    const incidentListTmp = incidentResponse.filter(
      (item) => item.incidentType !== "period"
    );
    const labelList = timeLineResponse.map((item) => item.minute);
    const timeLineList = timeLineResponse.map((item) => ({
      x: item.minute,
      y: item.value,
      incidents: incidentListTmp.filter(
        (incident) =>
          incident.time === item.minute && {
            x: incident.time,
            incident,
          }
      ),
    }));

    setLabels(labelList);
    setTimelines(timeLineList);
  }, [id]);

  const handleEventData = useCallback(async () => {
    const eventResponse = await getEventData();
    setEvent(eventResponse);
  }, [id]);

  useEffect(() => {
    handleEventData();
    handleTimeLineData();
    intervalRef.current = setInterval(() => {
      handleTimeLineData();
      handleEventData();
    }, REQUEST_TIME);
    return () => {
      clearCurrentInterval();
    };
  }, []);

  useEffect(() => {
    if (
      event?.status?.code &&
      FOOTBALL_END_MATCH_STATUS.includes(
        footballStatusCodeMapping(event?.status?.code)
      )
    ) {
      clearCurrentInterval();
    }
  }, [event]);

  const memoizedLabels = useMemo(() => labels, [labels]);
  const memoizedTimeLines = useMemo(() => timeLines, [timeLines]);

  return (
    <div className="highlight-score-content">
      <div className="timeline-content">
        <div className="team-content">
          <div className="home">
            <Image src={home?.logo} alt="" width={35} height={35} />
          </div>
          <div className="guest">
            <Image src={away?.logo} alt="" width={35} height={35} />
          </div>
        </div>
        <div className="chart-content">
          {event && labels?.length > 0 && timeLines?.length > 0 && (
            <TimeLineChart
              labels={memoizedLabels}
              data={memoizedTimeLines}
              breakTime={footballStatusCodeMapping(event?.status?.code)}
            />
          )}
        </div>
      </div>
      {event && (
        <div className="time-bar-wrap">
          <TimeBar
            startTime={event?.startTimestamp}
            duration={90}
            status={event?.status?.type}
            currentPeriodTime={event?.time?.currentPeriodStartTimestamp}
            breakTime={footballStatusCodeMapping(event?.status?.code)}
          />
          <MatchNote />
        </div>
      )}
    </div>
  );
};

export default Match;
