import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticator } from 'otplib';
import { ADMIN_OTP_SECRET } from '../constants';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const isValid = authenticator.check(token, ADMIN_OTP_SECRET);

        if (isValid) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
