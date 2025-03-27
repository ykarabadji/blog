import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import usersAuth from './routers/usersAuth/usersAuth.js';  // Removed space in the path
import postConfig from './routers/postConfig/postConfig.js'
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
const PORT = process.env.PORT || 3636;

// Serve the registration page at /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Use the usersAuth router for all /auth routes
app.use('/auth', usersAuth);
app.use ('/fetching',postConfig);
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

