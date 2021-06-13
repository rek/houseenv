"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thermostat = void 0;
exports.thermostat = {
    id: "thermostat1",
    type: "action.devices.types.THERMOSTAT",
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
    },
};
//# sourceMappingURL=thermostat.js.map