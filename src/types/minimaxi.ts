export enum MiniMaxiModel {
    Image01 = 'image-01',
}

export enum MiniMaxiAspectRatio {
    Square = '1:1',
    Portrait = '3:4',
    Landscape = '4:3',
    Wide = '16:9',
}

export interface MiniMaxiSubjectReference {
    type: 'character';
    image_file: string;
}

export interface MiniMaxiRequest {
    model: MiniMaxiModel;
    prompt: string;
    subject_reference: {
        type: string;
        image_file: string;
    }[];
    aspect_ratio: MiniMaxiAspectRatio;
    response_format: 'url';
    n: number;
    prompt_optimizer: boolean;
}

export interface MiniMaxiResponse {
    id: string;
    data: {
        image_urls: string[];
    };
    metadata: {
        failed_count: string;
        success_count: string;
    };
    base_resp: {
        status_code: number;
        status_msg: string;
    };
}
