import React from 'react';
import type { AnalysisResult, Sentiment } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface AnalysisDetailProps {
    analysis: AnalysisResult | null;
}

const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-md inline-flex items-center gap-1.5";
    switch (sentiment) {
        case 'Positive':
            return <div className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircleIcon className="h-4 w-4"/> {sentiment}</div>;
        case 'Negative':
            return <div className={`${baseClasses} bg-red-100 text-red-800`}><ExclamationTriangleIcon className="h-4 w-4"/> {sentiment}</div>;
        case 'Neutral':
            return <div className={`${baseClasses} bg-slate-100 text-slate-800`}><InformationCircleIcon className="h-4 w-4"/> {sentiment}</div>;
        default:
            return null;
    }
};

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ analysis }) => {
    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                <p>Select a comment to see its detailed analysis.</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-sm font-medium text-on-surface-variant mb-2">Sentiment</h3>
                <SentimentBadge sentiment={analysis.sentiment} />
            </div>
            <div>
                <h3 className="text-sm font-medium text-on-surface-variant mb-2">Summary</h3>
                <p className="text-on-surface text-sm bg-surface p-3 rounded-md border border-outline">{analysis.summary}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-on-surface-variant mb-2">Suggested Action</h3>
                <p className="text-on-surface text-sm bg-surface p-3 rounded-md border-l-4 border-brand-primary">{analysis.actionItem}</p>
            </div>
        </div>
    );
};

export default AnalysisDetail;