import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import imageCard from "./adaptiveCards/imageCard.json";

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search.
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {
    const searchQuery = query.parameters[0].value;
    const attachments = [];
    const apiKey = "8912098bb25441478fcde7cf366113c4";
    switch (query.commandId ) {
      case 'generateImage':
        console.log('Trying to generate image using Dall-E');
        const url = "https://solvionat-azureopenai.openai.azure.com/openai/deployments/dalle-3/images/generations?api-version=2024-02-15-preview";
        const axiosConfig: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          } as RawAxiosRequestHeaders,
        };
        try {
          const axiosBody = { prompt: searchQuery, n: 1, size: '1024x1024' };
          //const response: AxiosResponse = await axios.post(url, axiosBody , axiosConfig);
          axios.post(url, axiosBody , axiosConfig).then(response =>{
            const template = new ACData.Template(imageCard);
            console.log(response.data.data[0].revised_prompt);
            console.log(response.data.data[0].url);
            console.log(response.data.data[0]);
            const card = template.expand({
              $root: {
                prompt: response.data.data[0].revised_prompt,
                imageUrl: response.data.data[0].url,
              },
            });
            const preview = CardFactory.heroCard(response.data.data[0].revised_prompt);
            const attachment = { ...CardFactory.adaptiveCard(card), preview };
            attachments.push(attachment);
            return {
              composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: attachments,
              },
          };
          })
          .catch(error => {
            console.error(error);
          });
        }
        catch (error) {
          console.error(error);
          
        }
        break;
      default:
        break;
      } 
      return {
        composeExtension: {
          type: "result",
          attachmentLayout: "list",
          attachments: attachments,
        },
    };
  }
}
