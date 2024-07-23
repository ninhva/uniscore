import { STATUS_TYPE } from "./common";

export interface MatchProps {
  id: string;
  home: { name: string; logo: string };
  away: { name: string; logo: string };
}

export interface GraphPoint {
  minute: number;
  value: number;
}

export interface Player {
  id: string;
  name: string;
}

export interface Incident {
  time: number;
  isHome: boolean;
  incidentType: string;
  incidentClass?: string;
  text?: string;
  player?: Player;
  playerIn?: Player;
  playerOut?: Player;
}

export interface TimelineData {
  x: number;
  y: number;
  incidents?: Incident[];
}

export interface TimeLineChartProps {
  labels: number[];
  data: TimelineData[];
  breakTime?: string;
}

export interface ChartItemProps {
  x: number;
  y: number;
  incidents?: Incident[];
}

export interface TimeBarProps {
  startTime: number;
  duration: number;
  status: (typeof STATUS_TYPE)[keyof typeof STATUS_TYPE];
  currentPeriodTime?: number;
  breakTime?: string;
}

export interface MatchStatusProps {
  id: string;
  description: string;
  code: number;
  type: (typeof STATUS_TYPE)[keyof typeof STATUS_TYPE];
}

export interface EventProps {
  startTimestamp: number;
  status: MatchStatusProps;
  time?: {
    currentPeriodStartTimestamp: number;
  };
}
