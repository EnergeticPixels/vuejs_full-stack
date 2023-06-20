<template>
  <div v-if='product'>
    <div class='img-wrap'>
      <img v-bind:src='product.imageUrl' />
    </div>
    <div class='product-details'>
      <h1>{{ product.name }}</h1>
      <h3 class='price'>{{ product.price }}</h3>
      <button @click='addToCart' class='add-to-cart' v-if='!itemIsInCart'>Add to Cart</button>
      <button class='add-to-cart grey-button' v-if='itemIsInCart'>Item is already in cart</button>
    </div>
  </div>
  <div v-if='!product'>
    <NotFoundPage />
  </div>

</template>

<script>
import axios from 'axios';
// import { products } from '../temp-data';
import NotFoundPage from './NotFoundPage';
export default {
  name: "ProductDetail",
  data() {
    return {
      product: {},
      cartItems: []
    }
  },
  computed: {
    itemIsInCart() {
      return this.cartItems.some(item => item.id === this.$route.params.productId);
    }
  },
  methods: {
    async addToCart() {
      await axios.post('/api/users/123456/cart', { id: this.$route.params.productId });
      alert('Successfully added item to cart');
    } 
  },
  components: {
    NotFoundPage
  },
  async created() {
    const response = await axios.get(`/api/products/${this.$route.params.productId}`);
    const product = response.data;
    this.product = product;

    const cartResponse = await axios.get('/api/users/123456/cart');
    const cartItems = cartResponse.data;
    this.cartItems = cartItems;
  }
}
</script>