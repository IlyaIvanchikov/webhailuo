export const ASPECT_RATIOS = [
    { value: '1:1', label: '1:1' },
    { value: '16:9', label: '16:9' },
    { value: '4:3', label: '4:3' },
    { value: '3:2', label: '3:2' },
    { value: '2:3', label: '2:3' },
    { value: '3:4', label: '3:4' },
    { value: '9:16', label: '9:16' },
    { value: '21:9', label: '21:9' },
] as const;

export type AspectRatio = (typeof ASPECT_RATIOS)[number]['value'];

export const DEFAULT_FORM_VALUES = {
    prompt: '',
    aspectRatio: '16:9' as AspectRatio,
    n: 2,
    promptOptimizer: true,
} as const;
