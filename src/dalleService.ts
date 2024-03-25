import fetch from 'node-fetch';

export class DalleService {
    private apiKey: string;
    private url: string = ''; //insert your Azure Open AI Endpoint URL here
    private prompt: string;

    constructor(apiKey: string, endpoint: string, prompt: string) {
        this.apiKey = apiKey;
        this.prompt = prompt;
        this.url = endpoint;
    }

    public async makeApiCall(): Promise<any> {
        try {
          const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': `${this.apiKey}`
            },
            body: JSON.stringify({ prompt: this.prompt, n: 1, size: '1024x1024' })
          });
          if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
          }
          console.log("API Call succeeded");
          return await response.json();
        } catch (error) {
          console.error('API call error:', error);
          return null;
        }
      }
}