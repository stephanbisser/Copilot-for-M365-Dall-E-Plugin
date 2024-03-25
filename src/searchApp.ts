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
import { DalleService } from "./dalleService";

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
    const apiKey = ""; // Insert your Azure Open AI API Key here
    const service = new DalleService(apiKey, searchQuery);
    switch (query.commandId ) {
      case 'generateImage':
        console.log('Trying to generate image using Dall-E');
        let response = await service.makeApiCall();
        const template = new ACData.Template(imageCard);
        const card = template.expand({
          $root: {
            prompt: response.data[0].revised_prompt,
            imageUrl: response.data[0].url,
          },
        });
        const preview = CardFactory.heroCard(response.data[0].revised_prompt);
        console.log('Revised Prompt: ', response.data[0].revised_prompt);
        console.log('Image URL: ', response.data[0].url);
        const attachment = { ...CardFactory.adaptiveCard(card), preview };
        attachments.push(attachment);
        return {
          composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
          },
      };    
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