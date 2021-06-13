export interface FanState {
  fanSpeed?: string;
  fanSpeedPercent: number;
  on: boolean;
}

export interface ThermostatState {
  activeThermostatMode?: string;
  thermostatMode?: string;
  thermostatTemperatureSetpointHigh?: number;
  thermostatTemperatureSetpointLow?: number;
  thermostatTemperatureAmbient: number;
}

export type DeviceState = FanState | ThermostatState;

export type TS_FIX_ME = any;

export interface ExecutionResult {
  ids: string[];
  status: string;
  states: {
    online: boolean;
  };
}
