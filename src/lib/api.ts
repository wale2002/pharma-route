// import axios from "axios";
// import { AxiosRequestConfig } from "axios";

// const API_BASE_URL = "http://localhost:5000/api"; // Changed back to local for development

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Added for cookie-based auth (JWT in cookies)
// });

// // Axios error handler to mimic fetch's throw on !ok
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status >= 400) {
//       const message = error.response?.data?.message || "API request failed";
//       return Promise.reject(new Error(message));
//     }
//     return Promise.reject(error);
//   }
// );

// export interface User {
//   id: string;
//   email: string;
//   role: "clinic" | "pharmacy" | "rider";
//   name: string;
//   phone?: string;
//   organization?: string;
//   address?: string;
// }

// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   quantity: number;
//   imageUrl?: string;
//   category: string;
//   pharmacyId: string | Partial<User>; // Updated for populated name
//   createdAt: string;
// }

// interface SelectedProduct {
//   productId: string;
//   quantity: number;
//   productName?: string; // Optional, added by backend
// }

// export interface DrugRequest {
//   _id: string;
//   clinicId: string | Partial<User>; // Updated for populated name/organization/phone
//   clinicName: string;
//   type: "photo" | "inventory";
//   photoUrls?: string[]; // Updated to array for multiple photos
//   selectedProducts?: SelectedProduct[];
//   deliveryAddress: string;
//   patientInfo?: string;
//   status: string;
//   rejectionReason?: string;
//   createdAt: string;
//   updatedAt: string;
//   order?: Order; // Optional, attached for confirmed requests in history
// }

// interface OrderItem {
//   productId: string; // Added, from backend
//   productName: string;
//   quantity: number;
//   price: number; // Added, from backend
// }

// export interface Order {
//   // Expanded to match backend fully
//   _id: string;
//   requestId: string; // Added
//   clinicId: string | Partial<User>; // Added, populated name/phone
//   pharmacyId: string | Partial<User>; // Added, populated name/phone
//   riderId?: string | Partial<User>; // Added, populated name/phone
//   items: OrderItem[]; // Updated type
//   deliveryAddress: string;
//   totalAmount: number;
//   status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered";
//   estimatedDeliveryTime?: string; // Added, optional
//   createdAt: string;
//   updatedAt?: string; // Added, from updates
// }

// interface Pagination {
//   current: number;
//   pages: number;
//   total: number;
// }

// interface Paginated<T> {
//   data: T[];
//   pagination: Pagination;
// }

// // Auth
// export async function register(data: {
//   email: string;
//   password: string;
//   role: "clinic" | "pharmacy" | "rider";
//   name: string;
//   organization?: string;
//   address?: string;
//   phone?: string;
// }): Promise<{ success: boolean; token: string; user: User }> {
//   const response = await api.post("/auth/register", data);
//   return response.data;
// }

// export async function login(data: {
//   email: string;
//   password: string;
// }): Promise<{ success: boolean; token: string; user: User }> {
//   const response = await api.post("/auth/login", data);
//   return response.data;
// }

// export async function logout(): Promise<{ success: boolean; message: string }> {
//   const response = await api.post("/auth/logout");
//   return response.data;
// }

// // Products
// export async function getInventory(
//   page: number = 1,
//   limit: number = 10,
//   search: string = "",
//   filter: string = ""
// ): Promise<Paginated<Product>> {
//   const params = {
//     page: page.toString(),
//     limit: limit.toString(),
//     search,
//     filter,
//   };
//   const response = await api.get("/products", { params });
//   return {
//     data: response.data.products,
//     pagination: response.data.pagination,
//   };
// }

// export async function addProduct(
//   data: {
//     name: string;
//     description: string;
//     category: string;
//     price: number;
//     quantity: number;
//   },
//   file?: File
// ): Promise<Product> {
//   const formData = new FormData();
//   formData.append("name", data.name);
//   formData.append("description", data.description);
//   formData.append("category", data.category);
//   formData.append("price", data.price.toString());
//   formData.append("quantity", data.quantity.toString());
//   if (file) {
//     formData.append("image", file);
//   }
//   // Axios auto-sets multipart/form-data header for FormData
//   const response = await api.post("/products", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// }

// export async function updateProduct(
//   id: string,
//   data: Partial<{
//     name: string;
//     description: string;
//     category: string;
//     price: number;
//     quantity: number;
//   }>,
//   file?: File
// ): Promise<Product> {
//   const formData = new FormData();
//   Object.entries(data).forEach(([key, value]) => {
//     if (value !== undefined) {
//       formData.append(key, value.toString());
//     }
//   });
//   if (file) {
//     formData.append("image", file);
//   }
//   const response = await api.put(`/products/${id}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// }

// export async function deleteProduct(id: string): Promise<{ message: string }> {
//   const response = await api.delete(`/products/${id}`);
//   return response.data;
// }

// // Requests
// export async function submitPhotoRequest(
//   data: {
//     deliveryAddress: string;
//     patientInfo?: string;
//   },
//   files: File[] // Updated to accept multiple files
// ): Promise<DrugRequest> {
//   const formData = new FormData();
//   formData.append("deliveryAddress", data.deliveryAddress);
//   if (data.patientInfo) {
//     formData.append("patientInfo", data.patientInfo);
//   }
//   files.forEach((file) => {
//     formData.append("photos", file); // Backend expects 'photos' array
//   });
//   const response = await api.post("/requests/photo", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// }

// export async function submitInventoryRequest(data: {
//   selectedProducts: { productId: string; quantity: number }[];
//   deliveryAddress: string;
//   patientInfo?: string;
// }): Promise<DrugRequest> {
//   const response = await api.post("/requests/inventory", data);
//   return response.data;
// }

// export async function getUserRequests(
//   page: number = 1,
//   limit: number = 10,
//   search: string = "",
//   filter: string = ""
// ): Promise<Paginated<DrugRequest>> {
//   const params = {
//     page: page.toString(),
//     limit: limit.toString(),
//     search,
//     filter,
//   };
//   const response = await api.get("/requests/user", { params });
//   return {
//     data: response.data.requests,
//     pagination: response.data.pagination,
//   };
// }

// export async function getClinicRequestHistory(
//   page: number = 1,
//   limit: number = 10,
//   search: string = "",
//   filter: string = ""
// ): Promise<Paginated<DrugRequest>> {
//   const params = {
//     page: page.toString(),
//     limit: limit.toString(),
//     search,
//     filter,
//   };
//   const response = await api.get("/requests/clinic/history", { params });
//   return {
//     data: response.data.requests,
//     pagination: response.data.pagination,
//   };
// }

// export async function getPendingRequests(
//   page: number = 1,
//   limit: number = 10,
//   search: string = "",
//   filter: string = ""
// ): Promise<Paginated<DrugRequest>> {
//   const params = {
//     page: page.toString(),
//     limit: limit.toString(),
//     search,
//     filter,
//   };
//   const response = await api.get("/requests/pending", { params });
//   return {
//     data: response.data.requests,
//     pagination: response.data.pagination,
//   };
// }

// export async function addItemsToPhotoRequest(
//   id: string,
//   selectedProducts: { productId: string; quantity: number }[]
// ): Promise<{ message: string; request: DrugRequest }> {
//   const response = await api.patch(`/requests/${id}/add-items`, {
//     selectedProducts,
//   });
//   return response.data;
// }

// export async function confirmRequest(id: string): Promise<Order> {
//   const response = await api.put(`/requests/${id}/confirm`);
//   return response.data;
// }

// export async function rejectRequest(
//   id: string,
//   reason: string
// ): Promise<{ message: string; request?: DrugRequest }> {
//   const response = await api.put(`/requests/${id}/reject`, { reason });
//   return response.data;
// }

// // Download endpoints
// export async function downloadPhoto(id: string, index: number): Promise<Blob> {
//   const response = await api.get(`/requests/${id}/download-photo/${index}`, {
//     responseType: "blob",
//   });
//   return response.data;
// }

// export async function downloadAllPhotos(id: string): Promise<Blob> {
//   const response = await api.get(`/requests/${id}/download-all-photos`, {
//     responseType: "blob",
//   });
//   return response.data;
// }

// // Orders
// export async function getAvailableOrders(
//   page: number = 1,
//   limit: number = 10,
//   search: string = "",
//   filter: string = ""
// ): Promise<Paginated<Order>> {
//   const params = {
//     page: page.toString(),
//     limit: limit.toString(),
//     search,
//     filter,
//   };
//   const response = await api.get("/orders/available", { params });
//   return {
//     data: response.data.orders,
//     pagination: response.data.pagination,
//   };
// }

// export async function getUserOrders(
//   page: number = 1,
//   limit: number = 10,
//   search: string = "",
//   filter: string = ""
// ): Promise<Paginated<Order>> {
//   const params = {
//     page: page.toString(),
//     limit: limit.toString(),
//     search,
//     filter,
//   };
//   const response = await api.get("/orders/user", { params });
//   return {
//     data: response.data.orders,
//     pagination: response.data.pagination,
//   };
// }

// export async function acceptOrder(id: string): Promise<Order> {
//   const response = await api.put(`/orders/${id}/accept`);
//   return response.data;
// }

// export async function updateOrderStatus(
//   id: string,
//   status: string
// ): Promise<Order> {
//   const response = await api.put(`/orders/${id}/status`, { status });
//   return response.data;
// }

import axios from "axios";
import { AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Changed back to local for development

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Added for cookie-based auth (JWT in cookies)
});

