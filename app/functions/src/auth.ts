import * as functions from "firebase-functions";
import util from "util";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/homegraph"],
});

const login = functions.https.onRequest((request, response) => {
  if (request.method === "GET") {
    functions.logger.log("Requesting login page");
    response.send(`
    <html>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <body style="padding: 20px;">
        <form action="/login" method="post">
          <input type="hidden"
            name="responseurl" value="${request.query.responseurl}" />
          <button type="submit" style="font-size:14pt; padding: 20px; background: #555; color: #eee">
            Link HOME ENV to Google
          </button>
        </form>
      </body>
    </html>
  `);
  } else if (request.method === "POST") {
    // Here, you should validate the user account.
    // In this sample, we do not do that.
    const responseurl = decodeURIComponent(request.body.responseurl);
    functions.logger.log(`Redirect to ${responseurl}`);
    return response.redirect(responseurl);
  } else {
    // Unsupported method
    response.send(405);
    // response.send(405, "Method Not Allowed");
  }
});

const fakeauth = functions.https.onRequest((request, response) => {
  console.log("request.query.redirect_uri", request.query.redirect_uri);
  const responseurl = util.format(
    "%s?code=%s&state=%s",
    decodeURIComponent(request.query.redirect_uri as string),
    "xxxxxx",
    request.query.state
  );
  functions.logger.log(`Set redirect as ${responseurl}`);
  return response.redirect(
    `/login?responseurl=${encodeURIComponent(responseurl)}`
  );
});

const faketoken = functions.https.onRequest((request, response) => {
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
  } else if (grantType === "refresh_token") {
    obj = {
      token_type: "bearer",
      access_token: "123access",
      expires_in: secondsInDay,
    };
  }
  response.status(HTTP_STATUS_OK).json(obj);
});

export { login, auth, fakeauth, faketoken };
