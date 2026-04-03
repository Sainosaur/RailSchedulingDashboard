export const STATIONS = [
  {
    id: "H01",
    label: "H01",
    name: "Harbour Central",
    status: "alert",
    x: 60,
    y: 0,
  },
  {
    id: "H02",
    label: "H2",
    name: "North Quay",
    status: "alert",
    x: 220,
    y: 00,
  },
  {
    id: "H03",
    label: "H03",
    name: "Riverside",
    status: "warning",
    x: 390,
    y: 0,
  },
  {
    id: "H04",
    label: "H04",
    name: "Central Exchange",
    status: "alert",
    x: 560,
    y: 0,
  },
  {
    id: "H05",
    label: "H05",
    name: "Uptown West",
    status: "normal",
    x: 720,
    y: 0,
  },
  {
    id: "H06",
    label: "H06",
    name: "Terminal South",
    status: "warning",
    x: 880,
    y: 0,
  },
];

export const SEGMENTS = [
  { id: "seg-H01-H02", source: "H01", target: "H02", hazard: false },
  { id: "seg-H02-H03", source: "H02", target: "H03", hazard: false },
  { id: "seg-H03-H04", source: "H03", target: "H04", hazard: true },
  { id: "seg-H04-H05", source: "H04", target: "H05", hazard: false },
  { id: "seg-H05-H06", source: "H05", target: "H06", hazard: false },
];

export const INITIAL_KILL_SWITCH = {
  killed: false,
  killedAt: "2026-04-01T08:14:22Z",
  killedBy: "Operator A",
  reason:
    "Unexpected signal failure on segment H03–H04. Trains halted as precaution pending inspection.",
  affectedStation: "H01",
};

export const RECOMMENDATIONS = [
  {
    id: "REC-001",
    timestamp: "2026-04-01 08:14",
    station: "H04",
    type: "HALT",
    message: "Halt inbound service. Signal anomaly detected on approach.",
    severity: "critical",
    status: "applied",
    approval: true,
  },
  {
    id: "REC-002",
    timestamp: "2026-04-01 08:11",
    station: "H03",
    type: "SLOW",
    message: "Reduce speed to 30 km/h through H03 corridor.",
    severity: "warning",
    status: "pending",
    approval: true,
  },
  {
    id: "REC-003",
    timestamp: "2026-04-01 07:58",
    station: "H06",
    type: "INSPECT",
    message: "Schedule track inspection — wear pattern exceeds threshold.",
    severity: "info",
    status: "pending",
    approval: true,
  },
  {
    id: "REC-004",
    timestamp: "2026-04-01 07:45",
    station: "H02",
    type: "NORMAL",
    message: "H02 cleared. Resume normal operations.",
    severity: "info",
    status: "applied",
  },
];

export const TRAINS = [
  {
    id: "T-09",
    segment: "seg-H01-H02",
    progress: 0.2,
    signal: "green",
    speed: 72,
  },
  {
    id: "T-11",
    segment: "seg-H02-H03",
    progress: 0.65,
    signal: "amber",
    speed: 45,
  },
  {
    id: "T-14",
    segment: "seg-H03-H04",
    progress: 0.5,
    signal: "red",
    speed: 0,
  },
  {
    id: "T-07",
    segment: "seg-H05-H06",
    progress: 0.4,
    signal: "double-amber",
    speed: 30,
  },
];

export const PERMISSIONS = [
  {
    id: "P-001",
    operator: "Operator A",
    role: "Senior Controller",
    level: "KILL",
    active: true,
  },
  {
    id: "P-002",
    operator: "Operator B",
    role: "Controller",
    level: "HALT",
    active: true,
  },
  {
    id: "P-003",
    operator: "Operator C",
    role: "Observer",
    level: "READ",
    active: true,
  },
  {
    id: "P-004",
    operator: "Operator D",
    role: "Maintenance",
    level: "INSPECT",
    active: false,
  },
];

export const LOGS = [
  {
    id: "L-001",
    timestamp: "08:14:22",
    level: "ERROR",
    source: "H03",
    message: "Signal fault — circuit loop open",
  },
  {
    id: "L-002",
    timestamp: "08:14:23",
    level: "WARN",
    source: "H04",
    message: "Train 14 emergency brake triggered",
  },
  {
    id: "L-003",
    timestamp: "08:14:25",
    level: "INFO",
    source: "SYS",
    message: "Kill switch activated by Operator A",
  },
  {
    id: "L-004",
    timestamp: "08:13:58",
    level: "WARN",
    source: "H03",
    message: "Speed sensor reading anomaly",
  },
  {
    id: "L-005",
    timestamp: "08:12:11",
    level: "INFO",
    source: "H02",
    message: "Train 11 departed H02 on schedule",
  },
  {
    id: "L-006",
    timestamp: "08:10:44",
    level: "INFO",
    source: "H01",
    message: "Train 09 arrived H01, 2 min late",
  },
  {
    id: "L-007",
    timestamp: "08:09:30",
    level: "DEBUG",
    source: "SYS",
    message: "Heartbeat OK — all nodes responding",
  },
];
