import * as functions from "firebase-functions";
import { google } from "googleapis";
import admin from "firebase-admin";

import { faketoken, fakeauth, login, auth } from "./auth";
import { getSmarthome } from "./smarthome";
import { FanState } from "./types";
import { getTempSync } from "./syncTemp";
import { normalize } from "./normalize";

// Initialize Firebase
admin.initializeApp();
const firebaseRef = admin.database().ref("devices");

// Initialize Homegraph
const homegraph = google.homegraph({
  version: "v1",
  auth,
});
// Hardcoded user ID
const USER_ID = "123";

const requestsync = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  functions.logger.info(`Request SYNC for user ${USER_ID}`);
  try {
    const res = await homegraph.devices.requestSync({
      requestBody: {
        agentUserId: USER_ID,
      },
    });
    functions.logger.info("Request sync response:", res.status, res.data);
    response.json(res.data);
  } catch (err) {
    functions.logger.error(err);
    response.status(500).send(`Error requesting sync: ${err}`);
  }
});

/**
 * Send a REPORT STATE call to the homegraph when data for any device id
 * has been changed.
 */
const reportstate = functions.database
  .ref("devices/{deviceId}")
  .onWrite(async (change, context) => {
    functions.logger.info("Firebase write event triggered Report State");
    const snapshot = change.after.val() as FanState;

    // console.log("report state snapshot", snapshot);

    const requestBody = {
      requestId: "12345" /* Any unique ID */,
      agentUserId: USER_ID,
      payload: {
        devices: {
          states: {
            /* Report the current state of our fan */
            [context.params.deviceId]: {
              ...normalize(context.params.deviceId, snapshot),
            },
          },
        },
      },
    };

    // console.log("report state requestBody", requestBody.payload.devices.states);

    const res = await homegraph.devices.reportStateAndNotification({
      requestBody,
    });
    functions.logger.info("Report state response:", res.status, res.data);
  });

/**
 * Update the current state of the fan device
 */
const updatestate = functions.https.onRequest((request, response) => {
  // console.log("request", request);
  const updateStateObject: FanState = {
    ...request.body,
  };

  console.log("updateStateObject", updateStateObject);

  firebaseRef.child("fan1").update(updateStateObject);

  return response.status(200).end();
});

const smarthome = getSmarthome(admin);
const syncTemp = getTempSync(admin);

export {
  requestsync,
  smarthome,
  reportstate,
  updatestate,
  faketoken,
  fakeauth,
  login,
  syncTemp,
};
