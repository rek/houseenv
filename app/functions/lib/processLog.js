"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLog = void 0;
const functions = __importStar(require("firebase-functions"));
// import { processLog } from "detect-pullups";
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp(functions.config().firebase);
// const admin = require("firebase-admin");
// admin.initializeApp();
const db = firebase_admin_1.default.firestore();
// const admin = require("firebase-admin");
// admin.initializeApp();
const USER_KEY = "user";
exports.processLog = functions.firestore
  .document("/users/{user}/logs/{logId}")
  .onCreate(async (snap, context) => {
    // get user weight
    await db
      .collection(USER_KEY)
      .doc(context.params.user)
      .get()
      .then(function (querySnapshot) {
        const result = querySnapshot.data();
        console.log("Found user data:", result);
      });
    console.log("Moving on...");
    // const log = snap.data();
    // const result = await processLog(row.data, user.weight);
    // console.log("[User Logs] Processing result:", result);
    // addProcessedLog.mutate({
    //   format: 1,
    //   logId: row._id,
    //   created: row.created.seconds,
    //   processed: +new Date(),
    //   weight: result.weight,
    //   report: result.report,
    // });
    return snap.ref.set(
      { created: context.timestamp, processed: false },
      { merge: true }
    );
  });
//# sourceMappingURL=processLog.js.map
