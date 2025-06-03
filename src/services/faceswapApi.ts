import axios from 'axios';
import { FaceSwapRequest, FaceSwapResponse } from '@/types/faceswap';

export class FaceSwapApiService {
    private readonly apiKey: string;
    private readonly apiHost: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiHost = 'faceswap-image-transformation-api.p.rapidapi.com';
    }

    async swapFaces(request: FaceSwapRequest): Promise<FaceSwapResponse> {
        try {
            const options = {
                method: 'POST',
                url: 'https://faceswap-image-transformation-api.p.rapidapi.com/faceswapbase64',
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': this.apiHost,
                    'Content-Type': 'application/json',
                },
                data: {
                    SourceImageBase64Data: request.sourceImage,
                    TargetImageBase64Data: request.targetImage,
                },
            };

            const response = await axios.request(options);
            return {
                resultUrl: response.data.ResultImageUrl,
            };
        } catch (error: { [key: string]: unknown }) {
            console.error('Face swap error:', error);
            let errorMessage = 'Failed to perform face swap';
            const data = error.response && error.response.data;
            if (data) {
                if (data.Errors && typeof data.Errors === 'object') {
                    // Collect all error messages from nested Errors object
                    errorMessage = Object.values(data.Errors).flat().join(' ');
                } else if (data.Message || data.message) {
                    errorMessage = data.Message || data.message;
                }
            }
            return {
                resultUrl: '',
                error: errorMessage,
            };
        }
    }
}
