const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function getCategories() {
  return request('/categories');
}

export function getProducts({ category } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  const qs = params.toString();
  return request(`/products${qs ? `?${qs}` : ''}`);
}

export function logOrderInquiry(productId) {
  return request(`/products/${productId}/inquiries`, { method: 'POST', body: JSON.stringify({}) });
}
