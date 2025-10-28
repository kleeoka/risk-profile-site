import React, { useState } from 'react';
import SimulationChart from '../components/SimulationChart';
import SimulationForm from '../components/SimulationForm';
import { getQuote } from '../lib/alphaVantage';
import { simulate } from '../lib/simulate';

type Question = { prompt: string; options: string[] };

const questions: Question[] = [
  { prompt: 'What is your age range?', options: ['Under 25', '25–34', '35–44', '45–54', '55+'] },
  { prompt: 'What is your primary financial goal for investing?', options: ['Preserve money', 'Generate steady income', 'Grow wealth aggressively'] },
  { prompt: 'How long do you plan to keep your investments before needing the money?', options: ['Less than 3 years', '3–7 years', 'More than 7 years'] },
  { prompt: 'How stable is your income or employment situation?', options: ['Very stable', 'Somewhat stable', 'Unstable'] },
  { prompt: 'How much do you have saved for emergencies?', options: ['Less than 3 months', '3–6 months', 'More than 6 months'] },
  { prompt: 'If your investment dropped 20% in value this year, what would you do?', options: ['Sell immediately', 'Wait and see', 'Buy more while it’s low'] },
  { prompt: 'How comfortable are you with investments that can change in value from month to month?', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable'] },
  { prompt: 'How much experience do you have with investing?', options: ['None', 'Some', 'Moderate', 'Extensive'] },
  { prompt: 'Do you currently have significant debts (credit cards, loans, etc.)?', options: ['Yes, significant', 'Some manageable', 'None'] },
  { prompt: 'Which best describes your investing personality?', options: ['Cautious and security-focused', 'Balanced and open to some risk', 'Ambitious and growth-oriented'] },
];

export default function Home() {
  const [page, setPage] = useState<'home'|'assessment'|'results'|'simulation'|'resources'|'about'|'suggestions'>('home');
  const [answers, setAnswers] = useState<Record<number, { optionIndex: number; score: number }>>({});
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [simResult, setSimResult] = useState<any | null>(null);
  const [ticker, setTicker] = useState('VOO');
  const [quote, setQuote] = useState<any>(null);

  const scoreFor = (qIndex:number, optionIndex:number) => {
    const optCount = questions[qIndex].options.length;
    return Math.round((optionIndex / (optCount - 1)) * 2) + 1;
  };

  const handleAnswer = (qIndex:number, optionIndex:number) => {
    const score = scoreFor(qIndex, optionIndex);
    setAnswers({ ...answers, [qIndex]: { optionIndex, score } });
  };

  const calculateRisk = () => {
    const totalScore = Object.values(answers).reduce((acc, v) => acc + (v.score || 0), 0);
    const maxPossible = questions.length * 3;
    const pct = (totalScore / maxPossible) * 100;
    const level = pct < 40 ? 'Low Risk' : pct < 70 ? 'Medium Risk' : 'High Risk';
    setRiskLevel(level);
    setPage('results');
  };

  const assumptions: Record<string, number> = { 'Low Risk': 0.03, 'Medium Risk': 0.06, 'High Risk': 0.09 };

  const runSimulation = (profile: string, initial = 100, monthly = 25, years = 10) => {
    const rate = assumptions[profile] ?? 0.06;
    const res = simulate(initial, monthly, years, rate);
    setSimResult({ profile, ...res, rate });
    setPage('simulation');
  };

  const fetchQuote = async () => {
    try {
      const data = await getQuote(ticker);
      setQuote(data);
    } catch (err) {
      console.error(err);
      setQuote(null);
      alert('Failed to fetch quote. Check your Alpha Vantage key or rate limits.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto flex gap-2 mb-6">
        <button className={`px-3 py-2 rounded ${page==='home'?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setPage('home')}>Home</button>
        <button className={`px-3 py-2 rounded ${page==='assessment'?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setPage('assessment')}>Assessment</button>
        <button className={`px-3 py-2 rounded ${page==='simulation'?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setPage('simulation')}>Simulation</button>
        <button className={`px-3 py-2 rounded ${page==='resources'?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setPage('resources')}>Resources</button>
        <button className={`px-3 py-2 rounded ${page==='about'?'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setPage('about')}>About</button>
      </div>

      <main className="max-w-4xl mx-auto">
        {page==='home' && (
          <section className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-2">SmartStart Investing (Live)</h1>
            <p className="text-gray-700 mb-4">Educational demo that uses live Alpha Vantage data if configured.</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={()=>setPage('assessment')}>Take Assessment</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={()=>runSimulation('Medium Risk')}>Quick Simulation</button>
            </div>
          </section>
        )}

        {page==='assessment' && (
          <section className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold">Risk Assessment</h2>
            {questions.map((q,i)=>(
              <div key={i}>
                <p className="font-medium">{i+1}. {q.prompt}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {q.options.map((opt,idx)=>(
                    <button
                      key={opt}
                      className={`px-3 py-1 rounded ${answers[i] && answers[i].optionIndex===idx ? 'bg-blue-600 text-white' : 'bg-white'}`}
                      onClick={()=>handleAnswer(i, idx)}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={Object.keys(answers).length<questions.length} onClick={calculateRisk}>Show My Results</button>
            </div>
          </section>
        )}

        {page==='results' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p className="mt-2 text-lg font-bold">{riskLevel}</p>
            <p className="mt-2 text-gray-700">{riskLevel==='Low Risk' ? 'Focus on capital preservation.' : riskLevel==='Medium Risk' ? 'Balance growth and safety.' : 'Aggressive growth with higher volatility.'}</p>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>runSimulation(riskLevel||'Medium Risk')}>Simulate Portfolio</button>
              <button className="px-3 py-2 bg-white rounded border" onClick={()=>setPage('suggestions')}>See Suggestions</button>
            </div>
          </section>
        )}

        {page==='suggestions' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Investment Suggestions</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-3">
              <div>
                <h3 className="font-semibold">Low Risk</h3>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>High-yield savings / CDs</li>
                  <li>Short-term government bonds</li>
                  <li>Conservative robo-advisors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Medium Risk</h3>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>Balanced mutual funds</li>
                  <li>Index funds / ETFs</li>
                  <li>Target-date funds</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">High Risk</h3>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>Individual stocks</li>
                  <li>Aggressive ETFs</li>
                  <li>Cryptocurrency (very volatile)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <button className="px-3 py-2 bg-white rounded border" onClick={()=>setPage('resources')}>Learn More</button>
            </div>
          </section>
        )}

        {page==='simulation' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Portfolio Simulation</h2>
            <SimulationForm onRun={(p,i,m,y)=>runSimulation(p,i,m,y)} />
            {simResult && (
              <div className="mt-4">
                <h3 className="font-semibold">Result — {simResult.profile}</h3>
                <p className="text-gray-700">Projected balance: <strong>${simResult.balance.toLocaleString()}</strong></p>
                <SimulationChart data={simResult.history} />
              </div>
            )}
            <div className="mt-4">
              <h4 className="font-semibold">Live Quote (example)</h4>
              <div className="flex gap-2 items-center">
                <input value={ticker} onChange={e=>setTicker(e.target.value)} className="p-2 border rounded" />
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={fetchQuote}>Fetch Quote</button>
              </div>
              {quote && <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(quote, null, 2)}</pre>}
            </div>
          </section>
        )}

        {page==='resources' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">Resources</h2>
            <ul className="mt-2 list-disc ml-6 text-gray-700">
              <li>How to start with small amounts</li>
              <li>Understanding ETFs and index funds</li>
              <li>Glossary of terms</li>
            </ul>
          </section>
        )}

        {page==='about' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-2 text-gray-700">Built for an AI class to demonstrate personalization with accessible design.</p>
          </section>
        )}
      </main>
    </div>
  );
}