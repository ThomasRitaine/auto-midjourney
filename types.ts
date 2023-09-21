export type GenerationRequest = {
    prompt: string;
    batch: number;
    collection: string;
};

export type GenerationResponse = {
    id: string;
    collection: string;
    uri: string;
};
