import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
//import { cartItems as cartItemsRaw, products as productsRaw } from './data/temp-data.js';

import path from 'node:path';


//let cartItems = cartItemsRaw;
//let products = productsRaw;


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

async function start() {

  // make sure to correct the connection URI before launching this api
  const uri = "mongodb+srv://energeticpixels:XXXXXXXXXXXXXXX@cluster0.XXXXXXXXXXXX.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  const db = client.db('fullStackAPI');

  const app = express();
  app.use(express.json());
  app.use('./images', express.static(path.join(`/assets`)));

  app.get('/api/hello', async (req, res) => {
    res.send('Hello');
  });

  async function populateCartId(ids) {
    return Promise.all(ids.map(id => db.collection('products').findOne({ id })));
  };

  app.get('/api/products', async (req, res) => {
    const products = await db.collection('products').find({}).toArray();
    res.send(products);
  });

  app.get('/api/users/:userId/cart', async (req, res) => {
    const user = await db.collection('users').findOne({ id: req.params.userId });
    const populatedCart = await populateCartId(user.cartItems);
    res.json(populatedCart);
  });

  app.get('/api/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const product = await db.collection('products').findOne({ id: productId });
    res.json(product);
  });

  app.post('/api/users/:userId/cart', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;

    await db.collection('users').updateOne({ id: userId }, {
      $addToSet: { cartItems: productId }
    });
    const user = await db.collection('users').findOne({ id: req.params.userId });
    const populatedCart = await populateCartId(user.cartItems);
    res.json(populatedCart);
  });

  app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    await db.collection('users').updateOne({ id: userId }, {
      $pull: { cartItems: productId }
    });
    const user = await db.collection('users').findOne({ id: req.params.userId });
    const populatedCart = await populateCartId(user.cartItems);
    res.json(populatedCart);
  });

  app.listen(8000, () => {
    //testDBconn();
    console.log('Server is listening on port 8000');
  });
}

start();
