"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, Activity, ThumbsUp, BarChart2 } from "lucide-react";

// Mock Data basada en "RegistroVistaMensual" (Interactions Service)
const viewsData = [
  { name: "Ene", vistas: 1200 },
  { name: "Feb", vistas: 1900 },
  { name: "Mar", vistas: 3000 },
  { name: "Abr", vistas: 5800 },
  { name: "May", vistas: 7200 },
  { name: "Jun", vistas: 12540 },
];

// Mock Data basada en likes/dislikes (Catalog Service)
const approvalData = [
  { name: "Likes", value: 850, color: "#00f2fe" },    // Cyan
  { name: "Dislikes", value: 150, color: "#3a86ff" }, // Blue
];

// Mock Data de Top Películas
const topMovies = [
  { id: 1, title: "Thor: Ragnarok", vistas: 5400, tendencia: "+12%" },
  { id: 2, title: "Coco", vistas: 4200, tendencia: "+8%" },
  { id: 3, title: "Jurassic World", vistas: 2100, tendencia: "+2%" },
  { id: 4, title: "Cómo ser un Latin Lover", vistas: 840, tendencia: "-1%" },
];

export default function EstadisticasPage() {
  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Estadísticas del Canal
        </h1>
        <p className="mt-1 text-[#aeb4c0]">
          Mide el rendimiento de tus películas, descubre qué le gusta a tu audiencia y optimiza tus ganancias.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* GRÁFICA PRINCIPAL: Vistas Mensuales (Ocupa 2 columnas en pantallas grandes) */}
        <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0b0c15] p-6 shadow-xl lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Activity className="text-[#00f2fe]" size={24} /> Rendimiento de Vistas
              </h2>
              <p className="text-sm text-[#aeb4c0]">Crecimiento en los últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#00f2fe]/10 px-4 py-1.5 text-sm font-bold text-[#00f2fe]">
              <TrendingUp size={16} /> +15.3%
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVistas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#aeb4c0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#aeb4c0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'k' : value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#121826', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#00f2fe', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vistas" name="Vistas" stroke="#00f2fe" strokeWidth={3} fillOpacity={1} fill="url(#colorVistas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICA SECUNDARIA: Tasa de Aprobación */}
        <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0b0c15] p-6 shadow-xl">
          <div className="mb-2">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <ThumbsUp className="text-[#3a86ff]" size={24} /> Aprobación Global
            </h2>
            <p className="text-sm text-[#aeb4c0]">Basado en Likes y Dislikes</p>
          </div>
          
          <div className="relative flex flex-1 items-center justify-center">
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white">85%</span>
              <span className="text-xs font-medium text-[#aeb4c0]">Likes</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={approvalData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#121826', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TOP PELÍCULAS (RANKING) */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-[#0b0c15] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <BarChart2 className="text-[#00f2fe]" size={24} /> Top Películas
            </h2>
            <p className="text-sm text-[#aeb4c0]">Tus contenidos más reproducidos este mes</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topMovies.map((movie, index) => (
            <div key={movie.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-5 transition hover:bg-white/10">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                  #{index + 1}
                </span>
                <span className={`text-sm font-bold ${movie.tendencia.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {movie.tendencia}
                </span>
              </div>
              <h3 className="mt-4 truncate text-lg font-bold text-white">{movie.title}</h3>
              <p className="mt-1 text-2xl font-extrabold text-[#00f2fe]">
                {movie.vistas.toLocaleString()} <span className="text-sm font-normal text-[#aeb4c0]">vistas</span>
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
