// File: /pages/api/login.js OR /app/api/login/route.js (for Next.js)

import { promises as fs } from 'fs';
import path from 'path';

// Define the path to your data.json file
const usersFilePath = path.join(process.cwd(), 'data', 'data.json');

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // 1. JSON file ko read karein
    const fileContents = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    // 2. User ko dhoondhein aur password match karein
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      // Login successful
      // Session/Token creation skipped due to "no security" requirement
      return res.status(200).json({ 
        message: 'Login Successful', 
        user: { username: user.username, email: user.email }
      });
    } else {
      // Credentials not matched
      return res.status(401).json({ message: 'Invalid Credentials.' });
    }
  } catch (error) {
    console.error('Error reading user file:', error);
    // Agar file na mili, toh bhi error return karein
    if (error.code === 'ENOENT') {
         return res.status(500).json({ message: 'Server configuration error (Data file missing).' });
    }
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
}


