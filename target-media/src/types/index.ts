export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: {
    name: string;
  };
  avatar?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
