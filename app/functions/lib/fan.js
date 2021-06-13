"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fan = void 0;
exports.fan = {
    id: "fan1",
    type: "action.devices.types.FAN",
    traits: ["action.devices.traits.OnOff", "action.devices.traits.FanSpeed"],
    name: {
        defaultNames: ["Top Fan"],
        name: "Fan",
        nicknames: ["Fan"],
    },
    deviceInfo: {
        manufacturer: "Unknown",
        model: "12v",
        hwVersion: "Unknown",
        swVersion: "Unknown",
    },
    willReportState: true,
    attributes: {
        availableFanSpeeds: {
            speeds: [
                {
                    speed_name: "speed_low",
                    speed_values: [
                        {
                            speed_synonym: ["low", "slow"],
                            lang: "en",
                        },
                    ],
                },
                {
                    speed_name: "speed_high",
                    speed_values: [
                        {
                            speed_synonym: ["high", "fast"],
                            lang: "en",
                        },
                    ],
                },
            ],
            ordered: true,
        },
        reversible: false,
        supportsFanSpeedPercent: true,
    },
};
//# sourceMappingURL=fan.js.map