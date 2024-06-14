// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
  // 더 많은 제품을 여기에 추가할 수 있습니다.
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
