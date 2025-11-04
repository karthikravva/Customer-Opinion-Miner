
import type { CustomerComment } from '../types';

const mockData: CustomerComment[] = [
    {
        id: 1,
        author: 'Alice Johnson',
        comment: "The new dashboard feature is incredibly intuitive! It's saved me hours of work this week. Great job!",
    },
    {
        id: 2,
        author: 'Bob Williams',
        comment: "I've been experiencing frequent crashes since the last update. It's making the app unusable for me. Please fix this ASAP.",
    },
    {
        id: 3,
        author: 'Charlie Brown',
        comment: "The app works as expected. The pricing is fair for the features offered. No complaints.",
    },
    {
        id: 4,
        author: 'Diana Miller',
        comment: "Customer support was amazing. I had an issue with billing, and Sarah resolved it in under 5 minutes. She deserves a raise!",
    },
    {
        id: 5,
        author: 'Ethan Davis',
        comment: "Why was the 'Export to CSV' feature removed? This was essential for my workflow. I might have to look for an alternative product now.",
    },
    {
        id: 6,
        author: 'Fiona Garcia',
        comment: "The user interface looks a bit dated. It's functional, but a visual refresh would be nice.",
    },
];

export const fetchComments = (): CustomerComment[] => {
    // In a real application, this would involve an API call to a backend
    // service that interacts with the Google Sheets API.
    console.log('Fetching mock comments...');
    return mockData;
};
