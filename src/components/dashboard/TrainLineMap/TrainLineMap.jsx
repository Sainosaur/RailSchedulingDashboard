import { useMemo } from 'react'
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react'
import { STATIONS, SEGMENTS } from '@/data/railData'
import StationNode from './StationNode'
import TrackEdge from './TrackEdge'
import PanelShell from '@/components/layout/PanelShell'

const nodeTypes = { stationNode: StationNode }
const edgeTypes = { trackEdge: TrackEdge }

export default function TrainLineMap() {
  const nodes = useMemo(() =>
    STATIONS.map((s) => ({
      id: s.id,
      type: 'stationNode',
      position: { x: s.x, y: s.y },
      data: { label: s.label, status: s.status, name: s.name },
      draggable: false,
    })),
  [])

  const edges = useMemo(() =>
    SEGMENTS.map((seg) => ({
      id: seg.id,
      source: seg.source,
      target: seg.target,
      type: 'trackEdge',
      data: { active: seg.active },
    })),
  [])

  const lineLabel = (
    <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--dash-text)] uppercase tracking-widest">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-px bg-[var(--dash-orange)]" />
        Active
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-px border-t border-dashed border-[var(--dash-border-bright)]" />
        Inactive
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--dash-red)]" />
        Alert
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--dash-orange)]" />
        Warning
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--dash-green)]" />
        Normal
      </span>
    </div>
  )

  return (
    <PanelShell title="Line" badge="H01 → H06" actions={lineLabel} className="w-full h-full">
      <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        style={{ background: 'transparent' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e2330"
        />
      </ReactFlow>
      </div>
    </PanelShell>
  )
}
