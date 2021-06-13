export interface RawSensorState {
  rawValue: number;
}
export interface FanState {
  fanSpeed?: string;
  fanSpeedPercent: number;
  systemMode: number;
  tempThreshold: number;
  vocThreshold?: number;
  humThreshold?: number;
  co2Threshold?: number;
  on: boolean;
}

export interface ThermostatState {
  temperatureAmbientCelsius?: number;

  // activeThermostatMode?: string;
  // thermostatMode?: string;
  // thermostatTemperatureSetpointHigh?: number;
  // thermostatTemperatureSetpointLow?: number;
  // thermostatTemperatureAmbient: number;
}

export type DeviceState = RawSensorState | FanState | ThermostatState;

export type TS_FIX_ME = any;

export interface ExecutionResult {
  ids: string[];
  status: string;
  states: {
    online: boolean;
  };
}
