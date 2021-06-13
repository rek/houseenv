export const sensorCo2 = {
  id: "co21",
  type: "action.devices.types.SENSOR",
  traits: ["action.devices.traits.SensorState"],
  name: {
    defaultNames: ["Top Env Box - co2"],
    name: "Co2",
    nicknames: ["co2"],
  },
  deviceInfo: {
    manufacturer: "Unknown",
    model: "DHT22",
    hwVersion: "Unknown",
    swVersion: "Unknown",
  },
  willReportState: true,
  attributes: {
    sensorStatesSupported: [
      {
        name: "CarbonDioxideLevel",
        numericCapabilities: {
          rawValueUnit: "PARTS_PER_MILLION",
        },
      },
    ],
  },
};

export const defaultValuesCo2 = {
  rawValue: 0,
};
