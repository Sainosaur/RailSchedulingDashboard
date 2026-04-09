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
import LogsPanel from "@/components/dashboard/LogsPanel/LogsPanel";

export default function App() {
  const [killState, setKillState] = useState(INITIAL_KILL_SWITCH);
  const [logs, setLogs] = useState(LOGS);
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);

  useEffect(() => {
    getKillStatus().then((status) => {
      setKillState(status);
    });
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
      <TrainLineMap />

      {/* Row 2: Four bottom panels */}
      <div className="grid grid-cols-[250px_1fr_450px_450px] gap-2 min-h-0">
        <KillSwitchPanel
          killed={killState.killed}
          reason={killState.reason}
          onKill={handleKill}
          onRestore={handleRestore}
          onReasonChange={handleReasonChange}
        />
        <RecommendationsPanel
          recommendations={recommendations}
          permissions={PERMISSIONS}
        />
        <ApprovalsPanel
          recommendations={recommendations}
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
        <LogsPanel logs={logs} />
      </div>
    </div>
  );
}
