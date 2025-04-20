import express from 'express';
import dotenv from 'dotenv';

import { registerUser, loginUser, refreshToken } from './controllers/authController';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Auth Routes
app.post('/register', registerUser);
app.post('/login', loginUser);
app.post('/refresh-token', refreshToken);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
