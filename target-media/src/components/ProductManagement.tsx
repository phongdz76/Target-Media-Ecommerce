import { useState, useEffect, FormEvent } from 'react'
import './ProductManagement.css'
import { Product } from '../types'
import { productService } from '../services/api'

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Omit<Product, 'id'> & { id?: number }>({
    title: '',
    description: '',
    price: 0,
    category: 'Electronics',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (editingId) {
      // Update product in state only (not calling API)
      setProducts(products.map(p =>
        p.id === editingId
          ? { ...p, ...formData }
          : p
      ))
    } else {
      // Add new product to state only (not calling API)
      const newProduct: Product = {
        ...formData,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        image: `https://picsum.photos/400/300?random=${Math.random()}`
      } as Product
      setProducts([...products, newProduct])
    }
    resetForm()
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Delete from state only (not calling API)
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: 'Electronics',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Product Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter product title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="Enter product price"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingId ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search products by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-data">{searchTerm ? 'No products match your search' : 'No products found'}</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="product-overlay">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {}}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.title}</h3>
                  <p className="product-description">{product.description.substring(0, 100)}...</p>
                  <div className="product-footer">
                    <div className="product-price">${product.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}