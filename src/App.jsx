import { useState, useEffect } from "react";
import "./App.css";
import {
  INITIAL_KILL_SWITCH,
  RECOMMENDATIONS,
  PERMISSIONS,
  LOGS,
} from "@/data/railData";

import {
  killServer,
  restoreServer,
  getKillStatus,
} from "@/services/killSwitch";
import TrainLineMap from "@/components/dashboard/TrainLineMap/TrainLineMap";
import KillSwitchPanel from "@/components/dashboard/KillSwitchPanel/KillSwitchPanel";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel/RecommendationsPanel";
import ApprovalsPanel from "@/components/dashboard/ApprovalsPanel/ApprovalsPanel";
import TimetablePanel from "@/components/dashboard/TimetablePanel/TimetablePanel";
import SimulationControlPanel from "@/components/dashboard/SimulationControlPanel/SimulationControlPanel";

const simSocket = new WebSocket("ws://localhost:8000/ws/sim");

export default function App() {
  const [killState, setKillState] = useState(INITIAL_KILL_SWITCH);
  const [logs, setLogs] = useState(LOGS);
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);
  const [trains, setTrains] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [punctuality, setPunctuality] = useState(null);
  const [leadState, setLeadState] = useState({ stalled: false, held: false });

  useEffect(() => {
    simSocket.onopen = () => console.log("Backend connected (Simulation)");

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sim_update") {
        setTrains([data.lead, data.ai]);
        setTimetable(data.timetable);
        setPunctuality(data.punctuality);
        setLeadState({ stalled: data.lead.stalled, held: data.lead.held });
      }
    };
    
    simSocket.addEventListener("message", handleMessage);

    getKillStatus().then((status) => {
      setKillState(status);
    });

    return () => simSocket.removeEventListener("message", handleMessage);
  }, []);

  const handleKill = () => {
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    killServer()
      .then(() => {
        setKillState((prev) => ({
          ...prev,
          killed: true,
        }));
        setLogs((prev) => [
          ...prev,
          {
            id: `L-${Date.now()}`,
            timestamp: ts,
            level: "ERROR",
            source: "SYS",
            message: "Kill switch activated — all services halted",
          },
        ]);
      })
      .catch(() => {
        setLogs([
          {
            id: `L-${Date.now()}`,
            timestamp: ts,
            level: "ERROR",
            source: "SYS",
            message: "Catostrophic Connection Failure!",
          },
        ]);
      });
  };

  function handleRestore() {
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    restoreServer()
      .then(() => {
        setKillState((prev) => ({
          ...prev,
          killed: false,
        }));
        setLogs((prev) => [
          ...prev,
          {
            id: `L-${Date.now()}`,
            timestamp: ts,
            level: "INFO",
            source: "SYS",
            message: "Service restored by operator",
          },
        ]);
      })
      .catch(() => {
        setLogs([
          {
            id: `L-${Date.now()}`,
            timestamp: ts,
            level: "ERROR",
            source: "SYS",
            message: "Catostrophic Connection Failure!",
          },
        ]);
      });
  }

  function handleReasonChange(reason) {
    setKillState((prev) => ({ ...prev, reason }));
  }

  function handleApprove(id) {
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    const rec = recommendations.find((r) => r.id === id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "applied" } : r)),
    );
    setLogs((prev) => [
      ...prev,
      {
        id: `L-${Date.now()}`,
        timestamp: ts,
        level: "INFO",
        source: rec?.station ?? "SYS",
        message: `${id} approved — ${rec?.type ?? "action"} applied`,
      },
    ]);
  }

  function handleDeny(id) {
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    const rec = recommendations.find((r) => r.id === id);
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "denied" } : r)),
    );
    setLogs((prev) => [
      ...prev,
      {
        id: `L-${Date.now()}`,
        timestamp: ts,
        level: "WARN",
        source: rec?.station ?? "SYS",
        message: `${id} denied — ${rec?.type ?? "action"} not applied`,
      },
    ]);
  }

  return (
    <div className="w-screen h-screen grid grid-rows-[2fr_3fr] gap-2 p-2 overflow-hidden">
      {/* Row 1: Train line map */}
      <TrainLineMap trains={trains} />

      {/* Row 2: Bottom panels organized for better space usage */}
      <div className="grid grid-cols-[280px_1fr_1fr_1fr] gap-2 min-h-0">
        
        {/* Controls Column (Stacked Vertically) */}
        <div className="grid grid-rows-[auto_1fr] gap-2 min-h-0">
          <KillSwitchPanel
            killed={killState.killed}
            reason={killState.reason}
            onKill={handleKill}
            onRestore={handleRestore}
            onReasonChange={handleReasonChange}
          />
          <SimulationControlPanel stalled={leadState.stalled} held={leadState.held} />
        </div>

        <RecommendationsPanel
          recommendations={recommendations}
          permissions={PERMISSIONS}
        />
        <ApprovalsPanel
          recommendations={recommendations}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
        <TimetablePanel timetable={timetable || undefined} punctuality={punctuality || undefined} />
      </div>
    </div>
  );
}
