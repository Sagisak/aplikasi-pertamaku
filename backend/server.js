import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

const connection = new sqlite3.Database('./db/aplikasi.db');
const userTokens = {};

// Generate a unique token for a user ID
const generateToken = (userId) => {
  const token = uuidv4();
  userTokens[token] = userId; // Store the token with user ID
  return token;
};

// Middleware to validate tokens
const validateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || !userTokens[token]) {
    return res.status(403).send('Forbidden');
  }
  // Attach the user ID to the request object for later use
  req.userId = userTokens[token];
  next();
};

// Securely get user info by ID with token validation
app.get('/api/user/:id', validateToken, (req, res) => {
  const userId = req.params.id;

  // Validate user ID from the request
  if (req.userId !== userId) {
    return res.status(403).send('Access Denied: You do not have permission to access this resource');
  }

  const query = `SELECT name FROM users WHERE id = ?`;
  const params = [userId];

  connection.all(query, params, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    // Generate token for this request (if needed)
    const token = generateToken(userId);

    // Return user data and token
    res.json({ user: results, token });
  });
});

// Change email endpoint with token validation
app.post('/api/user/:id/change-email', validateToken, (req, res) => {
  const userId = req.params.id;
  const newEmail = req.body.newEmail;
  const oldEmail = req.body.oldEmail;

  // Validate user ID, new email, and old email
  if (!userId || !newEmail || !oldEmail) {
    return res.status(400).send('User ID, new email, and old email are required');
  }

  const verifyQuery = `SELECT email FROM users WHERE id = ?`;
  const verifyParams = [userId];

  connection.get(verifyQuery, verifyParams, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Check if the old email matches
    if (!row || row.email !== oldEmail) {
      return res.status(400).send('Old email does not match');
    }

    // Proceed to update the email if the old email matches
    const updateQuery = `UPDATE users SET email = ? WHERE id = ?`;
    const updateParams = [newEmail, userId];

    connection.run(updateQuery, updateParams, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      if (this.changes === 0) {
        return res.status(404).send('User not found');
      }
      return res.status(200).send('Email updated successfully');
    });
  });
});

// Serve files securely
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, 'files', req.query.name);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(err.status).end();
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
