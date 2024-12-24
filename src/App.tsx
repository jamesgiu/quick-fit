import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";
import "./index.css";
import "./App.css";

import { EuiLoadingLogo, EuiProvider, EuiEmptyPrompt, EuiLink, EuiFlexGroup, EuiFlexItem, EuiCard, EuiTitle, EuiIcon, EuiHeader, EuiToolTip, EuiButton } from '@elastic/eui';
import { useEffect, useState } from 'react';
import { getWeather, WeatherType } from './MeteoApi';

enum FIT {
  NO_JACKET="NO JACKET",
  LIGHT_JACKET="LIGHT JACKET",
  MEDIUM_JACKET="MEDIUM JACKET",
  HEAVY_JACKET="HEAVY JACKET",
  RAIN_JACKET="RAIN JACKET",
  UMBRELLA="UMBRELLA",
}

const MyApp = () => {

  const [weatherData, setWeatherData] = useState<WeatherType>();
  const [isDay, setIsDay] = useState<boolean>();
  const [soonAverageTemp, setSoonAverageTemp] = useState<number>();

  const getSoonAverageTemp = (): number => {
    if (weatherData) {
      let nowHour =  new Date(Date.now()).getHours();
      return Math.round((weatherData?.hourly.temperature2m[nowHour] + weatherData?.hourly.temperature2m[nowHour+1] + weatherData?.hourly.temperature2m[nowHour+2] + weatherData?.hourly.temperature2m[nowHour+3] + weatherData?.hourly.temperature2m[nowHour+4] + weatherData?.hourly.temperature2m[nowHour+5]) / 6);;
    }

    return 0;
  }

  const getTonightTemp = (): number => {
    if (weatherData) {
      let tonightAvg = 0;
      const tonightDates = [];
      // Filter to be only indices that are for today, and 6pm or later.
      for(let i = 18; i < 24; i++) {
        tonightDates.push(weatherData.hourly.temperature2m[i])
      }
      
      tonightDates.forEach((temp) => {
        tonightAvg += temp;
      });

      tonightAvg = tonightAvg / tonightDates.length;
      return Math.round(tonightAvg);
    }

    return 0;
  }

  const getTomorrowTemp = (): number => {
    if (weatherData) {
      let tomorrowAvg = 0;
      const tomorrowDates = [];
      // Filter to be only indices that are for tomorrow, and before 6pm.
        for(let i = 36; i < 42; i++) {
          tomorrowDates.push(weatherData.hourly.temperature2m[i])
        }
        
        tomorrowDates.forEach((temp) => {
          tomorrowAvg += temp;
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
    label: 'The day',
    color: 'accent',
  }}
/>
</EuiFlexItem>;

const tomorrowCard =           <EuiFlexItem>
<EuiCard
className="day-card tomorrow-card"
icon={<EuiLoadingLogo size="xl" logo={"sun"}/>}
title={`${getTomorrowTemp()}°C`}
description="Average during the day tomorrow"
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
      title={`${Math.round(weatherData.current.temperature2m)}°C`}
      description={`but it feels like ${Math.round(weatherData.current.apparentTemperature)}°C`}
      >
      </EuiCard>
      );
  }
}

const getJacketCard = () => {

  if (weatherData !== undefined) {

    const jacket = currentJacketCheck(weatherData);

    return(
      <EuiCard
      className="jacket-card"
      icon={<EuiIcon size="xxl" type={`${jacket}.svg`}/>}
      title={jacket.toString()}
      description={"based on our formula™, factoring in..."}
      >
      </EuiCard>
      );
  }
}

const currentJacketCheck = (weatherData: WeatherType) : FIT => {
    if (weatherData.current.rain || weatherData.current.showers || weatherData.current.snowfall || weatherData.current.precipitation > 50) {
      if (weatherData.current.windSpeed10m > 20) {
        return FIT.RAIN_JACKET;
      } else {
        return FIT.UMBRELLA;
      }
    }

    if (weatherData.current.apparentTemperature <= 12) {
        if (weatherData.current.windSpeed10m > 20) {
          return FIT.HEAVY_JACKET;
        }

        if (weatherData.current.relativeHumidity2m >= 70) {
          return FIT.MEDIUM_JACKET;
        }

        return FIT.MEDIUM_JACKET;
    }

    if(weatherData.current.apparentTemperature >= 23) {
      if (weatherData.current.windSpeed10m > 20) {
        return FIT.LIGHT_JACKET;
      }

      if (weatherData.current.relativeHumidity2m >= 70) {
        return FIT.NO_JACKET;
      }

      return FIT.NO_JACKET;
    }

    if (weatherData.current.apparentTemperature >= 18 && weatherData.current.apparentTemperature <= 22) {
      if (weatherData.current.windSpeed10m > 20) {
        return FIT.MEDIUM_JACKET;
      }

      if (weatherData.current.relativeHumidity2m >= 70) {
        return FIT.LIGHT_JACKET;
      }

      return FIT.LIGHT_JACKET;
    }

    if (weatherData.current.apparentTemperature >= 13 && weatherData.current.apparentTemperature <= 17) {
      if (weatherData.current.windSpeed10m > 20) {
        return FIT.HEAVY_JACKET;
      }

      if (weatherData.current.relativeHumidity2m >= 70) {
        return FIT.MEDIUM_JACKET;
      }

      return FIT.MEDIUM_JACKET;
    }

    return FIT.NO_JACKET;
}
 

  useEffect(()=> {
    getWeather(setWeatherData);
  }, []);

  useEffect(()=> {
    setIsDay(weatherData?.current.isDay === 1)
    setSoonAverageTemp(getSoonAverageTemp());
  
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
        {getJacketCard()}
        <EuiFlexGroup className='icons-flex-group'>  
        {weatherData &&
        <EuiFlexItem>
        <EuiIcon type="temperature" size="l"/>
          {Math.round(weatherData?.current.apparentTemperature).toString() + "°C"}
        </EuiFlexItem>
        }
        {weatherData &&
        <EuiFlexItem>
          <EuiIcon type="tear" size="l"/>
          {Math.round(weatherData?.current.precipitation).toString() + "%"}
        </EuiFlexItem>
        }
        {weatherData && 
        <EuiFlexItem>
          <EuiIcon type="flag" size="l"/>
          {Math.round(weatherData?.current.windSpeed10m).toString() + "km/h"}
        </EuiFlexItem>
        }
        {weatherData && 
        <EuiFlexItem>
          <EuiIcon type="heatmap" size="l"/>
          {Math.round(weatherData?.current.relativeHumidity2m).toString() + "%"}
        </EuiFlexItem>
        }
        </EuiFlexGroup>
        <EuiFlexGroup className='cards-flex-group'>  
          {isDay ? <>{dayCard}{nightCard}</> : <>{nightCard}{tomorrowCard}</> }
        </EuiFlexGroup>
      </div>
    </EuiProvider>
  );
}

export default MyApp;
