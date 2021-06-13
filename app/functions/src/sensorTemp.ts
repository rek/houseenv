export const thermostat = {
  id: "thermostat1",
  type: "action.devices.types.SENSOR",
  traits: ["action.devices.traits.TemperatureControl"],
  name: {
    defaultNames: ["Top Env Box"],
    name: "Thermostat",
    nicknames: ["Thermostat"],
  },
  deviceInfo: {
    manufacturer: "Unknown",
    model: "DHT22",
    hwVersion: "Unknown",
    swVersion: "Unknown",
  },
  willReportState: true,
  attributes: {
    temperatureUnitForUX: "C",
    queryOnlyTemperatureControl: true,

    temperatureRange: {
      minThresholdCelsius: -20,
      maxThresholdCelsius: 50,
    },

    // TemperatureSetting
    // thermostatTemperatureUnit: "C",
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

export const defaultValuesTmp = {
  temperatureAmbientCelsius: 0,
};

export const normalizeFields = (fields: any) => {
  return {
    temperatureAmbientCelsius: fields.temperatureAmbientCelsius,
  };
};
