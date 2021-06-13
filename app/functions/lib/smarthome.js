"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmarthome = void 0;
const functions = __importStar(require("firebase-functions"));
const actions_on_google_1 = require("actions-on-google");
const fan_1 = require("./fan");
const thermostat_1 = require("./thermostat");
// Hardcoded user ID
const USER_ID = "123";
exports.getSmarthome = (admin) => {
    // Initialize Firebase
    const firebaseRef = admin.database().ref("devices");
    const app = actions_on_google_1.smarthome();
    app.onSync((body) => {
        return {
            requestId: body.requestId,
            payload: {
                agentUserId: USER_ID,
                devices: [fan_1.fan, thermostat_1.thermostat],
            },
        };
    });
    const queryDevice = async (deviceId) => {
        const snapshot = await firebaseRef.child(deviceId).once("value");
        const snapshotVal = snapshot.val();
        return snapshotVal;
        // if (["fan1"].includes(deviceId)) {
        //   return await queryFirebaseFan(deviceId);
        // }
        // if (["thermostat1"].includes(deviceId)) {
        //   return await queryFirebaseThermostat(deviceId);
        // }
        // return Promise.reject(`Device ${deviceId} not found`);
    };
    // A QUERY intent includes a set of devices.
    // For each device, you should respond with its current state.
    app.onQuery(async (body) => {
        const { requestId } = body;
        const payload = {
            devices: {},
        };
        const queryPromises = [];
        const intent = body.inputs[0];
        for (const device of intent.payload.devices) {
            const deviceId = device.id;
            queryPromises.push(queryDevice(deviceId).then((data) => {
                // Add response to device payload
                payload.devices[deviceId] = data;
            }));
        }
        // Wait for all promises to resolve
        await Promise.all(queryPromises);
        return {
            requestId: requestId,
            payload: payload,
        };
    });
    const updateDevice = async (execution, deviceId) => {
        const { params, command } = execution;
        let state;
        let ref;
        const fanParams = params;
        switch (command) {
            case "action.devices.commands.OnOff":
                state = { on: fanParams.on };
                ref = firebaseRef.child(deviceId).child("OnOff");
                break;
            case "action.devices.commands.SetFanSpeed":
                state = {
                    fanSpeedPercent: fanParams.fanSpeedPercent,
                };
                ref = firebaseRef.child(deviceId).child("FanSpeed");
                break;
            default:
                console.log("Command not found", { command, deviceId });
                break;
        }
        if (ref === undefined) {
            console.log("Command failed", { deviceId });
            return Promise.reject();
        }
        if (state === undefined) {
            return Promise.reject(`No new state for command: ${command}`);
        }
        return ref.update(state).then(() => state);
    };
    // The EXECUTE intent handles commands to update device state.
    // The response returns the status of each command—for example,
    // SUCCESS, ERROR, or PENDING—and the new device state.
    app.onExecute(async (body) => {
        const { requestId } = body;
        // Execution results are grouped by status
        const result = {
            ids: [],
            status: "SUCCESS",
            states: {
                online: true,
            },
        };
        const executePromises = [];
        const intent = body.inputs[0];
        for (const command of intent.payload.commands) {
            for (const device of command.devices) {
                for (const execution of command.execution) {
                    executePromises.push(updateDevice(execution, device.id)
                        .then((data) => {
                        result.ids.push(device.id);
                        Object.assign(result.states, data);
                    })
                        .catch(() => functions.logger.error("EXECUTE", device.id)));
                }
            }
        }
        await Promise.all(executePromises);
        return {
            requestId: requestId,
            payload: {
                commands: [result],
            },
        };
    });
    app.onDisconnect((body, headers) => {
        functions.logger.log("User account unlinked from Google Assistant");
        // Return empty response
        return {};
    });
    return functions.https.onRequest(app);
};
//# sourceMappingURL=smarthome.js.map