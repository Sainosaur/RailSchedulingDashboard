import { Handle, Position } from '@xyflow/react'

const STATUS_DOT = {
  alert:   'bg-[var(--dash-red)]',
  normal:  'bg-[var(--dash-green)]',
  warning: 'bg-[var(--dash-orange)]',
}

export default function StationNode({ data }) {
  const dotColor = STATUS_DOT[data.status] ?? 'bg-[var(--dash-text)]'

  return (
    <div className="relative flex flex-col items-center" style={{ width: 40 }}>
      {/* Hidden handles for edge routing */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, width: 0, height: 0, minWidth: 0, minHeight: 0, border: 'none' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, width: 0, height: 0, minWidth: 0, minHeight: 0, border: 'none' }}
      />

      {/* Station circle + status dot */}
      <div className="relative">
        <div className="w-3 h-3 rounded-full bg-white border-2 border-[var(--dash-border-bright)]" />
        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${dotColor} shadow-sm`} />
      </div>

      {/* Label */}
      <span className="mt-1.5 text-[9px] font-mono text-[var(--dash-text-bright)] tracking-widest uppercase select-none whitespace-nowrap">
        {data.label}
      </span>
    </div>
  )
}
