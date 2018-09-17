const express = require('express');

const app = express();

app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

app.get('/hello', (req, res) => {
  res.status(200).send('<html><body><h1>All good!</h1></body></html>');
})