export const INCIDENT_TYPE = {
  GOAL: "goal",
  CARD: "card",
  PENALTY_SHOOTOUT: "penaltyShootout",
  VAR_DECISION: "varDecision",
  SUBSTITUTION: "substitution",
  PERIOD: "period", // Giai đoạn
  INJURY_TIME: "injuryTime",
  INGAMEPENALTY: "inGamePenalty",
  CORNER: "corner",
};

export const GOAL_INCIDENT_CLASS = {
  OWNGOAL: "ownGoal",
  PENALTY: "penalty",
  REGULAR: "regular",
  MISSED: "missed",
};
export const CARD_INCIDENT_CLASS = {
  YELLOW_RED: "yellowRed",
  YELLOW: "yellow",
  RED: "red",
};

export const PENALTY_SHOOTOUT_INCIDENT_CLASS = {
  SCORED: "scored",
  MISSED: "missed",
};

export const STATUS_TYPE = {
  FINISHED: "finished",
  POSTPONED: "postponed",
  INPROGRESS: "inprogress",
  NOT_STARTED: "not_started",
  CANCELLED: "cancelled",
};

export const FOOTBALL_STATUS_CODE = {
  6: "HT",
  13: "Penalties",
  14: "ET",
  15: "interrupted",
  60: "postponed",
  70: "cancelled",
  90: "cancelled",
  100: "FT",
  110: "AET",
  120: "AP",
};

export const footballStatusCodeMapping = (code: number) =>
  FOOTBALL_STATUS_CODE[code as keyof typeof FOOTBALL_STATUS_CODE] || "";

export const FOOTBALL_END_MATCH_STATUS = ["FT", "AET", "AP"];

export const convertTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
