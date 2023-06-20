<template>
  <h1>Shopping Cart</h1>
  <div v-if='cartItems.length > 0'>
    <ShoppingCartList :products='cartItems' />
     <button class='checkout-button'>Proceed to Checkout</button>
  </div>
  <div v-if='cartItems.length === 0'>
    You currently have no items in your cart!
  </div>
</template>

<script>
import axios from 'axios';
import ShoppingCartList from '../components/ShoppingCartList.vue';
// import { cartItems } from '../temp-data';
export default {
  name: "ShoppingCart",
  components: {
    ShoppingCartList
  },
  data() {
    return {
      cartItems: []
    }
  },
  async created() {
    const response = await axios.get('/api/users/123456/cart');
    const cartItems = response.data;
    this.cartItems = cartItems;
  }
}
</script>