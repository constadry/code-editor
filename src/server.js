const jsonServer = require('json-server');
const path = require('path');
const express = require('express');

const app = express();
const apiServer = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router(path.join(__dirname, 'data/db.json'));

// JSON Server по пути /api
app.use('/api', middlewares, router);

// Статические файлы Vite
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});