// Axios error handler to mimic fetch's throw on !ok
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status >= 400) {
      const message = error.response?.data?.message || "API request failed";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  role: "clinic" | "pharmacy" | "rider";
  name: string;
  phone?: string;
  organization?: string;
  address?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: string;
  pharmacyId: string | Partial<User>; // Updated for populated name
  createdAt: string;
}

interface SelectedProduct {
  productId: string;
  quantity: number;
  productName?: string; // Optional, added by backend
}

export interface DrugRequest {
  _id: string;
  clinicId: string | Partial<User>; // Updated for populated name/organization/phone
  clinicName: string;
  type: "photo" | "inventory";
  photoUrls?: string[]; // Updated to array for multiple photos
  photoUrl?: string; // Legacy single photo
  selectedProducts?: SelectedProduct[];
  deliveryAddress: string;
  patientInfo?: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  order?: Order; // Optional, attached for confirmed requests in history
}

interface OrderItem {
  productId: string; // Added, from backend
  productName: string;
  quantity: number;
  price: number; // Added, from backend
}

export interface Order {
  // Expanded to match backend fully
  _id: string;
  requestId: string; // Added
  clinicId: string | Partial<User>; // Added, populated name/phone
  pharmacyId: string | Partial<User>; // Added, populated name/phone
  riderId?: string | Partial<User>; // Added, populated name/phone
  items: OrderItem[]; // Updated type
  deliveryAddress: string;
  totalAmount: number;
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered";
  estimatedDeliveryTime?: string; // Added, optional
  createdAt: string;
  updatedAt?: string; // Added, from updates
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

// Auth
export async function register(data: {
  email: string;
  password: string;
  role: "clinic" | "pharmacy" | "rider";
  name: string;
  organization?: string;
  address?: string;
  phone?: string;
}): Promise<{ success: boolean; token: string; user: User }> {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; token: string; user: User }> {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await api.post("/auth/logout");
  return response.data;
}

// Products
export async function getInventory(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filter: string = ""
): Promise<Paginated<Product>> {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter,
  };
  const response = await api.get("/products", { params });
  return {
    data: response.data.products,
    pagination: response.data.pagination,
  };
}

