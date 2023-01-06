import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import whatsappClient from "./whatsappClient";
import whatsappSerciceImport from "./whatsappService";
import messageRepository from "./messagesRepository";

const app = express();
const main = express();
const whatsappClientApi = whatsappClient();
const whatsappService = whatsappSerciceImport();
const messageRepo = messageRepository();

main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

interface BatchItem {
  phone: string,
  headerParameters?: string[],
  bodyParameters?: string[],
}

app.get("/messages", async (req, res) => {
  const messages = await messageRepo.getAllMessages();

  res.status(200).json(messages);
});

app.get("/messages/webhooks", async (req, res) => {
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == process.env.WEBHOOK_TOKEN
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});

app.post("/messages/webhooks", async (req, res) => {
  console.log("New webhook:", JSON.stringify(req.body));

  try {
    whatsappService.handleWebhook(req.body);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/messages/template/:template/phone/:phone", async (req, res) => {
  const {template, phone} = req.params;
  const {headerParameters, bodyParameters} = req.body;

  whatsappClientApi
      .sendTemplatedMessage(phone, template, headerParameters, bodyParameters)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(500).send(error));
});

app.post("/messages/template/:template/batch", async (req, res) => {
  const {template} = req.params;
  const {messageList} = req.body;

  const promisses = messageList.map((message: BatchItem) => {
    whatsappClientApi.sendTemplatedMessage(
        message.phone,
        template,
        message.headerParameters,
        message.bodyParameters
    );
  });

  Promise.all(promisses)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(500).send(error));
});

export const whatsapp = functions
    .runWith({secrets: ["WEBHOOK_TOKEN", "WHATSAPP_API_TOKEN"]})
    .https
    .onRequest(main);
