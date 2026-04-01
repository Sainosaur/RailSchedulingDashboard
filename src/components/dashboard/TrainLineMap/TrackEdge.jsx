import { getBezierPath } from '@xyflow/react'

export default function TrackEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  const active = data?.active
  const stroke = active ? '#f97316' : '#2a3045'
  const strokeDash = active ? undefined : '6 4'
  const strokeWidth = active ? 2.5 : 1.5

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDash}
        strokeLinecap="round"
      />
    </g>
  )
}
