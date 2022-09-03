"use strict";

const logger = require("../utils/logger.js");
const stationStore = require('../models/station-store.js');
const stationAnalytics = require('../utils/station-analytics');
const metricConversion = require('../utils/metric-conversion');
const uuid = require('uuid');
const accounts = require ('./accounts.js');

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const stations = stationStore.getUserStations(loggedInUser.id);
    for (let station of stations) {
      if (station.readings.length > 0) {
        stationAnalytics.updateWeather(station);
      }
    }
    const viewData = {
      title: "Weathertop 2.0 Release 2 Dashboard",
      stations: stations,
    };
    logger.info('about to render', stationStore.getAllStations());
    response.render("dashboard", viewData);
  },

  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      stationName: request.body.stationName,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      readings: [],
    };
    logger.debug('Creating a new Station for ${newStation.userid}', newStation);
    stationStore.addStation(newStation);
    response.redirect('/dashboard');
  },
  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug("deleting station ${stationId}");
    stationStore.removeStation(stationId);
    response.redirect("/dashboard")
  },

};

module.exports = dashboard;
