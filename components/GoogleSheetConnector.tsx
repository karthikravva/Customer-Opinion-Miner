import React, { useState, useEffect } from 'react';
import { GoogleSheetsIcon } from './icons/GoogleSheetsIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { XIcon } from './icons/XIcon';

interface GoogleSheetConnectorProps {
    isOpen: boolean;
    onClose: () => void;
    onAnalyze: () => void;
}

export const GoogleSheetConnector: React.FC<GoogleSheetConnectorProps> = ({ isOpen, onClose, onAnalyze }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [sheetUrl, setSheetUrl] = useState('');

    const handleConnect = () => {
        setIsConnecting(true);
        // Simulate OAuth flow
        setTimeout(() => {
            setIsConnecting(false);
            setIsConnected(true);
        }, 1500);
    };

    const handleAnalyze = () => {
        // Basic URL validation
        if (!sheetUrl.startsWith('https://docs.google.com/spreadsheets/')) {
            alert('Please enter a valid Google Sheet URL.');
            return;
        }
        onAnalyze();
        onClose(); // Close the modal after starting analysis
    };
    
    // Reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setIsConnecting(false);
                setIsConnected(false);
                setSheetUrl('');
            }, 300); // Delay reset to allow for closing animation
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all">
                <div className="flex justify-between items-center p-4 border-b border-outline">
                    <div className="flex items-center gap-3">
                        <GoogleSheetsIcon className="h-6 w-6" />
                        <h2 className="text-lg font-medium text-on-surface">Connect to Google Sheets</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Step 1: Connection */}
                    <div>
                        <div className="flex items-center justify-between">
                             <h3 className="text-md font-medium text-on-surface">Step 1: Authorize Access</h3>
                             {isConnected && (
                                <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-md">Connected</span>
                             )}
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1 mb-3">
                            Connect your Google account to read data from your spreadsheets. (This is a simulated connection for demo purposes.)
                        </p>
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting || isConnected}
                            className="w-full bg-white border border-outline text-on-surface font-medium py-2 px-4 rounded-md hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        >
                            {isConnecting ? (
                                <>
                                 <LoaderIcon className="w-5 h-5 text-on-surface-variant" />
                                 <span>Connecting...</span>
                                </>
                            ) : isConnected ? (
                                'Successfully Connected'
                            ) : (
                                'Connect to Google Sheets'
                            )}
                        </button>
                    </div>

                    {/* Step 2: Input URL */}
                    <div className={!isConnected ? 'opacity-40' : ''}>
                        <h3 className="text-md font-medium text-on-surface">Step 2: Provide Sheet URL</h3>
                         <p className="text-sm text-on-surface-variant mt-1 mb-3">
                           Paste the URL of the Google Sheet you want to analyze. Ensure it's shared correctly.
                        </p>
                        <input
                            type="url"
                            value={sheetUrl}
                            onChange={(e) => setSheetUrl(e.target.value)}
                            disabled={!isConnected}
                            placeholder="https://docs.google.com/spreadsheets/d/..."
                            className="w-full p-2 border border-outline rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:bg-slate-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center p-4 bg-surface rounded-b-lg gap-3 border-t border-outline">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-on-surface bg-white border border-outline rounded-md hover:bg-slate-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={!isConnected || !sheetUrl}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-dark flex items-center gap-2 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Fetch & Analyze
                    </button>
                </div>
            </div>
        </div>
    );
};