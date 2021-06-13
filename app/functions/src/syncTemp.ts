import * as functions from "firebase-functions";

export const getTempSync = (admin: any) => {
  return functions.database
    .ref("logs/{logId}")
    .onWrite(async (change, context) => {
      const snapshot = change.after.val();

      if (!snapshot.tmp) {
        return;
      }

      const firebaseRef = admin.database().ref("devices");

      if (snapshot.co2 > 0) {
        await firebaseRef.child("co21").update({
          rawValue: snapshot.co2,
        });
      }

      return await firebaseRef.child("thermostat1").update({
        temperatureAmbientCelsius: snapshot.tmp,
      });
    });
};
