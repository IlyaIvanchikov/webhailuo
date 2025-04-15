import { MiniMaxiRequest, MiniMaxiResponse } from '@/types/minimaxi';
import axios from 'axios';

export class MiniMaxiApiService {
    private baseUrl: string;
    private apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    async generateImages(data: MiniMaxiRequest): Promise<MiniMaxiResponse> {
        const response = await axios.post<MiniMaxiResponse>(
            `${this.baseUrl}/v1/image_generation`,
            {
                model: 'image-01',
                prompt: data.prompt,
                subject_reference: [
                    {
                        type: 'character',
                        image_file: data.subject_reference[0].image_file,
                    },
                ],
                aspect_ratio: data.aspect_ratio,
                response_format: 'url',
                n: data.n,
                prompt_optimizer: data.prompt_optimizer,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            },
        );

        return response.data;
    }
}
