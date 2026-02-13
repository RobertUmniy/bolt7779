export const getSurvivalData = async (city = 'Chernobyl') => {
  try {
    // 1. Координаты для Open-Meteo (Чернобыль по дефолту)
    const lat = 51.27;
    const lon = 30.22;

    // 2. Реальная погода без ключа (Open-Meteo)
    const weatherRes = await fetch(
      `https://api.open-meteo.com{lat}&longitude=${lon}&current_weather=true`
    );
    const weather = await weatherRes.json();

    // 3. Картинка через Source Unsplash (работает без API ключа по ключевым словам)
    // Мы добавляем Math.random, чтобы картинка обновлялась при каждом запросе
    const randomId = Math.floor(Math.random() * 1000);
    const imageUrl = `https://source.unsplash.com{randomId}`;

    return {
      location: "ЗОНА ОТЧУЖДЕНИЯ",
      temp: `${weather.current_weather.temperature}°C`,
      wind: `${weather.current_weather.windspeed} км/ч`,
      status: weather.current_weather.temperature < 0 ? "КРИТИЧЕСКИЙ ХОЛОД" : "РАДИАЦИЯ В НОРМЕ",
      image: imageUrl,
      time: new Date().toLocaleTimeString()
    };
  } catch (err) {
    return {
      location: "ОШИБКА СВЯЗИ",
      temp: "??",
      status: "СИГНАЛ ПОТЕРЯН",
      image: "https://images.unsplash.com",
      time: "--:--"
    };
  }
};
