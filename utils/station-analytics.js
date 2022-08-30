'use strict';

const stationStore = require("../models/station-store");
const metricConversion = require("./metric-conversion");

const stationAnalytics = {

  updateWeather(station) {
    station.latestReading = stationStore.getLatestReading(station);
    station.latestReading.weather = metricConversion.currentWeather(station.latestReading.code);
    station.latestReading.weatherIcon = metricConversion.weatherIcon(station.latestReading.code);
    station.latestReading.tempFar = metricConversion.tempFar(station.latestReading.temp);
    station.latestReading.beaufourt = metricConversion.beaufourtScale(station.latestReading.windSpeed);

    station.maxTemp = stationAnalytics.maxTemp(station.readings);
    station.minTemp = stationAnalytics.minTemp(station.readings);
    station.maxWind = stationAnalytics.maxWind(station.readings);
    station.minWind = stationAnalytics.minWind(station.readings);
    station.maxPressure = stationAnalytics.maxPressure(station.readings);
    station.minPressure = stationAnalytics.minPressure(station.readings);
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
        if (value > min) {
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
}

module.exports = stationAnalytics;