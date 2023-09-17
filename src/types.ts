export type GenerationRequest = {
    prompt: string;
    batch: number;
    clientName: string;
};

export type GenerationResponse = {
    id: string;
    clientName: string;
    uri: string;
};