export async function addProduct(
  data: {
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
  },
  file?: File
): Promise<Product> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("price", data.price.toString());
  formData.append("quantity", data.quantity.toString());
  if (file) {
    formData.append("image", file);
  }
  // Axios auto-sets multipart/form-data header for FormData
  const response = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
  }>,
  file?: File
): Promise<Product> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  if (file) {
    formData.append("image", file);
  }
  const response = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}

// Requests
export async function submitPhotoRequest(
  data: {
    deliveryAddress: string;
    patientInfo?: string;
  },
  files: File[] // Updated to accept multiple files
): Promise<DrugRequest> {
  const formData = new FormData();
  formData.append("deliveryAddress", data.deliveryAddress);
  if (data.patientInfo) {
    formData.append("patientInfo", data.patientInfo);
  }
  files.forEach((file) => {
    formData.append("photos", file); // Backend expects 'photos' array
  });
  const response = await api.post("/requests/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function submitInventoryRequest(data: {
  selectedProducts: { productId: string; quantity: number }[];
  deliveryAddress: string;
  patientInfo?: string;
}): Promise<DrugRequest> {
  const response = await api.post("/requests/inventory", data);
  return response.data;
}

export async function getUserRequests(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filter: string = ""
): Promise<Paginated<DrugRequest>> {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter,
  };
  const response = await api.get("/requests/user", { params });
  return {
    data: response.data.requests,
    pagination: response.data.pagination,
  };
}

