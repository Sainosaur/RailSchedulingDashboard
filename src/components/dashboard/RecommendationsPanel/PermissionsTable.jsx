const LEVEL_STYLE = {
  KILL:    'text-[var(--dash-kill)] border-[var(--dash-kill)]/40',
  HALT:    'text-[var(--dash-orange)] border-[var(--dash-orange)]/40',
  INSPECT: 'text-[var(--dash-amber)] border-[var(--dash-amber)]/40',
  READ:    'text-[var(--dash-text)] border-[var(--dash-border-bright)]',
}

export default function PermissionsTable({ permissions }) {
  return (
    <div className="h-full overflow-y-auto dash-scroll">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-[var(--dash-border)]">
            <th className="text-left px-3 py-2 text-[9px] uppercase tracking-widest text-[var(--dash-text)] font-semibold">Operator</th>
            <th className="text-left px-3 py-2 text-[9px] uppercase tracking-widest text-[var(--dash-text)] font-semibold hidden sm:table-cell">Role</th>
            <th className="text-left px-3 py-2 text-[9px] uppercase tracking-widest text-[var(--dash-text)] font-semibold">Level</th>
            <th className="text-center px-3 py-2 text-[9px] uppercase tracking-widest text-[var(--dash-text)] font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            <tr
              key={p.id}
              className={`border-b border-[var(--dash-border)] hover:bg-white/[0.02] transition-colors ${!p.active ? 'opacity-40' : ''}`}
            >
              <td className="px-3 py-2.5 text-[var(--dash-text-bright)]">{p.operator}</td>
              <td className="px-3 py-2.5 text-[var(--dash-text)] hidden sm:table-cell">{p.role}</td>
              <td className="px-3 py-2.5">
                <span className={`text-[9px] px-1.5 py-0.5 border uppercase tracking-wider ${LEVEL_STYLE[p.level] ?? LEVEL_STYLE.READ}`}>
                  {p.level}
                </span>
              </td>
              <td className="px-3 py-2.5 text-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${p.active ? 'bg-[var(--dash-green)]' : 'bg-[var(--dash-text)]/30'}`}
                  title={p.active ? 'Active' : 'Inactive'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
