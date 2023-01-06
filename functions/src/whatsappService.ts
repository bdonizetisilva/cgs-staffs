import {WhatsappWebhook, Entry, Change, Message, Metadata} from "./types";
import messageRepository, {Message as FirebaseMessage}
  from "./messagesRepository";

interface WhatsappService {
  handleWebhook: (webhook: WhatsappWebhook) => void;
}

const parseMessage = (message: Message): FirebaseMessage => {
  switch (message.type) {
    case "text":
      return {body: message.text!.body, createdAt: new Date()};
    case "button":
      return {body: message.button!.text, createdAt: new Date()};
    default:
      return {body: JSON.stringify(message), createdAt: new Date()};
  }
};

const handleSingleMessage = (message: Message, metadata: Metadata): void => {
  const entityToSave = parseMessage(message);
  const messageRepo = messageRepository();
  messageRepo.saveMessage(entityToSave, message.from, "received");

  console.log("Message saved on database", JSON.stringify(entityToSave));
};

const handleSingleChange = (change: Change): void => {
  if (!change.value.messages) {
    return;
  }

  change.value.messages.forEach(
      (message: Message) => handleSingleMessage(message, change.value.metadata)
  );
};

const handleSingleEntry = (entry: Entry): void => {
  if (!entry.changes) {
    return;
  }

  entry.changes.forEach((change: Change) => handleSingleChange(change));
};

const handleWebhook = (webhook: WhatsappWebhook): void => {
  if (!webhook.entry) {
    return;
  }

  webhook.entry.forEach((singleEntry: Entry) => handleSingleEntry(singleEntry));
};

const whatsappService = (): WhatsappService => ({
  handleWebhook,
});

export default whatsappService;
