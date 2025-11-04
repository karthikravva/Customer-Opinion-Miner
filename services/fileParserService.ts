import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { CustomerComment } from '../types';

const REQUIRED_HEADERS = ['id', 'author', 'comment'];

const normalizeHeaders = (header: string) => header.trim().toLowerCase();

const validateData = (data: any[]): CustomerComment[] => {
    if (!data || data.length === 0) {
        throw new Error("The file is empty or does not contain any data rows.");
    }

    // Check for required headers by examining the first row
    const firstRow = data[0];
    const headers = Object.keys(firstRow).map(normalizeHeaders);
    
    for (const requiredHeader of REQUIRED_HEADERS) {
        if (!headers.includes(requiredHeader)) {
            throw new Error(`Invalid file format. Missing required column: '${requiredHeader}'. Required columns are: id, author, comment.`);
        }
    }

    return data.map((row, index) => {
        // Find keys in a case-insensitive way
        const idKey = Object.keys(row).find(k => normalizeHeaders(k) === 'id');
        const authorKey = Object.keys(row).find(k => normalizeHeaders(k) === 'author');
        const commentKey = Object.keys(row).find(k => normalizeHeaders(k) === 'comment');

        const id = Number(row[idKey!]);
        const author = row[authorKey!];
        const comment = row[commentKey!];

        if (isNaN(id) || !author || !comment) {
             throw new Error(`Invalid data in row ${index + 2}. Please ensure 'id' is a number, and 'author' and 'comment' are not empty.`);
        }
        
        return {
            id,
            author: String(author),
            comment: String(comment)
        };
    });
};

export const parseCommentFile = (file: File): Promise<CustomerComment[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                if (!event.target?.result) {
                    return reject(new Error('Failed to read file.'));
                }
                
                let parsedData: any[];

                if (file.name.endsWith('.csv')) {
                    const csvText = event.target.result as string;
                    const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
                    
                    if (result.errors.length) {
                        console.error('CSV Parsing Errors:', result.errors);
                        throw new Error(`Error parsing CSV file: ${result.errors[0].message}`);
                    }
                    parsedData = result.data;

                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    const data = new Uint8Array(event.target.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    parsedData = XLSX.utils.sheet_to_json(worksheet);

                } else {
                    return reject(new Error('Unsupported file type. Please upload a .csv or .xlsx file.'));
                }
                
                resolve(validateData(parsedData));

            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading the file.'));
        };
        
        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
};