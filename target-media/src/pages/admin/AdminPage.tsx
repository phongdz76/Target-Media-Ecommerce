/* complete */
import { Navbar } from "../../components/NavBar";
import { UserManagement } from "../../components/UserManagement";
import { ProductManagement } from "../../components/ProductManagement";
import "./AdminPage.css";
import { useState } from "react";

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<"users" | "products">("users");

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <span className="menu-icon">👥</span>
              User Management
            </button>
            <button
              className={`menu-item ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              <span className="menu-icon">📦</span>
              Product Management
            </button>
          </div>
        </aside>
        <main className="admin-content">
          {activeTab === "users" && <UserManagement />}
          {activeTab === "products" && <ProductManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
