import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Zap, Activity, Cpu, MapPin, Wind, Volume2 } from 'lucide-react';
import { EnvironmentalMap } from './components/EnvironmentalMap';

export default function SignalApp() {
  const [input, setInput] = useState('');
  const [location, setLocation] = useState({ name: 'TASHKENT', lat: 41.29, lng: 69.24 });
  const [realData, setRealData] = useState({ air: '--', temp: '--', wind: '--', toxicity: 'LOW' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);

  // ФЕТЧИНГ РЕАЛЬНЫХ ДАННЫХ (Open-Meteo)
  const fetchEnvironmentalData = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com{lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m&air_quality=pm2_5,pm10`);
      const data = await res.json();
      setRealData({
        temp: data.current.temperature_2m + '°C',
        wind: data.current.wind_speed_10m + ' km/h',
        air: data.current.air_quality ? (data.current.air_quality.pm2_5 > 50 ? 'POOR' : 'OPTIMAL') : 'STABLE',
        toxicity: Math.random() > 0.8 ? 'MODERATE' : 'LOW' // Симуляция на основе шума
      });
    } catch (e) {
      console.error("Ошибка загрузки данных сектора");
    }
  };

  useEffect(() => {
    fetchEnvironmentalData(location.lat, location.lng);
  }, [location]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = (e.target as any)[0].value;
    if (!query) return;
    
    // Геокодинг через Nominatim (бесплатно)
    const geoRes = await fetch(`https://nominatim.openstreetmap.org{query}`);
    const geoData = await geoRes.json();
    if (geoData[0]) {
      setLocation({ name: query.toUpperCase(), lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) });
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const t = input.toLowerCase();
      const findings = [];
      if (t.includes('голова')) findings.push("НЕЙРО-РИСК: Сосудистая реакция на атм. давление.");
      if (t.includes('дышать')) findings.push("РЕСПИРАТОРНЫЙ СБОЙ: Чувствительность к PM2.5.");
      setReport({ signals: findings.length ? findings : ["СИГНАЛ ЧИСТ"], score: (85 + Math.random() * 10).toFixed(1) });
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFB000] font-mono p-4 md:p-8 relative">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com')]" />

      <header className="relative z-10 flex flex-col lg:flex-row justify-between items-center bg-black/90 border-2 border-[#FFB000]/20 p-6 rounded-3xl mb-8">
        <div className="flex items-center gap-4">
          <Shield className="text-[#32CD32] w-12 h-12" />
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">S.I.G.N.A.L.</h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-1/2 mt-4 lg:mt-0">
          <input className="w-full bg-[#111] border-2 border-[#FFB000]/20 py-4 px-6 rounded-xl text-xl outline-none text-white uppercase font-bold" placeholder="ВВЕДИТЕ ГОРОД..." />
          <button type="submit" className="bg-[#FFB000] text-black px-10 rounded-xl font-black uppercase hover:bg-white transition-all">ПОИСК</button>
        </form>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A0A0A] border-2 border-[#FFB000]/10 p-8 rounded-3xl">
            <div className="text-4xl font-black text-white italic truncate mb-6">{location.name}</div>
            <div className="grid grid-cols-2 gap-4">
              <DataBox label="ТЕМП" value={realData.temp} color="text-blue-400" />
              <DataBox label="ВОЗДУХ" value={realData.air} color="text-yellow-500" />
              <DataBox label="ВЕТЕР" value={realData.wind} color="text-[#32CD32]" />
              <DataBox label="ТОКСИНЫ" value={realData.toxicity} color="text-red-500" />
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-[#FFB000]/10 rounded-3xl h-[300px] overflow-hidden">
             <EnvironmentalMap lat={location.lat} lng={location.lng} />
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0A0A0A] border-2 border-[#FFB000]/20 rounded-[40px] p-8">
          <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3"><Cpu /> БИО-ДАННЫЕ</h2>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-[350px] bg-transparent text-white text-3xl font-bold border-none outline-none resize-none leading-tight" placeholder="ОПИШИТЕ СОСТОЯНИЕ..." />
          <button onClick={runAnalysis} className="w-full mt-6 py-8 bg-[#FFB000] text-black font-black text-4xl uppercase rounded-2xl shadow-xl active:scale-95 transition-all">
            {isAnalyzing ? "АНАЛИЗ..." : "СКАН ПАРАМЕТРОВ"}
          </button>
        </div>

        <div className="lg:col-span-3 bg-[#0A0A0A] border-4 border-[#32CD32]/20 rounded-[40px] p-8">
           <AnimatePresence mode='wait'>
            {report ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-8"><div className="text-7xl font-black text-[#32CD32]">{report.score}%</div></div>
                <div className="space-y-4">
                  {report.signals.map((s: any, i: number) => (
                    <div key={i} className="text-sm font-bold text-white bg-white/5 p-4 rounded-xl border-l-4 border-[#FFB000]">{s}</div>
                  ))}
                </div>
              </motion.div>
            ) : ( <div className="text-center opacity-20 mt-20"><Activity size={80} /></div> )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DataBox({ label, value, color }: any) {
  return (
    <div className="bg-black/60 p-4 border border-[#FFB000]/10 rounded-2xl text-center">
      <div className="text-[10px] opacity-30 uppercase font-bold mb-1">{label}</div>
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
