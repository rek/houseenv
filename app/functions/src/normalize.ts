// import {} from './sensorCo2'
import { normalizeFields as normalizeTmp } from "./sensorTemp";
import { normalizeFields as normalizeFan } from "./fan";

export const normalize = (deviceId: string, data: any) => {
  if (deviceId === "fan1") {
    return normalizeFan(data);
  }

  if (deviceId === "thermostat1") {
    return normalizeTmp(data);
  }

  if (deviceId === "co21") {
    return data;
  }

  return data;
};
