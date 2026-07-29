import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const volume = [
  { day: "Mon", triaged: 18 },
  { day: "Tue", triaged: 24 },
  { day: "Wed", triaged: 31 },
  { day: "Thu", triaged: 27 },
  { day: "Fri", triaged: 36 },
];

export default function App() {
  return (
    <main>
      <header>
        <p className="eyebrow">QUALITY ENGINEERING · HACKATHON</p>
        <h1>DefectTriageBot</h1>
        <p className="subtitle">Explainable, human-controlled defect triage in under 10 seconds.</p>
      </header>

      <section className="metrics" aria-label="Triage metrics">
        <article><span>Average triage time</span><strong>&lt; 10s</strong></article>
        <article><span>Manual baseline</span><strong>~45 min</strong></article>
        <article><span>Graph status</span><strong>Phase 0</strong></article>
      </section>

      <section className="panel">
        <div>
          <p className="eyebrow">FOUNDATION READY</p>
          <h2>State → tools → nodes → graph → API → UI</h2>
          <p>The React console will call FastAPI, which invokes the LangGraph triage workflow and returns its audit trail.</p>
        </div>
        <div className="chart" aria-label="Weekly triaged defects chart">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volume}>
              <XAxis dataKey="day" stroke="#90a4c4" />
              <YAxis stroke="#90a4c4" />
              <Tooltip />
              <Bar dataKey="triaged" fill="#48d1b3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
}
