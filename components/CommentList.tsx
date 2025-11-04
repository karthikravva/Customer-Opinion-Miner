import React from 'react';
import type { CustomerComment, AnalysisResult, Sentiment } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';

interface CommentListProps {
    comments: CustomerComment[];
    analysisResults: AnalysisResult[];
    selectedCommentId: number | null;
    onSelectComment: (id: number) => void;
}

const SentimentIcon: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    switch (sentiment) {
        case 'Positive':
            return <CheckCircleIcon className="text-green-600" />;
        case 'Negative':
            return <ExclamationTriangleIcon className="text-red-600" />;
        case 'Neutral':
            return <InformationCircleIcon className="text-slate-500" />;
        default:
            return null;
    }
};

const CommentList: React.FC<CommentListProps> = ({ comments, analysisResults, selectedCommentId, onSelectComment }) => {
    const analysisMap = new Map<number, AnalysisResult>(analysisResults.map(r => [r.id, r]));

    return (
        <ul className="space-y-2 h-full overflow-y-auto pr-2">
            {comments.map((comment) => {
                const analysis = analysisMap.get(comment.id);
                const isSelected = comment.id === selectedCommentId;
                return (
                    <li
                        key={comment.id}
                        onClick={() => onSelectComment(comment.id)}
                        className={`p-3 rounded-md cursor-pointer transition-all duration-200 border-l-4 ${
                            isSelected
                                ? 'bg-brand-light border-brand-primary'
                                : 'bg-white hover:bg-slate-50 border-transparent'
                        }`}
                        role="button"
                        aria-pressed={isSelected}
                    >
                        <div className="flex justify-between items-start">
                           <div>
                             <p className="font-medium text-sm text-on-surface">{comment.author}</p>
                             <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{comment.comment}</p>
                           </div>
                           {analysis && (
                               <div className="flex-shrink-0 ml-4 mt-1">
                                   <SentimentIcon sentiment={analysis.sentiment} />
                               </div>
                           )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default CommentList;