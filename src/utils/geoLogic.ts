export const getAreaThreats = (lat: number, lng: number) => {
  // Симуляция анализа геоданных для любой точки мира
  // В реальном API здесь был бы запрос к данным по качеству воздуха или радиации
  const seed = (lat + lng) % 1;
  return {
    toxicity: (seed * 0.8).toFixed(2),
    radiation: (seed * 0.15).toFixed(3),
    airQuality: seed > 0.5 ? 'CRITICAL' : 'STABLE',
    hiddenRisks: seed > 0.7 ? ['Respiratory Distress', 'Neural Fatigue'] : ['Normal Adaptation']
  };
};
