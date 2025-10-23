import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', {
      productId,
      quantity
    });
    return response.data;
  },

  async updateCartItem(productId, quantity) {
    const response = await api.put(`/cart/update/${productId}`, {
      quantity
    });
    return response.data;
  },

  async removeFromCart(productId) {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};