export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home',
  'Sports',
  'Accessories'
];

export const PRODUCT_CONDITIONS = [
  'New',
  'Used - Like New',
  'Used - Good',
  'Used - Fair'
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' }
];