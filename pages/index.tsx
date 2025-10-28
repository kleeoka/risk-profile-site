import { useState } from 'react';
import AssessmentForm from '../components/AssessmentForm';
import SimulationChart from '../components/SimulationChart';

export default function Home() {
  const [risk, setRisk] = useState<'Low' | 'Medium' | 'High' | null>(null);

  // Sample simulated investment data
  const simulationData = [
    { year: 1, value: 100 },
    { year: 2, value: risk === 'High' ? 130 : risk === 'Medium' ? 115 : 105 },
    { year: 3, value: risk === 'High' ? 160 : risk === 'Medium' ? 130 : 110 },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">SmartStart Investment Assessment</h1>
      {!risk ? (
        <AssessmentForm onSubmit={setRisk} />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Your Risk Profile: {risk}</h2>
          <SimulationChart data={simulationData} />
        </>
      )}
    </div>
  );
}
