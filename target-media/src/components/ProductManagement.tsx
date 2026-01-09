import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import "./ProductManagement.css";
import { Product } from "../types";
import { productService } from "../services/api";

const ITEMS_PER_PAGE = 10;

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<
    Omit<Product, "id"> & { id?: number }
  >({
    title: "",
    description: "",
    price: 0,
    category: "Electronics",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingId) {
        // Update product via API
        const updatedProduct = await productService.update(editingId, formData);
        setProducts(
          products.map((p) => (p.id === editingId ? updatedProduct : p))
        );
        showSuccessMessage("Product updated successfully!");
      } else {
        // Create new product via API
        const newProduct = await productService.create(formData);
        setProducts([newProduct, ...products]);
        showSuccessMessage("Product created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
      showErrorMessage(
        editingId
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || "",
    });
    setImagePreview(product.image || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError(null);
    try {
      await productService.delete(id);
      setProducts(products.filter((p) => p.id !== id));
      showSuccessMessage("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      showErrorMessage("Failed to delete product. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      category: "Electronics",
      image: "",
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setEditingId(null);
    setShowForm(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showErrorMessage("Please select a valid image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showErrorMessage("Image size should be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <div className="image-upload-container">
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image" className="image-upload-label">
                <span className="upload-icon">📁</span>
                <span>Choose an image or drag it here</span>
                <span className="upload-hint">PNG, JPG, GIF up to 5MB</span>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-small"></span>
                  {editingId ? "Updating..." : "Creating..."}
                </>
              ) : editingId ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetForm}
              disabled={submitting}
            >
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
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {paginatedProducts.length === 0 ? (
              <p className="no-data">
                {searchTerm
                  ? "No products match your search"
                  : "No products found"}
              </p>
            ) : (
              paginatedProducts.map((product) => (
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
                        onClick={() => handleViewDetails(product)}
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
                    <p className="product-description">
                      {product.description.substring(0, 100)}...
                    </p>
                    <div className="product-footer">
                      <div className="product-price">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          className={`pagination-number ${
                            currentPage === page ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="pagination-ellipsis">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}

          <div className="pagination-info">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>
        </>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-image-section">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="detail-image"
                />
              </div>
              <div className="detail-info-section">
                <div className="detail-field">
                  <label>ID:</label>
                  <span>{selectedProduct.id}</span>
                </div>
                <div className="detail-field">
                  <label>Title:</label>
                  <span>{selectedProduct.title}</span>
                </div>
                <div className="detail-field">
                  <label>Category:</label>
                  <span className="detail-category">
                    {selectedProduct.category}
                  </span>
                </div>
                <div className="detail-field">
                  <label>Price:</label>
                  <span className="detail-price">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                </div>
                <div className="detail-field detail-field-full">
                  <label>Description:</label>
                  <p className="detail-description">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-info"
                onClick={() => {
                  setSelectedProduct(null);
                  handleEdit(selectedProduct);
                }}
              >
                Edit Product
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setSelectedProduct(null);
                  handleDelete(selectedProduct.id);
                }}
              >
                Delete Product
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
