const express = require('express');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const recipes = require('./recipes.json');

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));
app.use(express.json());

app.use(express.static('public'));

// --- Existing routes ---

app.get('/latest-recipes', (req, res) => {
  res.json(recipes);
});

app.get('/category', (req, res) => {
  res.json(recipes);
});

app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.post('/recipes', (req, res) => {
  const newRecipe = req.body;
  newRecipe.id = recipes.length > 0 ? recipes[recipes.length - 1].id + 1 : 1;
  recipes.push(newRecipe);

  fs.writeFile('./recipes.json', JSON.stringify(recipes, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).json({ success: false, message: 'Failed to save recipe' });
    }
    res.json({ success: true, message: 'Recipe added successfully', recipe: newRecipe });
  });
});

// --- New contact form route ---

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Setup your transporter (update with your own email and app password)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'xiutingchua784@gmail.com', // <-- Replace with your email
      pass: 'kkpzdgafycmhmvra'      // <-- Replace with your Gmail app password
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: 'xiutingchua784@gmail.com', // <-- Your email to receive messages
      subject: `New message from ${name}`,
      text: message
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
