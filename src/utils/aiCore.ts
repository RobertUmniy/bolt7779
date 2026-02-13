export const ZONES = [
  { name: 'СЕКТОР ЧАЭС', lat: 51.27, lon: 30.22, risk: 'CRITICAL', info: 'РАДИАЦИОННЫЙ ФОН: 600 мкР/ч' },
  { name: 'ПРОМЗОНА 12', lat: 55.75, lon: 37.61, risk: 'HIGH', info: 'КОНЦЕНТРАЦИЯ PM2.5: ВЫШЕ НОРМЫ' },
  { name: 'ЖИЛОЙ КВАРТАЛ', lat: 48.85, lon: 2.35, risk: 'LOW', info: 'ФОН В НОРМЕ' }
];

export const processBiometrics = (text: string) => {
  const input = text.toLowerCase();
  // Анализ скрытых сигналов (Weak Signals)
  const stressMarkers = ['болит', 'голова', 'устал', 'тошнит', 'сон', 'пульс', 'забыл', 'тревога'];
  const matches = stressMarkers.filter(m => input.includes(m)).length;
  
  // Лингвистический анализ (короткие фразы как признак когнитивного шока)
  const isFragmented = text.length > 0 && text.split(' ').length < 4;

  let status = {
    level: "СТАБИЛЬНЫЙ",
    color: "#00ff41",
    advice: "БИОМЕТРИЯ В НОРМЕ. ФИЛЬТРЫ АКТИВНЫ.",
    intensity: 15
  };

  if (matches >= 1 || isFragmented) {
    status = { level: "ТРЕВОГА", color: "#ffb000", advice: "ОБНАРУЖЕН СЛАБЫЙ СИГНАЛ ПАТОЛОГИИ. НУЖНА ДИАГНОСТИКА.", intensity: 55 };
  }
  if (matches >= 3) {
    status = { level: "КРИТИЧЕСКИЙ", color: "#ff3e3e", advice: "ВНИМАНИЕ: ВЫСОКИЙ РИСК НЕЙРОННОГО СБОЯ!", intensity: 95 };
  }

  return { ...status, time: new Date().toLocaleTimeString() };
};
