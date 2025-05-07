export enum KlingAiModel {
    Kling = 'kling',
}

export enum KlingAiMode {
    Std = 'std',
    Pro = 'pro',
}

export enum KlingAiVersion {
    Version10 = '1.0',
    Version15 = '1.5',
    Version16 = '1.6',
}

export enum KlingAiTaskType {
    VideoGeneration = 'video_generation',
    ExtendVideo = 'extend_video',
    LipSync = 'lip_sync',
    Effects = 'effects',
}

export interface KlingAiElement {
    image_url: string;
}

export interface KlingAiInput {
    duration?: number;
    mode?: KlingAiMode;
    prompt?: string;
    elements?: KlingAiElement[];
    negative_prompt?: string;
    version?: KlingAiVersion;
    cfg_scale?: number;
    aspect_ratio?: string;
}

export interface KlingAi {
    model: KlingAiModel;
    input: KlingAiInput;
    task_type: KlingAiTaskType;
}

export interface KlingAiResponse {
    code: number;
    data: {
        task_id: string;
        status: string;
        output?: {
            works?: Array<{
                cover?: {
                    resource: string;
                    resource_without_watermark: string;
                };
                video?: {
                    resource: string;
                    resource_without_watermark: string;
                };
            }>;
        };
    };
}
