import React, { useState, useCallback, useMemo } from 'react';
import type { CustomerComment, AnalysisResult, Sentiment } from './types';
import { fetchComments } from './services/mockSheetService';
import { analyzeComments } from './services/geminiService';
import { parseCommentFile } from './services/fileParserService';
import Header from './components/Header';
import CommentList from './components/CommentList';
import AnalysisDetail from './components/AnalysisDetail';
import SentimentChart from './components/SentimentChart';
import ActionItems from './components/ActionItems';
import FileUpload from './components/FileUpload';
import { GoogleSheetConnector } from './components/GoogleSheetConnector';
import { LoaderIcon } from './components/icons/LoaderIcon';
import { XIcon } from './components/icons/XIcon';

const App: React.FC = () => {
    const [comments, setComments] = useState<CustomerComment[]>([]);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
    const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isSheetConnectorOpen, setIsSheetConnectorOpen] = useState<boolean>(false);


    const resetState = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setComments([]);
        setAnalysisResults([]);
        setSelectedCommentId(null);
        setUploadedFile(null);
    }, []);

    const handleAnalysis = useCallback(async (commentSource: () => Promise<CustomerComment[]> | CustomerComment[]) => {
        resetState();
        try {
            const fetchedComments = await commentSource();
            setComments(fetchedComments);
            if (fetchedComments.length === 0) {
                setError("No comments found to analyze.");
                setIsLoading(false);
                return;
            }
            const results = await analyzeComments(fetchedComments);
            setAnalysisResults(results);
            if (fetchedComments.length > 0) {
                setSelectedCommentId(fetchedComments[0].id);
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    }, [resetState]);

    const handleStartAnalysisFromSheet = useCallback(() => handleAnalysis(fetchComments), [handleAnalysis]);

    const handleAnalyzeFromFile = useCallback(() => {
        if (!uploadedFile) {
            setError("Please upload a file first.");
            return;
        }
        handleAnalysis(() => parseCommentFile(uploadedFile));
    }, [handleAnalysis, uploadedFile]);
    
    const selectedAnalysis = useMemo(() => {
        if (selectedCommentId === null) return null;
        return analysisResults.find(r => r.id === selectedCommentId) || null;
    }, [selectedCommentId, analysisResults]);

    const sentimentData = useMemo(() => {
        const counts = analysisResults.reduce((acc, result) => {
            acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
            return acc;
        }, {} as Record<Sentiment, number>);

        return [
            { name: 'Positive', value: counts.Positive || 0, fill: '#1e8e3e' }, // Google Green
            { name: 'Negative', value: counts.Negative || 0, fill: '#d93025' }, // Google Red
            { name: 'Neutral', value: counts.Neutral || 0, fill: '#5f6368' },  // Google Gray
        ].filter(item => item.value > 0);
    }, [analysisResults]);

    const renderInitialState = () => (
        <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-on-surface mb-2">Welcome to the Customer Opinion Miner</h2>
            <p className="text-lg text-on-surface-variant mb-8 max-w-3xl mx-auto">
                Automatically analyze customer feedback from a Google Sheet or local file to identify sentiment and generate actionable insights.
            </p>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Option 1: Google Sheets */}
                <div className="bg-white p-6 rounded-lg border border-outline h-full flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-medium text-on-surface mb-2">Pull from Google Sheets</h3>
                        <p className="text-on-surface-variant text-sm mb-6">
                            Analyze comments directly from a connected Google Sheet. This demo uses pre-loaded mock data.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsSheetConnectorOpen(true)}
                        className="w-full bg-brand-primary text-white font-medium py-2 px-6 rounded-md shadow-sm hover:bg-brand-dark transition-all duration-200"
                    >
                        Connect & Analyze
                    </button>
                </div>

                {/* Option 2: Upload File */}
                <div className="bg-white p-6 rounded-lg border border-outline h-full flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-medium text-on-surface mb-3">Upload a File</h3>
                        <FileUpload onFileSelect={setUploadedFile} />
                    </div>
                     <button
                        onClick={handleAnalyzeFromFile}
                        disabled={!uploadedFile}
                        className="w-full mt-4 bg-brand-primary text-white font-medium py-2 px-6 rounded-md shadow-sm hover:bg-brand-dark transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Analyze Uploaded File
                    </button>
                </div>
            </div>
        </div>
    );
    
    const renderLoadingState = () => (
         <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg border border-outline mt-8">
            <LoaderIcon className="w-10 h-10 mb-4 text-brand-primary" />
            <h2 className="text-xl font-semibold text-on-surface">Analyzing with Gemini...</h2>
            <p className="text-on-surface-variant mt-2">Extracting sentiment and key actions. This may take a moment.</p>
        </div>
    );

    const renderContent = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Left Column */}
            <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto">
                <div className="bg-white p-4 rounded-lg border border-outline flex-shrink-0">
                    <h2 className="text-lg font-medium mb-3 text-on-surface px-2">Sentiment Overview</h2>
                    <SentimentChart data={sentimentData} />
                </div>
                <div className="bg-white p-4 rounded-lg border border-outline flex-grow">
                     <h2 className="text-lg font-medium mb-3 text-on-surface px-2">Customer Comments</h2>
                    <CommentList
                        comments={comments}
                        analysisResults={analysisResults}
                        selectedCommentId={selectedCommentId}
                        onSelectComment={setSelectedCommentId}
                    />
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-lg border border-outline flex-shrink-0">
                    <h2 className="text-lg font-medium mb-4 text-on-surface">Analysis Details</h2>
                    <AnalysisDetail analysis={selectedAnalysis} />
                </div>
                 <div className="bg-white p-6 rounded-lg border border-outline flex-grow">
                    <h2 className="text-lg font-medium mb-4 text-on-surface">Action Items</h2>
                    <ActionItems results={analysisResults} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-surface font-sans">
            <Header />
            <main className="p-4 md:p-6">
                 {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                        <strong className="font-bold">An error occurred: </strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            aria-label="Close error message"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
                 {isLoading && renderLoadingState()}
                 {!isLoading && analysisResults.length === 0 && renderInitialState()}
                 {!isLoading && analysisResults.length > 0 && renderContent()}
            </main>
             <GoogleSheetConnector 
                isOpen={isSheetConnectorOpen}
                onClose={() => setIsSheetConnectorOpen(false)}
                onAnalyze={handleStartAnalysisFromSheet}
            />
        </div>
    );
};

export default App;