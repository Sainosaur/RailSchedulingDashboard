import { useState } from 'react'
import './App.css'
import { INITIAL_KILL_SWITCH, RECOMMENDATIONS, PERMISSIONS, LOGS } from '@/data/railData'
import TrainLineMap from '@/components/dashboard/TrainLineMap/TrainLineMap'
import KillSwitchPanel from '@/components/dashboard/KillSwitchPanel/KillSwitchPanel'
import RecommendationsPanel from '@/components/dashboard/RecommendationsPanel/RecommendationsPanel'
import LogsPanel from '@/components/dashboard/LogsPanel/LogsPanel'

export default function App() {
  const [killState, setKillState] = useState(INITIAL_KILL_SWITCH)
  const [logs, setLogs] = useState(LOGS)

  function handleKill() {
    const now = new Date()
    const ts = now.toTimeString().slice(0, 8)
    setKillState((prev) => ({ ...prev, killed: true, killedAt: now.toISOString() }))
    setLogs((prev) => [
      ...prev,
      {
        id: `L-${Date.now()}`,
        timestamp: ts,
        level: 'ERROR',
        source: 'SYS',
        message: 'Kill switch activated — all services halted',
      },
    ])
  }

  function handleRestore() {
    const now = new Date()
    const ts = now.toTimeString().slice(0, 8)
    setKillState((prev) => ({ ...prev, killed: false }))
    setLogs((prev) => [
      ...prev,
      {
        id: `L-${Date.now()}`,
        timestamp: ts,
        level: 'INFO',
        source: 'SYS',
        message: 'Service restored by operator',
      },
    ])
  }

  function handleReasonChange(reason) {
    setKillState((prev) => ({ ...prev, reason }))
  }

  return (
    <div className="w-screen h-screen grid grid-rows-[2fr_3fr] gap-2 p-2 overflow-hidden">
      {/* Row 1: Train line map */}
      <TrainLineMap />

      {/* Row 2: Three bottom panels */}
      <div className="grid grid-cols-[200px_1fr_220px] gap-2 min-h-0">
        <KillSwitchPanel
          killed={killState.killed}
          reason={killState.reason}
          onKill={handleKill}
          onRestore={handleRestore}
          onReasonChange={handleReasonChange}
        />
        <RecommendationsPanel
          recommendations={RECOMMENDATIONS}
          permissions={PERMISSIONS}
        />
        <LogsPanel logs={logs} />
      </div>
    </div>
  )
}
