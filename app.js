const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { word: null, definition: null, notFound: false });
});

app.post('/search', (req, res) => {
  const query = req.body.search;
  let word = null;
  let definition = null;

  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.word === query) {
        word = row.word;
        definition = row.definition;
      }
    })
    .on('end', () => {
      res.render('index', { word, definition, notFound: !word });
    });
});

app.listen(7560, () => {
  console.log('Server is running on http://localhost:7560');
});
