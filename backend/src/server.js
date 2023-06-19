import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { cartItems as cartItemsRaw, products as productsRaw } from './data/temp-data.js';

const uri = "mongodb+srv://energeticpixels:I4AAkWpOTbyStr5y@cluster0.jjeualx.mongodb.net/?retryWrites=true&w=majority"

let cartItems = cartItemsRaw;
let products = productsRaw;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function testDBconn() {
  try {
    // connect client to server
    await client.connect();
    // send a ping to confirm successful conn
    await client.db("admin").command({ ping: 1 });
    console.info("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // ensures that the client will close whenyou finish/error
    await client.close();
  }
};

const app = express();
app.use(express.json());

app.get('/hello', async (req, res) => {
  await client.connect();
  const db = client.db('fullStackAPI');
  const products = await db.collection('products').find({}).toArray();
  res.send(products)
});

function populateCartId(ids) {
  return ids.map(id => products.find(product => product.id === id));
};

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/cart', (req, res) => {
  const populatedCart = populateCartId(cartItems);
  res.json(populatedCart);
});

app.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const product = products.find(product => product.id === productId);
  res.json(product)
});

app.post('/cart', (req, res) => {
  const productId = req.body.id;
  cartItems.push(productId);
  const populatedCart = populateCartId(cartItems);
  res.json(populatedCart);
})

app.delete('/cart/:productId', (req, res) => {
  const productId = req.params.productId;
  cartItems = cartItems.filter(id => id !== productId);
  const populatedCart = populateCartId(cartItems);
  res.json(populatedCart);
})

app.listen(8000, () => {
  //testDBconn();
  console.log('Server is listening on port 8000')
});