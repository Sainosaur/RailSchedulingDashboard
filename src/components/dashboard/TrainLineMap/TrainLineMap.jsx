import PanelShell from "@/components/layout/PanelShell";
import { STATIONS, SEGMENTS, TRAINS } from "@/data/railData";
import getAll from "../../../services/graph";
import { useState, useEffect } from "react";

const SIGNAL_COLOR = {
  green: "#22c55e",
  amber: "#f59e0b",
  "double-amber": "#f97316",
  red: "#ef4444",
};

function lerp(a, b, t) {
  return a + t * (b - a);
}

export default function TrainLineMap() {
  const [stations, setStations] = useState([]);
  const [stationMap, setStationsMap] = useState({});
  const [segments, setSegments] = useState([]);
  const segmentMap = Object.fromEntries(SEGMENTS.map((s) => [s.id, s]));
  useEffect(() => {
    getAll().then((data) => {
      const dataArr = Object.values(data.graph._node);
      setStationsMap(data.graph._node);
      setStations(dataArr.map((s) => s.data));
      const segmentArr = Object.values(data.graph._adj);
      setSegments(
        segmentArr
          .map((seg) => {
            const segArray = Object.values(seg);
            return segArray[0].data;
          })
          .filter((x, y) => y != 0),
      );
    });
  }, []);

  const legend = (
    <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--dash-text)] uppercase tracking-widest">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-px border-t border-dashed border-[#2a3045]" />
        Track
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-4 h-[2.5px] bg-[var(--dash-kill)]" />
        Hazard
      </span>
      {[
        { signal: "green", color: "#22c55e", label: "Green", dots: 1 },
        { signal: "amber", color: "#f59e0b", label: "Amber", dots: 1 },
        {
          signal: "double-amber",
          color: "#f97316",
          label: "Dbl Amber",
          dots: 2,
        },
        { signal: "red", color: "#ef4444", label: "Red", dots: 1 },
      ].map(({ signal, color, label, dots }) => (
        <span key={signal} className="flex items-center gap-1">
          {Array.from({ length: dots }).map((_, i) => (
            <span
              key={i}
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: color, boxShadow: `0 0 4px ${color}` }}
            />
          ))}
          <span>{label}</span>
        </span>
      ))}
    </div>
  );

  return (
    <PanelShell
      title="Line"
      badge="H01 → H06"
      actions={legend}
      className="w-full h-full"
    >
      <div style={{ width: "100%", height: "100%", padding: "12px" }}>
        <svg
          viewBox="0 0 960 190"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <filter id="sig-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track segments */}
          {segments.map((seg) => {
            const src = stationMap[seg.start_station.name];
            const tgt = stationMap[seg.end_station.name];
            if (!src || !tgt) return null;
            return (
              <line
                key={src.data.position}
                x1={src.data.distance * 12 + 20}
                y1={src.data.elevation / 10}
                x2={tgt.data.distance * 12 + 20}
                y2={tgt.data.elevation / 10}
                stroke={seg.hazard ? "#dc2626" : "#2a3045"}
                strokeWidth={seg.hazard ? 2.5 : 1.5}
                strokeDasharray={seg.hazard ? undefined : "6 4"}
                strokeLinecap="round"
              />
            );
          })}

          {/* Stations */}
          {stations.map((s) => (
            <g key={s.position}>
              <circle
                cx={s.distance * 12 + 20}
                cy={s.elevation / 10}
                r={5}
                fill="#c8d0de"
                stroke="#2a3045"
                strokeWidth={1.5}
              />
              <text
                x={s.distance * 12 + 20}
                y={s.elevation / 10 + 17}
                textAnchor="middle"
                fill="#c8d0de"
                fontSize={9}
                fontFamily="ui-monospace, Consolas, monospace"
                letterSpacing="0.1em"
                style={{ userSelect: "none" }}
              >
                {s.name}
              </text>
            </g>
          ))}

          {/* Trains */}
          {TRAINS.map((train) => {
            const seg = segmentMap[train.segment];
            if (!seg) return null;
            const src = stationMap[seg.source];
            const tgt = stationMap[seg.target];
            if (!src || !tgt) return null;

            const x = lerp(src.x, tgt.x, train.progress);
            const y = lerp(src.y, tgt.y, train.progress);
            const color = SIGNAL_COLOR[train.signal] ?? "#22c55e";
            const isDoubleAmber = train.signal === "double-amber";

            return (
              <g key={train.id} transform={`translate(${x}, ${y})`}>
                {/* Train label above track */}
                <rect
                  x={-17}
                  y={-28}
                  width={34}
                  height={13}
                  fill={color}
                  fillOpacity={0.12}
                  stroke={color}
                  strokeWidth={1}
                  rx={1}
                />
                <text
                  x={0}
                  y={-18}
                  textAnchor="middle"
                  fill={color}
                  fontSize={8}
                  fontWeight={700}
                  fontFamily="ui-monospace, Consolas, monospace"
                  letterSpacing="0.08em"
                  style={{ userSelect: "none" }}
                >
                  {train.id}
                </text>

                {/* Stem from label to signal dot */}
                <line
                  x1={0}
                  y1={-15}
                  x2={0}
                  y2={-4}
                  stroke={color}
                  strokeWidth={1}
                  strokeOpacity={0.35}
                />

                {/* Signal dot(s) ON the track */}
                {isDoubleAmber ? (
                  <>
                    <circle
                      cx={-4}
                      cy={0}
                      r={3}
                      fill={color}
                      filter="url(#sig-glow)"
                    />
                    <circle
                      cx={4}
                      cy={0}
                      r={3}
                      fill={color}
                      filter="url(#sig-glow)"
                    />
                  </>
                ) : (
                  <circle
                    cx={0}
                    cy={0}
                    r={3}
                    fill={color}
                    filter="url(#sig-glow)"
                  />
                )}

                {/* Speed below */}
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fill="#8892a4"
                  fontSize={7}
                  fontFamily="ui-monospace, Consolas, monospace"
                  letterSpacing="0.04em"
                  style={{ userSelect: "none" }}
                >
                  {train.speed} km/h
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </PanelShell>
  );
}
