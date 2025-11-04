
export type Sentiment = 'Positive' | 'Negative' | 'Neutral';

export interface CustomerComment {
    id: number;
    author: string;
    comment: string;
}

export interface AnalysisResult {
    id: number;
    sentiment: Sentiment;
    summary: string;
    actionItem: string;
}
