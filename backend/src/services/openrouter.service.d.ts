export interface OpenRouterStreamOpts {
    model: string;
    messages: Array<{
        role: string;
        content: string;
    }>;
    userId: string;
    streamId: string;
    temperature?: number;
    max_tokens?: number;
    transforms?: string[];
}
export declare class OpenRouterService {
    private static instance;
    private activeStreams;
    private activeStreamModels;
    static getInstance(): OpenRouterService;
    startAIStream(opts: OpenRouterStreamOpts): Promise<void>;
    private handleStreamComplete;
    stopStream(streamId: string): boolean;
    getActiveStreams(userId: string): string[];
    private estimateTokens;
    calculateCost(model: string, inputTokens: number, outputTokens: number): number;
    getAvailableModels(): Promise<any>;
}
export declare const openRouterService: OpenRouterService;
//# sourceMappingURL=openrouter.service.d.ts.map