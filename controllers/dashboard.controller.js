import express from 'express';

const dashboardController = express.Router();

dashboardController.get('/', (req, res) => {
  const contacts = [
    { username: 'brack obama', email: 'obama@gmail.com' },
    { username: 'rooney', email: 'rooney@gmail.com' },
  ];
  if (!req.session.username) {
    res.redirect('/login');
  } else {
    res.render('dashboard', { username: req.session.username, contacts });
  }
});

export default dashboardController;
