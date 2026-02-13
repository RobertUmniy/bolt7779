const WEATHER_API_KEY = 'ТВОЙ_КЛЮЧ_ОТ_OPENWEATHER'; // Замени на свой
const PHOTO_API_KEY = 'ТВОЙ_КЛЮЧ_ОТ_UNSPLASH'; // Замени на свой

export const fetchSurvivalData = async (location: string = 'Chernobyl') => {
  try {
    // 1. Погода из реальных источников
    const weatherReq = await fetch(`https://api.openweathermap.org{location}&units=metric&appid=${WEATHER_API_KEY}`);
    const weather = await weatherReq.json();

    // 2. Рандомное фото "постапокалипсиса"
    const photoReq = await fetch(`https://api.unsplash.com{PHOTO_API_KEY}`);
    const photo = await photoReq.json();

    return {
      name: weather.name,
      temp: weather.main.temp,
      description: weather.weather[0].main,
      imageUrl: photo.urls.regular,
      radiation: (Math.random() * (0.50 - 0.12) + 0.12).toFixed(2) // Симуляция фона
    };
  } catch (e) {
    console.error("Связь с центром потеряна...");
    return null;
  }
};
