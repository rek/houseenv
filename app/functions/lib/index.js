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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatestate = exports.reportstate = exports.smarthome = exports.requestsync = void 0;
const functions = __importStar(require("firebase-functions"));
const googleapis_1 = require("googleapis");
const util_1 = __importDefault(require("util"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const smarthome_1 = require("./smarthome");
// Initialize Firebase
firebase_admin_1.default.initializeApp();
const firebaseRef = firebase_admin_1.default.database().ref("devices");
// Initialize Homegraph
const auth = new googleapis_1.google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/homegraph"],
});
const homegraph = googleapis_1.google.homegraph({
    version: "v1",
    auth: auth,
});
// Hardcoded user ID
const USER_ID = "123";
exports.login = functions.https.onRequest((request, response) => {
    if (request.method === "GET") {
        functions.logger.log("Requesting login page");
        response.send(`
    <html>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <body>
        <form action="/login" method="post">
          <input type="hidden"
            name="responseurl" value="${request.query.responseurl}" />
          <button type="submit" style="font-size:14pt">
            Link this service to Google
          </button>
        </form>
      </body>
    </html>
  `);
    }
    else if (request.method === "POST") {
        // Here, you should validate the user account.
        // In this sample, we do not do that.
        const responseurl = decodeURIComponent(request.body.responseurl);
        functions.logger.log(`Redirect to ${responseurl}`);
        return response.redirect(responseurl);
    }
    else {
        // Unsupported method
        response.send(405);
        // response.send(405, "Method Not Allowed");
    }
});
exports.fakeauth = functions.https.onRequest((request, response) => {
    console.log("request.query.redirect_uri", request.query.redirect_uri);
    const responseurl = util_1.default.format("%s?code=%s&state=%s", decodeURIComponent(request.query.redirect_uri), "xxxxxx", request.query.state);
    functions.logger.log(`Set redirect as ${responseurl}`);
    return response.redirect(`/login?responseurl=${encodeURIComponent(responseurl)}`);
});
exports.faketoken = functions.https.onRequest((request, response) => {
    const grantType = request.query.grant_type
        ? request.query.grant_type
        : request.body.grant_type;
    const secondsInDay = 86400; // 60 * 60 * 24
    const HTTP_STATUS_OK = 200;
    functions.logger.log(`Grant type ${grantType}`);
    let obj;
    if (grantType === "authorization_code") {
        obj = {
            token_type: "bearer",
            access_token: "123access",
            refresh_token: "123refresh",
            expires_in: secondsInDay,
        };
    }
    else if (grantType === "refresh_token") {
        obj = {
            token_type: "bearer",
            access_token: "123access",
            expires_in: secondsInDay,
        };
    }
    response.status(HTTP_STATUS_OK).json(obj);
});
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
    }
    catch (err) {
        functions.logger.error(err);
        response.status(500).send(`Error requesting sync: ${err}`);
    }
});
exports.requestsync = requestsync;
/**
 * Send a REPORT STATE call to the homegraph when data for any device id
 * has been changed.
 */
const reportstate = functions.database
    .ref("devices/{deviceId}")
    .onWrite(async (change, context) => {
    functions.logger.info("Firebase write event triggered Report State");
    const snapshot = change.after.val();
    // console.log("report state snapshot", snapshot);
    const requestBody = {
        requestId: "12345" /* Any unique ID */,
        agentUserId: USER_ID,
        payload: {
            devices: {
                states: {
                    /* Report the current state of our fan */
                    [context.params.deviceId]: Object.assign({}, snapshot),
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
exports.reportstate = reportstate;
/**
 * Update the current state of the fan device
 */
const updatestate = functions.https.onRequest((request, response) => {
    // console.log("request", request);
    const updateStateObject = Object.assign({}, request.body);
    console.log("updateStateObject", updateStateObject);
    firebaseRef.child("fan1").update(updateStateObject);
    return response.status(200).end();
});
exports.updatestate = updatestate;
const smarthome = smarthome_1.getSmarthome(firebase_admin_1.default);
exports.smarthome = smarthome;
//# sourceMappingURL=index.js.map