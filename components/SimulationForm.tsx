import React, { useState } from 'react';

export default function SimulationForm({ onRun }: { onRun: (profile: string, initial?: number, monthly?: number, years?: number) => void }) {
  const [initial, setInitial] = useState(100);
  const [monthly, setMonthly] = useState(25);
  const [years, setYears] = useState(10);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3">
      <div>
        <label className="text-sm">Initial ($)</label>
        <input className="w-full p-2 border rounded" type="number" value={initial} onChange={e => setInitial(Number(e.target.value))} />
      </div>
      <div>
        <label className="text-sm">Monthly ($)</label>
        <input className="w-full p-2 border rounded" type="number" value={monthly} onChange={e => setMonthly(Number(e.target.value))} />
      </div>
      <div>
        <label className="text-sm">Years</label>
        <input className="w-full p-2 border rounded" type="number" value={years} onChange={e => setYears(Number(e.target.value))} />
      </div>
      <div className="flex items-end gap-2">
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => onRun('Low Risk', initial, monthly, years)}>Low</button>
        <button className="px-3 py-2 bg-yellow-500 text-white rounded" onClick={() => onRun('Medium Risk', initial, monthly, years)}>Medium</button>
        <button className="px-3 py-2 bg-red-600 text-white rounded" onClick={() => onRun('High Risk', initial, monthly, years)}>High</button>
      </div>
    </div>
  );
}