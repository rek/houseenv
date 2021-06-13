export const thermostat = {
  id: "thermostat1",
  type: "action.devices.types.SENSOR",
  traits: ["action.devices.traits.TemperatureSetting"],
  name: {
    defaultNames: ["Top Env Box"],
    name: "Thermostat",
    nicknames: ["Thermostat"],
  },
  deviceInfo: {
    manufacturer: "Unknown",
    model: "Unknown",
    hwVersion: "Unknown",
    swVersion: "Unknown",
  },
  willReportState: true,
  attributes: {
    thermostatTemperatureUnit: "C",
    commandOnlyTemperatureSetting: false,
    queryOnlyTemperatureSetting: true,
    // sensorStatesSupported: [
    //   {
    //     name: "CarbonMonoxideLevel",
    //     numericCapabilities: {
    //       rawValueUnit: "PARTS_PER_MILLION",
    //     },
    //   },
    // ],
  },
};
