
import handler from './api/docentes';
import { VercelRequest, VercelResponse } from '@vercel/node';

const req = {
    method: 'GET',
    body: {},
    query: {},
} as unknown as VercelRequest;

const res = {
    status: (code: number) => {
        console.log(`Status: ${code}`);
        return res;
    },
    json: (data: any) => {
        console.log('JSON Response:', JSON.stringify(data, null, 2));
        return res;
    },
    setHeader: (name: string, value: string) => {
        console.log(`Set Header: ${name}=${value}`);
        return res;
    },
    end: (message: string) => {
        console.log(`End: ${message}`);
        return res;
    }
} as unknown as VercelResponse;

try {
    console.log("Attempting to run handler...");
    handler(req, res);
    console.log("Handler executed successfully.");
} catch (error) {
    console.error("Handler crashed:", error);
}
