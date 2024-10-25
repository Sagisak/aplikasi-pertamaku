import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://20.70.138.106', // Allow your frontend domain to access
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));



const connection = new sqlite3.Database('./db/aplikasi.db');
let userToken = null ; // Store user session tokens

// Middleware to validate tokens
const validateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || !userToken) {
    return res.status(403).send('Forbidden');
  }
  // Attach a placeholder user ID to the request object for later use
  next();
};

// Generate a new session token
const generateToken = () => {
  const token = uuidv4();
  userToken = token; // Store the token without a specific user ID
  return token;
};

// Endpoint to generate and return a token
app.get('/api/user/token', (req, res) => {
  const token = generateToken(); // Generate a token
  res.json({ token }); // Send the token back to the client
});

// Securely get user info by ID with token validation
app.get('/api/user/:id', validateToken, (req, res) => {
  const userId = req.params.id;

  const query = `SELECT name FROM users WHERE id = ?`;
  const params = [userId];

  connection.all(query, params, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }

    // Return user data
    res.json({ user: results });
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
