import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFile = useCallback((file: File) => {
        if (file) {
            const allowedTypes = ['.csv', '.xlsx', '.xls'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if (allowedTypes.includes(fileExtension)) {
                setFileName(file.name);
                setError(null);
                onFileSelect(file);
            } else {
                setFileName(null);
                setError('Invalid file type. Please upload a CSV or XLSX file.');
            }
        }
    }, [onFileSelect]);

    // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // FIX: Changed event type from React.DragEvent<HTMLDivElement> to React.DragEvent<HTMLLabelElement>
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const fileInputId = 'file-upload-input';

    return (
        <div>
            <label
                htmlFor={fileInputId}
                className={`relative block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200
                ${isDragging ? 'border-brand-primary bg-brand-light' : 'border-outline hover:border-on-surface-variant'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center">
                    <UploadIcon className="h-8 w-8 text-on-surface-variant mb-2" />
                    {fileName ? (
                         <span className="text-sm font-medium text-on-surface">{fileName}</span>
                    ) : (
                         <span className="text-sm text-on-surface-variant">
                            Drag & drop file or <span className="font-semibold text-brand-primary">click to browse</span>
                        </span>
                    )}
                   
                    <input
                        id={fileInputId}
                        name={fileInputId}
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                </div>
            </label>
             {error && <p className="text-red-600 text-xs mt-2 text-left">{error}</p>}
        </div>
    );
};

export default FileUpload;
