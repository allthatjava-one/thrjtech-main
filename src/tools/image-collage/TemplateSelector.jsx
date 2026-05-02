import React from 'react';

function GridIcon({ rows, cols }) {
  const totalW = 40;
  const totalH = 32;
  const pad = 3;
  const gapW = cols > 1 ? 2 : 0;
  const gapH = rows > 1 ? 2 : 0;
  const cellW = ((totalW - 2 * pad) - (cols - 1) * gapW) / cols;
  const cellH = ((totalH - 2 * pad) - (rows - 1) * gapH) / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (cellW + gapW);
      const y = pad + r * (cellH + gapH);
      cells.push(<rect key={`${r}-${c}`} x={x} y={y} width={cellW} height={cellH} rx={1} />);
    }
  }
  return (
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} fill="currentColor">
      {cells}
    </svg>
  );
}

export default function TemplateSelector({ templates, selectedId, onSelect }) {
  return (
    <div className="collage-template-selector">
      {templates.map(tpl => (
        <button
          key={tpl.id}
          type="button"
          className={`template-card${selectedId === tpl.id ? ' template-card--active' : ''}`}
          onClick={() => onSelect(tpl)}
          title={tpl.name}
        >
          <GridIcon rows={tpl.rows} cols={tpl.cols} />
          <span className="template-card-name">{tpl.name}</span>
        </button>
      ))}
    </div>
  );
}
