import axios from "axios";
import { User, Product } from "../types";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// User Service
export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data.map((user) => ({
      ...user,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name
      )}&background=random`,
    }));
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return {
      ...response.data,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        response.data.name
      )}&background=random`,
    };
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    const response = await api.post<User>("/users", user);
    return {
      ...response.data,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        response.data.name
      )}&background=random`,
    };
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, user);
    return {
      ...response.data,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        response.data.name
      )}&background=random`,
    };
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Product Service (using JSONPlaceholder posts as products)
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/posts");
    return response.data.map((post: any, index: number) => ({
      id: post.id,
      title: post.title,
      description: post.body,
      price: Math.floor(Math.random() * 500) + 50,
      category: ["Electronics", "Clothing", "Books", "Home"][index % 4],
      image: `https://picsum.photos/300/300?random=${post.id}`,
    }));
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/posts/${id}`);
    return {
      id: response.data.id,
      title: response.data.title,
      description: response.data.body,
      price: Math.floor(Math.random() * 500) + 50,
      category: ["Electronics", "Clothing", "Books", "Home"][
        response.data.id % 4
      ],
      image: `https://picsum.photos/600/400?random=${response.data.id}`,
    };
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post("/posts", {
      title: product.title,
      body: product.description,
      userId: 1,
    });

    return {
      id: response.data.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image:
        product.image ||
        `https://picsum.photos/300/300?random=${Math.random()}`,
    };
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const updateData: any = {};
    if (product.title) updateData.title = product.title;
    if (product.description) updateData.body = product.description;

    const response = await api.put(`/posts/${id}`, updateData);

    return {
      id: response.data.id,
      title: product.title || response.data.title,
      description: product.description || response.data.body,
      price: product.price || 0,
      category: product.category || "",
      image: product.image || `https://picsum.photos/300/300?random=${id}`,
    };
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
