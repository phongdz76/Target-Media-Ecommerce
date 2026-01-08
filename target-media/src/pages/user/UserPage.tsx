import { Navbar } from "../../components/NavBar";
import { ProductList } from "../../components/ProductList";
import "./UserPage.css";

export const UserPage = () => {
  return (
    <div className="user-page">
      <Navbar />
      <div className="user-container">
        <div className="page-header">
          <h1>Welcome to Taget Media Shop</h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>
        <ProductList />
      </div>
    </div>
  );
};

export default UserPage;

/* complete */