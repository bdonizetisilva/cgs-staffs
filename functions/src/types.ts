export interface WhatsappWebhook {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  field: string;
  value: ChangeValue;
}

export interface ChangeValue {
  messaging_product: string;
  metadata: Metadata;
  contacts: Contact[];
  messages?: Message[];
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export interface Message {
  id: string;
  from: string;
  timestamp: string;
  type: string;
  text?: TextMessage;
  button?: ButtonMessage;
}

export interface TextMessage {
  body: string;
}

export interface ButtonMessage {
  payload: string;
  text: string;
}
