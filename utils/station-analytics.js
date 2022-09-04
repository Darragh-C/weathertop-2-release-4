'use strict';

const stationStore = require("../models/station-store");
const metricConversion = require("./metric-conversion");

const stationAnalytics = {

  updateWeather(station) {
    station.latestReading = stationStore.getLatestReading(station);
    if (station.latestReading.openWeatherApi === false) {
      station.latestReading.weather = metricConversion.currentWeather(station.latestReading.code);
      station.latestReading.weatherIcon = metricConversion.weatherIcon(station.latestReading.code);
    }
    station.latestReading.tempFar = metricConversion.tempFar(station.latestReading.temp);
    station.latestReading.beaufourt = metricConversion.beaufourtScale(station.latestReading.windSpeed);
    station.latestReading.windCompass = metricConversion.windDirCalc(station.latestReading.windDir);
    station.latestReading.windChill = stationAnalytics.windChill(station.latestReading);

    station.maxTemp = stationAnalytics.maxTemp(station.readings);
    station.minTemp = stationAnalytics.minTemp(station.readings);
    station.maxWind = stationAnalytics.maxWind(station.readings);
    station.minWind = stationAnalytics.minWind(station.readings);
    station.maxPressure = stationAnalytics.maxPressure(station.readings);
    station.minPressure = stationAnalytics.minPressure(station.readings);

    station.tempTrend = stationAnalytics.tempTrend(station.readings);
    station.windTrend = stationAnalytics.windTrend(station.readings);
    station.pressureTrend = stationAnalytics.pressureTrend(station.readings);

    return station;
  },

  windChill(reading) {
    let t = reading.temp;
    let v = reading.windSpeed;
    return (13.12 + (0.6215 * t) - (11.37 * (Math.pow(v, 0.16))) + ((0.3965 * t)*(Math.pow(v, 0.16)))).toFixed(2);
  },

  max(values) {
    if (values.length > 1) {
      let max = values[0];
      for (let value of values) {
        if (value > max) {
          max = value;
        }
      }
      return max;
    }
    else {
      return values[0];
    }
  },

  min(values) {
    if (values.length > 1) {
      let min = values[0];
      for (let value of values) {
        if (value < min) {
          min = value;
        }
      }
      return min;
    }
    else {
      return values[0];
    }
  },

  maxTemp(readings) {
    let tempReadings = [];
    for (let reading of readings) {
      tempReadings.push(reading.temp);
    }
    return this.max(tempReadings);
  },

  minTemp(readings) {
    let tempReadings = [];
    for (let reading of readings) {
      tempReadings.push(reading.temp);
    }
    return this.min(tempReadings);
  },

  maxWind(readings) {
    let windReadings = [];
    for (let reading of readings) {
      windReadings.push(reading.windSpeed);
    }
    return this.max(windReadings);
  },

  minWind(readings) {
    let windReadings = [];
    for (let reading of readings) {
      windReadings.push(reading.windSpeed);
    }
    return this.min(windReadings);
  },

  maxPressure(readings) {
    let pressureReadings = [];
    for (let reading of readings) {
      pressureReadings.push(reading.pressure);
    }
    return this.max(pressureReadings);
  },

  minPressure(readings) {
    let pressureReadings = [];
    for (let reading of readings) {
      pressureReadings.push(reading.pressure);
    }
    return this.min(pressureReadings);
  },

  getTrend(values) {
    let trend = 0;
    if (values[0] > values[1] && values[1] > values[2]) {
      trend = 1;
    } else if (values[0] < values[1] && values[1] < values[2]) {
      trend = -1;
    }
    return trend;
  },

  tempTrend(readings) {
    let trend = 0;
    if (readings.length > 2) {
      let lastThreeReadings = [
        readings[readings.length -1].temp,
        readings[readings.length -2].temp,
        readings[readings.length -3].temp
      ];
      trend = this.getTrend(lastThreeReadings);
    }
    return trend;
  },

  windTrend(readings) {
    let trend = 0;
    if (readings.length > 2) {
      let lastThreeReadings = [
        readings[readings.length -1].windSpeed,
        readings[readings.length -2].windSpeed,
        readings[readings.length -3].windSpeed
      ];
      trend = this.getTrend(lastThreeReadings);
    }
    return trend;
  },

  pressureTrend(readings) {
    let trend = 0;
    if (readings.length > 2) {
      let lastThreeReadings = [
        readings[readings.length -1].pressure,
        readings[readings.length -2].pressure,
        readings[readings.length -3].pressure
      ];
      trend = this.getTrend(lastThreeReadings);
    }
    return trend;
  },
}

module.exports = stationAnalytics;