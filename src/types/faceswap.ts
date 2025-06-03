export interface FaceSwapRequest {
    sourceImage: string;
    targetImage: string;
}

export interface FaceSwapResponse {
    resultUrl: string;
    error?: string;
}
