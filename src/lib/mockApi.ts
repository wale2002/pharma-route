// Mock API system for MediLink platform
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'clinic' | 'pharmacy' | 'rider';
  name: string;
  organization?: string;
  address?: string;
  phone?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: string;
  pharmacyId: string;
  createdAt: Date;
}

export interface DrugRequest {
  id: string;
  clinicId: string;
  clinicName: string;
  type: 'photo' | 'inventory';
  photoUrl?: string;
  selectedProducts?: { productId: string; quantity: number; productName: string }[];
  deliveryAddress: string;
  patientInfo?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  requestId: string;
  clinicId: string;
  pharmacyId: string;
  riderId?: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  totalAmount: number;
  deliveryAddress: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
}

// In-memory storage
let users: User[] = [
  {
    id: '1',
    email: 'clinic@medilink.com',
    password: 'password123',
    role: 'clinic',
    name: 'City General Hospital',
    organization: 'City General Hospital',
    address: '123 Health Street, Medical District',
    phone: '+1-555-0101',
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'pharmacy@medilink.com',
    password: 'password123',
    role: 'pharmacy',
    name: 'MediCare Pharmacy',
    organization: 'MediCare Central Pharmacy',
    address: '456 Medicine Ave, Pharmacy Plaza',
    phone: '+1-555-0102',
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'rider@medilink.com',
    password: 'password123',
    role: 'rider',
    name: 'John Rider',
    address: '789 Delivery Lane, City Center',
    phone: '+1-555-0103',
    createdAt: new Date()
  }
];

let products: Product[] = [
  {
    id: 'p1',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    price: 12.99,
    quantity: 100,
    category: 'Pain Relief',
    pharmacyId: '2',
    createdAt: new Date()
  },
  {
    id: 'p2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections',
    price: 24.99,
    quantity: 50,
    category: 'Antibiotics',
    pharmacyId: '2',
    createdAt: new Date()
  },
  {
    id: 'p3',
    name: 'Insulin Pen',
    description: 'Disposable insulin injection pen',
    price: 89.99,
    quantity: 25,
    category: 'Diabetes Care',
    pharmacyId: '2',
    createdAt: new Date()
  }
];

let drugRequests: DrugRequest[] = [];
let orders: Order[] = [];
let currentUser: User | null = null;

// Helper function to simulate API delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication APIs
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    currentUser = user;
    localStorage.setItem('medilink_user', JSON.stringify(user));
    localStorage.setItem('medilink_token', 'mock_jwt_token_' + user.id);
    return { user, token: 'mock_jwt_token_' + user.id };
  },

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ user: User; token: string }> {
    await delay();
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('medilink_user', JSON.stringify(newUser));
    localStorage.setItem('medilink_token', 'mock_jwt_token_' + newUser.id);
    return { user: newUser, token: 'mock_jwt_token_' + newUser.id };
  },

  logout(): void {
    currentUser = null;
    localStorage.removeItem('medilink_user');
    localStorage.removeItem('medilink_token');
  },

  getCurrentUser(): User | null {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('medilink_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  }
};

// Product APIs
export const productApi = {
  async getInventory(): Promise<Product[]> {
    await delay(300);
    return products.filter(p => p.quantity > 0);
  },

  async addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    await delay();
    const newProduct: Product = {
      ...productData,
      id: 'p' + Date.now(),
      createdAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products[index] = { ...products[index], ...updates };
    return products[index];
  },

  async deleteProduct(id: string): Promise<void> {
    await delay();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    products.splice(index, 1);
  }
};

// Drug Request APIs
export const requestApi = {
  async submitPhotoRequest(data: {
    photoUrl: string;
    deliveryAddress: string;
    patientInfo?: string;
  }): Promise<DrugRequest> {
    await delay();
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'clinic') throw new Error('Unauthorized');
    
    const request: DrugRequest = {
      id: 'req' + Date.now(),
      clinicId: user.id,
      clinicName: user.name,
      type: 'photo',
      photoUrl: data.photoUrl,
      deliveryAddress: data.deliveryAddress,
      patientInfo: data.patientInfo,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    drugRequests.push(request);
    return request;
  },

  async submitInventoryRequest(data: {
    selectedProducts: { productId: string; quantity: number }[];
    deliveryAddress: string;
    patientInfo?: string;
  }): Promise<DrugRequest> {
    await delay();
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'clinic') throw new Error('Unauthorized');
    
    const productsWithNames = data.selectedProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        productName: product?.name || 'Unknown Product'
      };
    });

    const request: DrugRequest = {
      id: 'req' + Date.now(),
      clinicId: user.id,
      clinicName: user.name,
      type: 'inventory',
      selectedProducts: productsWithNames,
      deliveryAddress: data.deliveryAddress,
      patientInfo: data.patientInfo,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    drugRequests.push(request);
    return request;
  },

  async getPendingRequests(): Promise<DrugRequest[]> {
    await delay(300);
    return drugRequests.filter(r => r.status === 'pending');
  },

  async getUserRequests(): Promise<DrugRequest[]> {
    await delay(300);
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    return drugRequests.filter(r => r.clinicId === user.id);
  },

  async confirmRequest(requestId: string): Promise<Order> {
    await delay();
    const request = drugRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    
    request.status = 'confirmed';
    request.updatedAt = new Date();
    
    // Create order
    let totalAmount = 0;
    const orderItems = request.selectedProducts?.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        // Deduct stock
        product.quantity -= item.quantity;
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        return {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: product.price
        };
      }
      return {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: 0
      };
    }) || [];

    const order: Order = {
      id: 'ord' + Date.now(),
      requestId: request.id,
      clinicId: request.clinicId,
      pharmacyId: '2', // Main pharmacy
      items: orderItems,
      totalAmount,
      deliveryAddress: request.deliveryAddress,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    orders.push(order);
    return order;
  },

  async rejectRequest(requestId: string, reason: string): Promise<void> {
    await delay();
    const request = drugRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    
    request.status = 'rejected';
    request.rejectionReason = reason;
    request.updatedAt = new Date();
  }
};

// Order APIs
export const orderApi = {
  async getAvailableOrders(): Promise<Order[]> {
    await delay(300);
    return orders.filter(o => o.status === 'pending');
  },

  async getUserOrders(): Promise<Order[]> {
    await delay(300);
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    
    if (user.role === 'rider') {
      return orders.filter(o => o.riderId === user.id);
    } else if (user.role === 'clinic') {
      return orders.filter(o => o.clinicId === user.id);
    }
    return orders;
  },

  async acceptOrder(orderId: string): Promise<Order> {
    await delay();
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'rider') throw new Error('Unauthorized');
    
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    order.riderId = user.id;
    order.status = 'assigned';
    order.updatedAt = new Date();
    return order;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await delay();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    order.status = status;
    order.updatedAt = new Date();
    
    // Update related request status
    const request = drugRequests.find(r => r.id === order.requestId);
    if (request) {
      request.status = status;
      request.updatedAt = new Date();
    }
    
    return order;
  }
};

export { currentUser };