import axios from "axios";

interface WhatsappRepository {
  sendTemplatedMessage: (
    to: string,
    template: string,
    headerParameters?: string[],
    bodyParameters?: string[]
  ) => Promise<any>
}

const createWhatsappRepository = (): WhatsappRepository => {
  // const baseURL = "https://graph.facebook.com/v15.0/106507722324578";
  const baseURL = "https://graph.facebook.com/v15.0/111603975147993";
  const token = process.env.WHATSAPP_API_TOKEN;

  const whatsappRepository = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${token}`},
  });

  const whatsappFetcher = (method: string, path: string, body?: any) =>
    whatsappRepository(path, {method, data: body}).then((r) => r.data);

  const sendTemplatedMessage = (
      to: string,
      template: string,
      headerParameters?: string[],
      bodyParameters?: string[],
  ): Promise<any> => {
    const components = [];

    if (headerParameters != null) {
      components.push(buildComponent("header", headerParameters));
    }

    if (bodyParameters != null) {
      components.push(buildComponent("body", bodyParameters));
    }

    return whatsappFetcher(
        "post",
        "/messages",
        {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: template,
            language: {code: "pt_BR"},
            components,
          },
        },
    );
  };

  const buildComponent = (type: string, parameters: string[]) => ({
    type,
    parameters: parameters
        .map((parameter) => ({type: "text", text: parameter})),
  });

  return {
    sendTemplatedMessage,
  };
};

export default createWhatsappRepository;
