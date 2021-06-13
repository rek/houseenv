import * as functions from "firebase-functions";
import { database } from "firebase-admin";
import {
  smarthome,
  SmartHomeV1ExecuteRequestExecution,
} from "actions-on-google";
import {
  TS_FIX_ME,
  ExecutionResult,
  DeviceState,
  FanState,
  // ThermostatState,
} from "./types";
import { fan } from "./fan";
import { thermostat } from "./thermostat2";

// Hardcoded user ID
const USER_ID = "123";

export const getSmarthome = (admin: any) => {
  // Initialize Firebase
  const firebaseRef = admin.database().ref("devices");

  const app = smarthome();

  app.onSync((body) => {
    return {
      requestId: body.requestId,
      payload: {
        agentUserId: USER_ID,
        devices: [fan, thermostat],
      },
    };
  });

  const queryDevice = async (deviceId: string): Promise<DeviceState> => {
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
  app.onQuery(async (body): Promise<TS_FIX_ME> => {
    const { requestId } = body;
    const payload: {
      devices: Record<string, DeviceState>;
    } = {
      devices: {},
    };
    const queryPromises = [];
    const intent = body.inputs[0];
    for (const device of intent.payload.devices) {
      const deviceId = device.id;
      queryPromises.push(
        queryDevice(deviceId).then((data) => {
          // Add response to device payload
          payload.devices[deviceId] = data;
        })
      );
    }

    // Wait for all promises to resolve
    await Promise.all(queryPromises);

    return {
      requestId: requestId,
      payload: payload,
    };
  });

  const updateDevice = async (
    execution: SmartHomeV1ExecuteRequestExecution,
    deviceId: string
  ) => {
    const { params, command } = execution;

    let state: Object | undefined;
    let ref: database.Reference | undefined;

    const fanParams = params as Partial<FanState>;

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
  app.onExecute(async (body): Promise<TS_FIX_ME> => {
    const { requestId } = body;

    // Execution results are grouped by status
    const result: ExecutionResult = {
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
          executePromises.push(
            updateDevice(execution, device.id)
              .then((data) => {
                result.ids.push(device.id);
                Object.assign(result.states, data);
              })
              .catch(() => functions.logger.error("EXECUTE", device.id))
          );
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
