import database from "./firestoreBase";

const messagesCollection = "messages";

export interface Message {
  body: string;
  createdAt: Date;
}

const getAllMessages =async () => {
  const collection = await database.collection(messagesCollection).get();
  const docs = await collection.docs;

  return docs;
};

const saveMessage = async (message: Message, from: string, origin: string) => {
  const collection = `${messagesCollection}/${from}/${origin}`;

  await database.collection(collection).add(message);
};

interface MessageRepository {
  getAllMessages: () => Promise<any>
  saveMessage: (message: Message, from: string, origin: string) => Promise<any>
}

const messageRepository = (): MessageRepository => ({
  getAllMessages,
  saveMessage,
});

export default messageRepository;