export async function getClinicRequestHistory(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filter: string = ""
): Promise<Paginated<DrugRequest>> {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter,
  };
  const response = await api.get("/requests/clinic/history", { params });
  return {
    data: response.data.requests,
    pagination: response.data.pagination,
  };
}

export async function getPendingRequests(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filter: string = ""
): Promise<Paginated<DrugRequest>> {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter,
  };
  const response = await api.get("/requests/pending", { params });
  return {
    data: response.data.requests,
    pagination: response.data.pagination,
  };
}

export async function addItemsToPhotoRequest(
  id: string,
  selectedProducts: { productId: string; quantity: number }[]
): Promise<{ message: string; request: DrugRequest }> {
  const response = await api.patch(`/requests/${id}/add-items`, {
    selectedProducts,
  });
  return response.data;
}

export async function confirmRequest(id: string): Promise<Order> {
  const response = await api.put(`/requests/${id}/confirm`);
  return response.data;
}

export async function rejectRequest(
  id: string,
  reason: string
): Promise<{ message: string; request?: DrugRequest }> {
  const response = await api.put(`/requests/${id}/reject`, { reason });
  return response.data;
}

// Download endpoints
export async function downloadPhoto(id: string, index: number): Promise<Blob> {
  const response = await api.get(`/requests/${id}/download-photo/${index}`, {
    responseType: "blob",
  });
  return response.data;
}

export async function downloadAllPhotos(id: string): Promise<Blob> {
  const response = await api.get(`/requests/${id}/download-all-photos`, {
    responseType: "blob",
  });
  return response.data;
}

// Orders
export async function getAvailableOrders(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filter: string = ""
): Promise<Paginated<Order>> {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter,
  };
  const response = await api.get("/orders/available", { params });
  return {
    data: response.data.orders,
    pagination: response.data.pagination,
  };
}

export async function getUserOrders(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  filter: string = ""
): Promise<Paginated<Order>> {
  const params = {
    page: page.toString(),
    limit: limit.toString(),
    search,
    filter,
  };
  const response = await api.get("/orders/user", { params });
  return {
    data: response.data.orders,
    pagination: response.data.pagination,
  };
}

export async function acceptOrder(id: string): Promise<Order> {
  const response = await api.put(`/orders/${id}/accept`);
  return response.data;
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<Order> {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
}
