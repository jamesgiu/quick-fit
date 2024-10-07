import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";
import "./index.css";
import "./App.css";

import { EuiLoadingLogo, EuiProvider, EuiEmptyPrompt, EuiLink, EuiFlexGroup, EuiFlexItem, EuiCard, EuiTitle, EuiIcon } from '@elastic/eui';
import { useEffect, useState } from 'react';
import { getWeather, WeatherType } from './MeteoApi';
import { Chart, Metric, Settings } from '@elastic/charts';

const MyApp = () => {

  const [weatherData, setWeatherData] = useState<WeatherType>();
  const [isDay, setIsDay] = useState<boolean>();

  const dayCard =           <EuiFlexItem>
  <EuiCard
  className="day-card"
  icon={<EuiLoadingLogo size="xl" logo={"sun"}/>}
  title={"Brunching..."}
  description="Do you need a jacket today?"
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
title={"Brunching..."}
description="Will you need a jacket tomorrow?"
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
title={"Kick-ons..."}
description="Will you need a jacket for tonight?"
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
    setIsDay(weatherData?.current.isDay === 1);
  }, [weatherData])
  
  // TODO
  // function to return 'card' with temp, icon and yes/no for jacket depending on passed CURRENT.
  // if isDay is true, if it is, calc avg temp next 3 hours and display kick-ons on right.
  // if isDay is false, if it is, calc avg temp next 3 hours and display TOMORROW's 9am-5pm on right.
  // WEATHER ICONS FUNCTION - take in rain as well?

  return (
    <EuiProvider>
      <div className="app-content">
        <div className="bg-image-wrapper"/>
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
        <EuiFlexGroup>  
          {isDay ? <>{dayCard}{nightCard}</> : <>{nightCard}{tomorrowCard}</> }
        </EuiFlexGroup>
      </div>
    </EuiProvider>
  );
}

export default MyApp;
