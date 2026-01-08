import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "../../types";
import { productService } from "../../services/api";
import "./ProductDetail.css";
import { Navbar } from "../../components/NavBar";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productService.getById(parseInt(id));
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-container">
          <div className="error-message">
            <h2>Product not found</h2>
            <button
              onClick={() => navigate("/user")}
              className="btn btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        <button onClick={() => navigate("/user")} className="back-btn">
          ← Back to Products
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img
              src={product.image}
              alt={product.title}
              className="detail-image"
            />
          </div>

          <div className="product-details-section">
            <div className="product-header">
              <span className="detail-category">{product.category}</span>
              <h1>{product.title}</h1>
              <div className="rating-section">
                <span className="stars">★★★★★</span>
                <span className="rating-count">(128 reviews)</span>
              </div>
            </div>

            <div className="product-pricing">
              <div className="price-tag">
                <span className="currency">$</span>
                <span className="price">{product.price.toFixed(2)}</span>
              </div>
              <div className="price-info">
                <span className="original-price">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
                <span className="discount">-17%</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-specifications">
              <h3>Specifications</h3>
              <ul>
                <li>
                  <strong>Category:</strong> {product.category}
                </li>
                <li>
                  <strong>In Stock:</strong>
                  <span className="in-stock">✓ Available</span>
                </li>
                <li>
                  <strong>Warranty:</strong> 2 years
                </li>
                <li>
                  <strong>Shipping:</strong> Free shipping on orders over $50
                </li>
              </ul>
            </div>

            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-control">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="qty-input"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`add-to-cart-btn ${addedToCart ? "added" : ""}`}
              >
                {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
            </div>

            <div className="additional-info">
              <button className="info-link">
                <span>💬</span> Ask a Question
              </button>
              <button className="info-link">
                <span>❤️</span> Add to Wishlist
              </button>
              <button className="info-link">
                <span>🔄</span> Compare
              </button>
            </div>
          </div>
        </div>

        <div className="product-reviews">
          <h2>Customer Reviews</h2>
          <div className="reviews-container">
            <div className="review-item">
              <div className="reviewer-info">
                <img
                  src="https://ui-avatars.com/api/?name=John+Doe"
                  alt="John Doe"
                  className="reviewer-avatar"
                />
                <div>
                  <h4>John Doe</h4>
                  <span className="review-rating">★★★★★</span>
                </div>
              </div>
              <p className="review-text">
                Amazing product! Excellent quality and fast delivery.
              </p>
            </div>

            <div className="review-item">
              <div className="reviewer-info">
                <img
                  src="https://ui-avatars.com/api/?name=Jane+Smith"
                  alt="Jane Smith"
                  className="reviewer-avatar"
                />
                <div>
                  <h4>Jane Smith</h4>
                  <span className="review-rating">★★★★☆</span>
                </div>
              </div>
              <p className="review-text">
                Great product, very satisfied with my purchase. Highly
                recommended!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
