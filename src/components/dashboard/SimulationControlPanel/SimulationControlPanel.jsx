import { useState, useEffect, useRef } from "react";
import PanelShell from "@/components/layout/PanelShell";

export default function SimulationControlPanel({
  onStart,
  onStop,
}) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  // Elapsed‑time counter
  useEffect(() => {
    if (running) {
      const start = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 250);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function handleToggle() {
    if (running) {
      setRunning(false);
      setElapsed(0);
      onStop?.();
    } else {
      setRunning(true);
      setElapsed(0);
      onStart?.();
    }
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const statusBadge = (
    <span
      className={`text-[10px] font-mono px-1.5 py-0.5 border ${
        running
          ? "text-[var(--dash-green)] border-[var(--dash-green)]/40 bg-[var(--dash-green)]/10"
          : "text-[var(--dash-text)] border-[var(--dash-border-bright)] bg-white/5"
      }`}
    >
      {running ? "LIVE" : "IDLE"}
    </span>
  );

  return (
    <PanelShell title="Simulation" badge="AI" actions={statusBadge} className="h-full">
      <div className="flex flex-col gap-3 p-3 h-full">
        {/* Elapsed timer */}
        <div className="flex items-center justify-between px-3 py-2 border border-[var(--dash-border)] bg-[var(--dash-bg)]">
          <span className="text-[10px] font-mono text-[var(--dash-text)] uppercase tracking-widest">
            Elapsed
          </span>
          <span
            className={`text-sm font-mono tabular-nums tracking-wider ${
              running ? "text-[var(--dash-green)]" : "text-[var(--dash-text)]"
            }`}
          >
            {mm}:{ss}
          </span>
        </div>

        {/* Pulse indicator */}
        <div className="flex items-center gap-2 px-3 py-2 border border-[var(--dash-border)] bg-[var(--dash-bg)]">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              running
                ? "bg-[var(--dash-green)] animate-pulse shadow-[0_0_6px_var(--dash-green)]"
                : "bg-[var(--dash-border-bright)]"
            }`}
          />
          <span className="text-[10px] font-mono text-[var(--dash-text)] uppercase tracking-widest">
            {running ? "Simulation active" : "Awaiting start"}
          </span>
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Primary action */}
        <button
          id="sim-toggle-btn"
          onClick={handleToggle}
          className={`w-full py-3 px-4 border-2 font-bold tracking-[0.15em] uppercase text-sm font-mono transition-all duration-200 active:scale-[0.97] cursor-pointer ${
            running
              ? "border-[var(--dash-kill)] bg-[var(--dash-kill)]/10 text-[var(--dash-kill)] hover:bg-[var(--dash-kill)]/20 hover:shadow-[0_0_20px_var(--dash-kill-glow)]"
              : "border-[var(--dash-green)] bg-[var(--dash-green)]/10 text-[var(--dash-green)] hover:bg-[var(--dash-green)]/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]"
          }`}
        >
          {running ? "Stop Simulation" : "Start Simulation"}
        </button>
      </div>
    </PanelShell>
  );
}
