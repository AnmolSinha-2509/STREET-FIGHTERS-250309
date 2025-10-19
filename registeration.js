// File: /pages/api/register.js (Path for Next.js)

import { promises as fs } from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'data.json');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed. Only POST is allowed.' });
    }

    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all details.' });
    }

    try {
        const fileContents = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(fileContents);

        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const newUser = { username: username, email: email.toLowerCase(), password: password };
        users.push(newUser);

        // Update the JSON file (This is the WRITE operation)
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

        return res.status(201).json({ 
            message: 'Registration successful!', 
            user: { username: newUser.username, email: newUser.email } 
        });

    } catch (error) {
        console.error('Registration/File Write Error:', error);
        return res.status(500).json({ message: 'Internal Server Error: Could not process registration.' });
    }
}
