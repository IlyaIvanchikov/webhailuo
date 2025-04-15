import { KlingAi, KlingAiResponse } from '@/types/kling';

export class KlingApiService {
    private readonly baseUrl: string;
    private readonly apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    public async generateVideo(data: KlingAi): Promise<KlingAiResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            body: JSON.stringify(data),
        });

        return response.json();
    }

    public async getTaskStatus(taskId: string): Promise<KlingAiResponse> {
        const response = await fetch(`${this.baseUrl}/api/v1/task/${taskId}`, {
            headers: {
                'x-api-key': this.apiKey,
            },
        });

        return response.json();
    }
}
