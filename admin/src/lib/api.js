import { getToken, clearToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function getCategories() {
  return request('/categories');
}

export function createCategory(name) {
  return request('/categories', { method: 'POST', body: JSON.stringify({ name }) });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, { method: 'DELETE' });
}

export function getProducts() {
  return request('/products');
}

export function createProduct(formData) {
  return request('/products', { method: 'POST', body: formData });
}

export function toggleProductStock(id) {
  return request(`/products/${id}/toggle-stock`, { method: 'PATCH' });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' });
}
