import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

// const db = admin.firestore();
// const userCollection = "users";

// interface User {
//   firstName: string,
//   lastName: string,
//   email: string,
//   areaNumber: string,
//   department: string,
//   id: string,
//   contactNumber: string
// }

app.get("/messages", async (req, res) => {
  try {
    res.status(200).json({});
  } catch (error) {
    res.status(500).send(error);
  }
});

export const webApi = functions.https.onRequest(main);
