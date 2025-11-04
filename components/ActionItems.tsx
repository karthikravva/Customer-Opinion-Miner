import React, { useState, useMemo } from 'react';
import type { AnalysisResult, Sentiment } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { XIcon } from './icons/XIcon';

interface ActionItemsProps {
    results: AnalysisResult[];
}

type FilterType = 'All' | Sentiment;

const filterButtons: { label: string; value: FilterType, color: string, activeColor: string }[] = [
    { label: 'All', value: 'All', color: 'bg-white hover:bg-slate-50 text-on-surface-variant', activeColor: 'bg-brand-light text-brand-primary' },
    { label: 'Positive', value: 'Positive', color: 'bg-white hover:bg-slate-50 text-on-surface-variant', activeColor: 'bg-green-100 text-green-700' },
    { label: 'Negative', value: 'Negative', color: 'bg-white hover:bg-slate-50 text-on-surface-variant', activeColor: 'bg-red-100 text-red-700' },
    { label: 'Neutral', value: 'Neutral', color: 'bg-white hover:bg-slate-50 text-on-surface-variant', activeColor: 'bg-slate-200 text-slate-700' },
];

const ActionItems: React.FC<ActionItemsProps> = ({ results }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const filteredActionItems = useMemo(() => {
        const allActionItems = results.filter(r => r.actionItem && r.actionItem.toLowerCase() !== 'none');
        if (activeFilter === 'All') {
            return allActionItems;
        }
        return allActionItems.filter(r => r.sentiment === activeFilter);
    }, [results, activeFilter]);

    const emailContent = useMemo(() => {
        const subject = "Action Items from Customer Feedback Analysis";
        const body = "Hi Team,\n\nPlease find the following action items based on the latest customer feedback analysis:\n\n" +
            filteredActionItems.map((item, index) => `${index + 1}. [${item.sentiment} Feedback | ID: ${item.id}]: ${item.actionItem}`).join("\n") +
            "\n\nThanks,\nCustomer Insights Team";
        return `Subject: ${subject}\n\n${body}`;
    }, [filteredActionItems]);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailContent).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setCopyButtonText('Failed to copy');
             setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        });
    };

    if (results.filter(r => r.actionItem && r.actionItem.toLowerCase() !== 'none').length === 0) {
        return <p className="text-on-surface-variant text-center py-8">No specific action items were generated.</p>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4 flex items-center p-1 bg-slate-100 rounded-lg border border-outline w-fit">
                {filterButtons.map(({ label, value, color, activeColor }) => (
                     <button
                        key={value}
                        onClick={() => setActiveFilter(value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${activeFilter === value ? activeColor + ' shadow-sm' : color}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                {filteredActionItems.length > 0 ? (
                    <ul className="space-y-3">
                        {filteredActionItems.map(item => (
                            <li key={item.id} className="bg-surface p-3 rounded-md text-sm text-on-surface border border-outline">
                                {item.actionItem}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-on-surface-variant text-center py-8">No action items for this sentiment.</p>
                )}
            </div>

            <div className="mt-4 flex-shrink-0">
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={filteredActionItems.length === 0}
                    className="w-full bg-brand-primary text-white font-medium py-2 px-4 rounded-md hover:bg-brand-dark transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Generate Email for Team
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
                        <div className="flex justify-between items-center p-4 border-b border-outline">
                            <h2 className="text-lg font-medium text-on-surface">Email for Action Items</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <XIcon />
                            </button>
                        </div>
                        <div className="p-4">
                            <textarea
                                readOnly
                                className="w-full h-64 p-3 font-mono text-sm bg-surface border border-outline rounded-md resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                value={emailContent}
                            />
                        </div>
                        <div className="flex justify-end items-center p-4 bg-surface rounded-b-lg gap-3 border-t border-outline">
                             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-on-surface bg-white border border-outline rounded-md hover:bg-slate-50">
                                Close
                            </button>
                            <button
                                onClick={handleCopyEmail}
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-dark flex items-center gap-2 transition-colors"
                            >
                                <ClipboardIcon />
                                {copyButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionItems;