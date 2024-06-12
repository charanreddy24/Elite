import React, { useState, useEffect } from 'react';

const WeatherComponent = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/toronto?unitGroup=metric&key=H5U4VFFZNAQEL58T5Y2RYDEA4&contentType=json',
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 3 * 60 * 60 * 1000); // Fetch every 3 hours

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {weather ? (
        <div>
          <p>Toronto Weather: {weather.days[0].temp}°C</p>
          <p>{weather.days[0].conditions}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherComponent;
