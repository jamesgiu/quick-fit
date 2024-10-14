import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";
import "./index.css";
import "./App.css";

import { EuiLoadingLogo, EuiProvider, EuiEmptyPrompt, EuiLink, EuiFlexGroup, EuiFlexItem, EuiCard, EuiTitle, EuiIcon } from '@elastic/eui';
import { useEffect, useState } from 'react';
import { getWeather, WeatherType } from './MeteoApi';

const MyApp = () => {

  const [weatherData, setWeatherData] = useState<WeatherType>();
  const [hourMap, setHourMap] = useState<Map<Date, number>>();
  const [isDay, setIsDay] = useState<boolean>();
  const [soonAverageTemp, setSoonAverageTemp] = useState<number>();

  const getSoonAverageTemp = (): number => {
    if (weatherData) {
      return Math.round((weatherData?.hourly.temperature2m[0] + weatherData?.hourly.temperature2m[1] + weatherData?.hourly.temperature2m[2] + weatherData?.hourly.temperature2m[3] + weatherData?.hourly.temperature2m[4] + weatherData?.hourly.temperature2m[5]) / 6);;
    }

    return 0;
  }

  const getTonightTemp = (): number => {
    if (weatherData) {
      let tonightAvg = 0;
      // Filter to be only indices that are for today, and 6pm or later.
      const tonightDates = weatherData.hourly.time.filter(time => time.getDay() === new Date(Date.now()).getDay() && time.getHours() >= 18);
      tonightDates.forEach((date) => {
        tonightAvg += hourMap?.get(date)!;
      });

      tonightAvg = tonightAvg / tonightDates.length;
      return Math.round(tonightAvg);
    }

    return 0;
  }

  const getTomorrowTemp = (): number => {
    if (weatherData) {
      let tomorrowAvg = 0;
      // Filter to be only indices that are for tomorrow, and before 6pm.
      const tomorrowDates = weatherData.hourly.time.filter(time => time.getDay() !== new Date(Date.now()).getDay()).slice(0, 23);
      tomorrowDates.forEach((date) => {
        tomorrowAvg += hourMap?.get(date)!;
      });

      tomorrowAvg = tomorrowAvg / tomorrowDates.length;
      return Math.round(tomorrowAvg);
    }

    return 0;
  }

  const dayCard =           <EuiFlexItem>
  <EuiCard
  className="day-card"
  icon={<EuiLoadingLogo size="xl" logo={"sun"}/>}
  title={`${soonAverageTemp}°C`}
  description={isDay && weatherData && `Today's coldest is ${Math.round(weatherData!.daily.apparentTemperatureMin[0])}°C, and the warmest is ${Math.round(weatherData!.daily.apparentTemperatureMax[0])}°C`}
  betaBadgeProps={{
    label: 'Today',
    color: 'accent',
  }}
/>
</EuiFlexItem>;

const tomorrowCard =           <EuiFlexItem>
<EuiCard
className="day-card tomorrow-card"
icon={<EuiLoadingLogo size="xl" logo={"sun"}/>}
title={`${getTomorrowTemp()}°C`}
description="8am - 5pm"
betaBadgeProps={{
  label: 'Tomorrow',
  color: 'accent',
}}
/>
</EuiFlexItem>;

const nightCard =           <EuiFlexItem>
<EuiCard
className="night-card"
icon={<EuiLoadingLogo size="xl" logo={"moon"}/>}
title={isDay ? `${getTonightTemp()}°C` : `${soonAverageTemp}°C`}
description= {isDay && weatherData ? `The minimum temperature will feel like ${Math.round(weatherData?.daily.apparentTemperatureMin[0])}°C` : weatherData &&  `Today's coldest felt like ${Math.round(weatherData!.daily.apparentTemperatureMin[0])}°C, and the warmest felt like  ${Math.round(weatherData!.daily.apparentTemperatureMax[0])}°C`}
betaBadgeProps={{
  label: 'Tonight',
  color: 'subdued',
}}
/>
</EuiFlexItem>;

const currentTemp = () => {

  if (weatherData !== undefined) {
    return(
      <EuiCard
      className="current-temp"
      icon={<EuiIcon type="temperature"/>}
      title={`${Math.round(weatherData.current.temperature2m)}°C`}
      description={`Feels like ${Math.round(weatherData.current.apparentTemperature)}°C`}
      betaBadgeProps={{
        label: 'Current',
        color: 'subdued',
      }}
      >
      </EuiCard>
      );
  }
}
 

  useEffect(()=> {
    getWeather(setWeatherData);
  }, []);

  useEffect(()=> {
    setIsDay(weatherData?.current.isDay === 1)
    setSoonAverageTemp(getSoonAverageTemp());
    
    const hoursMap = new Map<Date, number>();

    if (weatherData) {
      for (let i=0; i < weatherData?.hourly.time.length; i++) {
        hoursMap.set(weatherData.hourly.time[i], weatherData.hourly.temperature2m[i]);
      }  

      setHourMap(hoursMap);
    }

  }, [weatherData])

  
  // TODO
  // function to return 'card' with temp, icon and yes/no for jacket depending on passed CURRENT.
  // if isDay is true, if it is, calc avg temp next 3 hours and display kick-ons on right.
  // if isDay is false, if it is, calc avg temp next 3 hours and display TOMORROW's 9am-5pm on right.
  // WEATHER ICONS FUNCTION - take in rain as well?

  return (
    <EuiProvider>
      <div className="app-content">
        <div className={`bg-image-wrapper ${isDay ? 'bg-day' : 'bg-night'}`}/>
        <EuiEmptyPrompt
        icon={ <div className="app-logo"/>}
        title={<EuiTitle className="logo-subtext" size='l'><h1>QuickFit</h1></EuiTitle>}
        footer={
          <div className="qf-footer">
            <span>
            © 2024 Jiv
            </span>
            <EuiLink href="#" target="https://github.com/jamesgiu/quick-fit">
              <EuiIcon size="l" type={"logoGithub"}/>
            </EuiLink>
          </div>
        }
        />
        {currentTemp()}
        <EuiFlexGroup className='cards-flex-group'>  
          {isDay ? <>{dayCard}{nightCard}</> : <>{nightCard}{tomorrowCard}</> }
        </EuiFlexGroup>
      </div>
    </EuiProvider>
  );
}

export default MyApp;
