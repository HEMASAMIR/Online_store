"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Settings,
  Eye,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Tag,
  Star,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  ThumbsUp,
  ShieldCheck
} from "lucide-react";
import styles from "./admin.module.css";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminName, setAdminName] = useState("");

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, products, orders, settings, coupons, reviews

  // Settings state
  const [settings, setSettings] = useState({
    storeName: "Fayrouza Store",
    whatsappNumber: "+201012345678",
    shippingFee: 0,
    facebookUrl: "https://facebook.com/fayrouzastore",
    freeShippingThreshold: 0
  });

  // Search & filter states
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("الكل");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("الكل");

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: "", discountType: "percentage", discountValue: "" });
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState("all"); // all, pending, approved
  const [addReviewForm, setAddReviewForm] = useState({ productId: "", userName: "", rating: 5, comment: "" });
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);

  // Form states for Product Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding, product object if editing
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryVal, setCustomCategoryVal] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    category: "فيتامينات ومكملات",
    description: "",
    image: "",
    stock: "",
    featuresStr: "",
    sizesStr: "",
    colorsStr: ""
  });

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load state and login state
  useEffect(() => {
    // Check if user is already logged in (using sessionStorage)
    const loggedIn = sessionStorage.getItem("admin_logged_in");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setAdminName(sessionStorage.getItem("admin_name") || "المسؤول");
    }
  }, []);

  // Fetch products and orders
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  async function fetchData() {
    setLoading(true);
    try {
      const [productsRes, ordersRes, settingsRes, couponsRes, reviewsRes] = await Promise.all([
        fetch(`/api/products?t=${Date.now()}`),
        fetch(`/api/orders?t=${Date.now()}`),
        fetch(`/api/settings?t=${Date.now()}`),
        fetch(`/api/coupons?t=${Date.now()}`),
        fetch(`/api/reviews?t=${Date.now()}`)
      ]);
      
      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (couponsRes.ok) setCoupons(await couponsRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.user.isAdmin) {
          setIsLoggedIn(true);
          setAdminName(data.user.name);
          sessionStorage.setItem("admin_logged_in", "true");
          sessionStorage.setItem("admin_name", data.user.name);
          setLoginError("");
        } else {
          setLoginError("عذراً، هذا الحساب لا يملك صلاحيات المسؤول!");
        }
      } else {
        setLoginError(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة!");
      }
    } catch (err) {
      setLoginError("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_logged_in");
    sessionStorage.removeItem("admin_name");
  };

  // Handle Settings Saving
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert("تم حفظ الإعدادات بنجاح!");
      } else {
        alert("فشل في حفظ الإعدادات");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("حدث خطأ ما");
    }
  };

  // Export Orders to CSV
  const handleExportOrders = () => {
    if (orders.length === 0) {
      alert("لا يوجد طلبات لتصديرها!");
      return;
    }
    
    // Header row
    const headers = ["رقم الطلب", "تاريخ الطلب", "اسم العميل", "رقم الهاتف", "العنوان", "ملاحظات", "المنتجات", "الإجمالي (ج.م)", "الحالة"];
    
    // Format rows
    const rows = orders.map(order => {
      const itemsStr = order.items ? order.items.map(item => {
        let details = [];
        if (item.size) details.push(`مقاس: ${item.size}`);
        if (item.color) details.push(`لون: ${item.color}`);
        return `${item.name} (${item.quantity} قطع) ${details.length > 0 ? `[${details.join(" - ")}]` : ""}`;
      }).join(" | ") : "";
      
      const formattedDate = new Date(order.date).toLocaleString("ar-EG");
      const statusText = order.status === "completed" ? "مكتمل" : order.status === "cancelled" ? "ملغي" : "قيد الانتظار";
      
      return [
        order.id,
        formattedDate,
        order.customerName,
        order.phone,
        order.address,
        order.notes || "",
        itemsStr,
        order.total,
        statusText
      ];
    });
    
    // Construct CSV with Excel UTF-8 BOM
    const csvContent = "\ufeff" + [headers, ...rows]
      .map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
      
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `طلبات_متجر_فيروزة_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamically compute list of categories from existing products + defaults
  const defaultCategories = ["فيتامينات ومكملات", "عناية بالبشرة", "مستلزمات شخصية", "أمومة وطفولة", "أغذية صحية", "عناية بالشعر"];
  const adminCategories = Array.from(new Set([...defaultCategories, ...products.map(p => p.category).filter(Boolean)]));

  // Filter products
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchesCategory = productCategoryFilter === "الكل" || prod.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const query = orderSearchQuery.toLowerCase();
    const matchesSearch = order.customerName.toLowerCase().includes(query) || 
                          order.phone.includes(query) || 
                          order.address.toLowerCase().includes(query) ||
                          order.id.toLowerCase().includes(query);
    const matchesStatus = orderStatusFilter === "الكل" || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Open Modal for Adding Product
  const openAddModal = () => {
    setEditingProduct(null);
    setIsCustomCategory(false);
    setCustomCategoryVal("");
    setProductForm({
      name: "",
      price: "",
      oldPrice: "",
      category: "فيتامينات ومكملات",
      description: "",
      image: "",
      stock: "10",
      featuresStr: "",
      sizesStr: "",
      colorsStr: ""
    });
    setIsModalOpen(true);
  };

  // Open Modal for Editing Product
  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsCustomCategory(false);
    setCustomCategoryVal("");
    setProductForm({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
      category: product.category,
      description: product.description,
      image: product.image,
      stock: (product.stock !== undefined && product.stock !== null) ? product.stock.toString() : "0",
      featuresStr: product.features ? product.features.join(", ") : "",
      sizesStr: product.sizes ? product.sizes.join(", ") : "",
      colorsStr: product.colors ? product.colors.join(", ") : ""
    });
    setIsModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert("الاسم والسعر مطلوبان!");
      return;
    }

    const payload = {
      name: productForm.name,
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      category: productForm.category,
      description: productForm.description,
      image: productForm.image || undefined,
      stock: Number(productForm.stock) || 0,
      features: productForm.featuresStr ? productForm.featuresStr.split(",").map(s => s.trim()).filter(Boolean) : [],
      sizes: productForm.sizesStr ? productForm.sizesStr.split(",").map(s => s.trim()).filter(Boolean) : [],
      colors: productForm.colorsStr ? productForm.colorsStr.split(",").map(s => s.trim()).filter(Boolean) : []
    };

    try {
      let res;
      if (editingProduct) {
        // Edit Mode
        const productId = editingProduct.id || editingProduct._id;
        res = await fetch(`/api/products?id=${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productId, ...payload })
        });
      } else {
        // Add Mode
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        alert("تم الحفظ بنجاح!");
      } else {
        const errData = await res.text();
        alert(`فشل في حفظ المنتج: ${errData}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("حدث خطأ ما");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("فشل في حذف المنتج");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        fetchData();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => ({ ...prev, status }));
        }
      } else {
        alert("فشل في تحديث حالة الطلب");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // === COUPONS HANDLERS ===
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) {
      alert("برجاء إدخال الكود وقيمة الخصم!");
      return;
    }
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponForm.code,
          discountType: couponForm.discountType,
          discountValue: Number(couponForm.discountValue)
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCouponForm({ code: "", discountType: "percentage", discountValue: "" });
        setIsCouponModalOpen(false);
        fetchData();
      } else {
        alert(data.error || "فشل في إضافة الكود");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoupon = async (coupon) => {
    try {
      await fetch("/api/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكود؟")) return;
    try {
      await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // === REVIEWS HANDLERS ===
  const handleApproveReview = async (id) => {
    try {
      await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!addReviewForm.productId || !addReviewForm.userName || !addReviewForm.comment) {
      alert("برجاء إدخال جميع بيانات التقييم!");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addReviewForm, status: "approved" })
      });
      if (res.ok) {
        setAddReviewForm({ productId: "", userName: "", rating: 5, comment: "" });
        setIsAddReviewModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // === FILTERED REVIEWS ===
  const filteredReviews = reviews.filter(r => {
    if (reviewFilter === "all") return true;
    return r.status === reviewFilter;
  });

  // Calculation for stats
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
  const outOfStockProductsCount = products.filter(p => p.stock === 0).length;
  const pendingReviewsCount = reviews.filter(r => r.status === "pending").length;

  if (!isLoggedIn) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.loginLogoContainer}>
              <img src="/logo.jpg" alt="DM Germany Logo" className={styles.loginLogoImg} />
            </div>
            <h2>لوحة تحكم المسؤول</h2>
            <p>سجل الدخول لإدارة المنتجات والطلبات</p>
          </div>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            {loginError && <div className={styles.loginError}>{loginError}</div>}
            
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني للمسؤول</label>
              <input 
                type="email" 
                className="form-input" 
                required 
                placeholder="أدخل البريد الإلكتروني"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
              تسجيل الدخول
            </button>

            <Link href="/" className={styles.backToStore}>
              <ArrowLeft size={16} />
              <span>العودة لصفحة المتجر الرئيسي</span>
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <LayoutDashboard size={24} />
          <span>لوحة التحكم</span>
        </div>

        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={18} />
            <span>نظرة عامة</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${activeTab === "products" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <ShoppingBag size={18} />
            <span>المنتجات ({products.length})</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === "orders" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ClipboardList size={18} />
            <span>الطلبات ({orders.length})</span>
            {pendingOrdersCount > 0 && <span className={styles.pendingBadge}>{pendingOrdersCount}</span>}
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === "settings" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            <span>إعدادات المتجر</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === "coupons" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("coupons")}
          >
            <Tag size={18} />
            <span>الكوبونات ({coupons.length})</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeTab === "reviews" ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <Star size={18} />
            <span>التقييمات</span>
            {pendingReviewsCount > 0 && <span className={styles.pendingBadge}>{pendingReviewsCount}</span>}
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backBtnLink}>
            <ArrowLeft size={16} />
            <span>المتجر الرئيسي</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className={styles.mainArea}>
        {/* Header */}
        <header className={styles.mainHeader}>
          <h2>{
            activeTab === "dashboard" ? "نظرة عامة" : 
            activeTab === "products" ? "إدارة المنتجات" : 
            activeTab === "orders" ? "طلبات العملاء" : 
            activeTab === "settings" ? "إعدادات المتجر" :
            activeTab === "coupons" ? "كوبونات الخصم" :
            "إدارة تقييمات العملاء"
          }</h2>
          <div className={styles.adminProfile}>
            <span>مرحباً، {adminName || "المسؤول"} 👋</span>
          </div>
        </header>

        {loading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        ) : (
          <div className={styles.contentContainer}>
            
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className={styles.dashboardTab}>
                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                  <div className={`${styles.statCard} ${styles.statRevenue}`}>
                    <div className={styles.statIconWrapper}>
                      <DollarSign size={24} />
                    </div>
                    <div className={styles.statDetails}>
                      <span>إجمالي الأرباح المكتملة</span>
                      <h3>{totalRevenue} ج.م</h3>
                    </div>
                  </div>

                  <div className={`${styles.statCard} ${styles.statPending}`}>
                    <div className={styles.statIconWrapper}>
                      <Clock size={24} />
                    </div>
                    <div className={styles.statDetails}>
                      <span>طلبات قيد الانتظار</span>
                      <h3>{pendingOrdersCount} طلب</h3>
                    </div>
                  </div>

                  <div className={`${styles.statCard} ${styles.statProducts}`}>
                    <div className={styles.statIconWrapper}>
                      <ShoppingBag size={24} />
                    </div>
                    <div className={styles.statDetails}>
                      <span>إجمالي المنتجات</span>
                      <h3>{products.length} منتج</h3>
                    </div>
                  </div>

                  <div className={`${styles.statCard} ${styles.statStock}`}>
                    <div className={styles.statIconWrapper}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className={styles.statDetails}>
                      <span>منتجات نفدت من المخزن</span>
                      <h3>{outOfStockProductsCount} منتج</h3>
                    </div>
                  </div>
                </div>

                {/* Recent Orders section */}
                <div className={styles.recentOrdersBox}>
                  <div className={styles.boxHeader}>
                    <h3>آخر الطلبات الواردة</h3>
                    <button className="btn btn-secondary" onClick={() => setActiveTab("orders")}>
                      عرض كل الطلبات
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className={styles.noData}>لا يوجد طلبات مسجلة بعد.</p>
                  ) : (
                    <div className={styles.tableResponsive}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>الموبايل</th>
                            <th>التاريخ</th>
                            <th>المبلغ</th>
                            <th>الحالة</th>
                            <th>تفاصيل</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(order => (
                            <tr key={order.id}>
                              <td className={styles.orderIdText}>{order.id}</td>
                              <td>{order.customerName}</td>
                              <td>{order.phone}</td>
                              <td>{new Date(order.date).toLocaleDateString("ar-EG")}</td>
                              <td>{order.total} ج.م</td>
                              <td>
                                <span className={`badge ${
                                  order.status === "completed" ? "badge-success" : 
                                  order.status === "cancelled" ? "badge-danger" : "badge-warning"
                                }`}>
                                  {order.status === "completed" ? "مكتمل" : 
                                   order.status === "cancelled" ? "ملغي" : "قيد الانتظار"}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className={styles.actionBtnIcon}
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS */}
            {activeTab === "products" && (
              <div className={styles.productsTab}>
                <div className={styles.filterBar}>
                  <div className={styles.searchBox}>
                    <input 
                      type="text" 
                      placeholder="ابحث عن منتج بالاسم أو الوصف..." 
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  <div className={styles.filterSelectWrapper}>
                    <select 
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="الكل">كل الفئات</option>
                      {adminCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={openAddModal} style={{ marginRight: "auto" }}>
                    <Plus size={16} />
                    إضافة منتج جديد
                  </button>
                </div>

                <div className={styles.tableResponsive}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>الصورة</th>
                        <th>اسم المنتج</th>
                        <th>الفئة</th>
                        <th>السعر</th>
                        <th>المخزن (الكمية)</th>
                        <th>التحكم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(prod => (
                        <tr key={prod.id || prod._id}>
                          <td>
                            <img src={prod.image} alt={prod.name} className={styles.productTableThumb} />
                          </td>
                          <td className={styles.productTableName}>{prod.name}</td>
                          <td>
                            <span className="badge badge-primary">{prod.category}</span>
                          </td>
                          <td className={styles.priceCell}>
                            <div>{prod.price} ج.م</div>
                            {prod.oldPrice && (
                              <div className={styles.oldPriceTableVal}>
                                {prod.oldPrice} ج.م
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={prod.stock === 0 ? styles.outStockText : ""}>
                              {prod.stock} قطعة
                            </span>
                          </td>
                          <td>
                            <div className={styles.tableActions}>
                              <button 
                                className={`${styles.actionBtnIcon} ${styles.editBtn}`}
                                onClick={() => openEditModal(prod)}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className={`${styles.actionBtnIcon} ${styles.deleteBtn}`}
                                onClick={() => handleDeleteProduct(prod.id || prod._id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === "orders" && (
              <div className={styles.ordersTab}>
                <div className={styles.filterBar}>
                  <div className={styles.searchBox}>
                    <input 
                      type="text" 
                      placeholder="ابحث باسم العميل، الموبايل، العنوان أو رقم الطلب..." 
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className={styles.filterInput}
                    />
                  </div>
                  <div className={styles.filterSelectWrapper}>
                    <select 
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="الكل">كل حالات الطلبات</option>
                      <option value="pending">قيد الانتظار</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                  <button className={`${styles.exportBtn} btn btn-secondary`} onClick={handleExportOrders} style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FileSpreadsheet size={16} />
                    تصدير كـ CSV
                  </button>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className={styles.emptyState}>
                    <ClipboardList size={48} />
                    <h3>لا يوجد طلبات تطابق البحث</h3>
                    <p>جرب كلمات بحث أخرى أو فلترة مختلفة.</p>
                  </div>
                ) : (
                  <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>رقم الطلب</th>
                          <th>اسم العميل</th>
                          <th>الموبايل</th>
                          <th>العنوان</th>
                          <th>التاريخ</th>
                          <th>إجمالي الفاتورة</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(order => (
                          <tr key={order.id}>
                            <td className={styles.orderIdText}>{order.id}</td>
                            <td>{order.customerName}</td>
                            <td>{order.phone}</td>
                            <td className={styles.addressCell} title={order.address}>{order.address}</td>
                            <td>{new Date(order.date).toLocaleDateString("ar-EG")}</td>
                            <td className={styles.priceCell}>{order.total} ج.م</td>
                            <td>
                              <span className={`badge ${
                                order.status === "completed" ? "badge-success" : 
                                order.status === "cancelled" ? "badge-danger" : "badge-warning"
                              }`}>
                                {order.status === "completed" ? "مكتمل" : 
                                 order.status === "cancelled" ? "ملغي" : "قيد الانتظار"}
                              </span>
                            </td>
                            <td>
                              <div className={styles.tableActions}>
                                <button 
                                  className={styles.actionBtnIcon}
                                  onClick={() => setSelectedOrder(order)}
                                  title="عرض التفاصيل الكاملة"
                                >
                                  <Eye size={16} />
                                </button>
                                
                                {order.status === "pending" && (
                                  <>
                                    <button 
                                      className={`${styles.actionBtnIcon} ${styles.completeBtn}`}
                                      onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                      title="تحديد كمكتمل"
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                    <button 
                                      className={`${styles.actionBtnIcon} ${styles.deleteBtn}`}
                                      onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                      title="إلغاء الطلب"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className={styles.settingsTab}>
                <div className={styles.settingsBox}>
                  <div className={styles.boxHeader}>
                    <h3>إعدادات المتجر العامة</h3>
                  </div>
                  <form onSubmit={handleSaveSettings} className={styles.settingsForm}>
                    <div className={styles.settingsFormGrid}>
                      <div className="form-group">
                        <label className="form-label">اسم المتجر</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          required 
                          placeholder="مثال: Fayrouza Store"
                          value={settings.storeName}
                          onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">رقم الواتساب لاستقبال الطلبات (بكود الدولة)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          required 
                          placeholder="مثال: +201012345678"
                          value={settings.whatsappNumber}
                          onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">تكلفة الشحن الثابتة (جنيه مصري)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          required 
                          placeholder="مثال: 50"
                          value={settings.shippingFee}
                          onChange={(e) => setSettings({...settings, shippingFee: Number(e.target.value)})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">حد الشحن المجاني (جنيه مصري - 0 يعني لا يوجد شحن مجاني)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          required 
                          placeholder="مثال: 1000"
                          value={settings.freeShippingThreshold}
                          onChange={(e) => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label className="form-label">رابط صفحة الفيسبوك (Facebook URL)</label>
                        <input 
                          type="url" 
                          className="form-input" 
                          placeholder="https://facebook.com/page-name"
                          value={settings.facebookUrl}
                          onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className={styles.settingsFormFooter}>
                      <button type="submit" className="btn btn-primary">حفظ الإعدادات</button>
                    </div>
                  </form>
                </div>
              </div>
            )}\n\n            {/* TAB: COUPONS */}
            {activeTab === "coupons" && (
              <div className={styles.couponsTab}>
                <div className={styles.filterBar}>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>
                    إجمالي الكوبونات: <strong>{coupons.length}</strong>
                  </h3>
                  <button className="btn btn-primary" onClick={() => setIsCouponModalOpen(true)} style={{ marginRight: "auto" }}>
                    <Plus size={16} /> إضافة كوبون جديد
                  </button>
                </div>

                {coupons.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Tag size={48} />
                    <h3>لا يوجد كوبونات حتى الآن</h3>
                    <p>أضف أول كود خصم لعملائك الآن!</p>
                  </div>
                ) : (
                  <div className={styles.couponsGrid}>
                    {coupons.map(coupon => (
                      <div key={coupon.id} className={`${styles.couponCard} ${!coupon.isActive ? styles.couponInactive : ""}`}>
                        <div className={styles.couponCodeBadge}>
                          <Tag size={16} />
                          <span>{coupon.code}</span>
                        </div>
                        <div className={styles.couponDetails}>
                          <span className={styles.couponValue}>
                            {coupon.discountType === "percentage" 
                              ? `خصم ${coupon.discountValue}%` 
                              : `خصم ${coupon.discountValue} ج.م`}
                          </span>
                          <span className={`badge ${coupon.isActive ? "badge-success" : "badge-danger"}`}>
                            {coupon.isActive ? "مفعّل" : "معطّل"}
                          </span>
                        </div>
                        <div className={styles.couponActions}>
                          <button
                            className={`${styles.actionBtnIcon} ${coupon.isActive ? styles.deleteBtn : styles.completeBtn}`}
                            onClick={() => handleToggleCoupon(coupon)}
                            title={coupon.isActive ? "تعطيل الكوبون" : "تفعيل الكوبون"}
                          >
                            {coupon.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                          <button
                            className={`${styles.actionBtnIcon} ${styles.deleteBtn}`}
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            title="حذف الكوبون"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === "reviews" && (
              <div className={styles.reviewsTab}>
                <div className={styles.filterBar}>
                  <div className={styles.filterSelectWrapper}>
                    <select className={styles.filterSelect} value={reviewFilter} onChange={e => setReviewFilter(e.target.value)}>
                      <option value="all">كل التقييمات ({reviews.length})</option>
                      <option value="pending">بانتظار الموافقة ({reviews.filter(r => r.status === "pending").length})</option>
                      <option value="approved">مقبولة ({reviews.filter(r => r.status === "approved").length})</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={() => setIsAddReviewModalOpen(true)} style={{ marginRight: "auto" }}>
                    <Plus size={16} /> إضافة تقييم تسويقي
                  </button>
                </div>

                {filteredReviews.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Star size={48} />
                    <h3>لا يوجد تقييمات</h3>
                    <p>ستظهر هنا تقييمات العملاء بعد تقديمها من صفحة المتجر.</p>
                  </div>
                ) : (
                  <div className={styles.reviewsGrid}>
                    {filteredReviews.map(review => {
                      const product = products.find(p => p.id === review.productId);
                      return (
                        <div key={review.id} className={styles.reviewCard}>
                          <div className={styles.reviewCardHeader}>
                            <div className={styles.reviewerInfo}>
                              <div className={styles.reviewerAvatar}>
                                {review.userName.charAt(0)}
                              </div>
                              <div>
                                <strong>{review.userName}</strong>
                                <p className={styles.reviewProductName}>{product ? product.name : `منتج #${review.productId}`}</p>
                              </div>
                            </div>
                            <div className={styles.reviewStars}>
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={14} fill={s <= review.rating ? "#d97706" : "none"} color={s <= review.rating ? "#d97706" : "#94a3b8"} />
                              ))}
                            </div>
                          </div>
                          <p className={styles.reviewComment}>{review.comment}</p>
                          <div className={styles.reviewCardFooter}>
                            <span className={styles.reviewDate}>{new Date(review.date).toLocaleDateString("ar-EG")}</span>
                            <div className={styles.reviewActions}>
                              <span className={`badge ${review.status === "approved" ? "badge-success" : "badge-warning"}`}>
                                {review.status === "approved" ? "مقبول" : "بانتظار الموافقة"}
                              </span>
                              {review.status === "pending" && (
                                <button
                                  className={`${styles.actionBtnIcon} ${styles.completeBtn}`}
                                  onClick={() => handleApproveReview(review.id)}
                                  title="قبول التقييم"
                                >
                                  <ThumbsUp size={15} />
                                </button>
                              )}
                              <button
                                className={`${styles.actionBtnIcon} ${styles.deleteBtn}`}
                                onClick={() => handleDeleteReview(review.id)}
                                title="حذف التقييم"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Form Modal (Add / Edit) */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? "تعديل تفاصيل المنتج" : "إضافة منتج جديد للمتجر"}</h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeModalBtn}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className={styles.productForm}>
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">اسم المنتج *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="مثال: تيشرت قطن أسود"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">السعر (جنيه مصري) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    placeholder="مثال: 350"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">السعر القديم / قبل الخصم (اختياري)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="مثال: 450"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({...productForm, oldPrice: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">الفئة *</label>
                  <select 
                    className="form-select"
                    value={isCustomCategory ? "__custom__" : productForm.category}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomCategory(true);
                        setProductForm({...productForm, category: customCategoryVal});
                      } else {
                        setIsCustomCategory(false);
                        setProductForm({...productForm, category: e.target.value});
                      }
                    }}
                  >
                    {adminCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__custom__">+ إضافة فئة جديدة...</option>
                  </select>
                </div>

                {isCustomCategory && (
                  <div className="form-group" style={{ gridColumn: "span 2", marginTop: "-0.5rem" }}>
                    <label className="form-label">اسم الفئة الجديدة *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="اكتب اسم الفئة الجديدة هنا..."
                      value={customCategoryVal}
                      onChange={(e) => {
                        setCustomCategoryVal(e.target.value);
                        setProductForm({...productForm, category: e.target.value});
                      }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">الكمية المتوفرة (المخزن) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    placeholder="مثال: 15"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">صورة المنتج (رابط مباشر أو رفع من الجهاز/الموبايل)</label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="https://example.com/image.jpg"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      style={{ flex: 1 }}
                    />
                    <label className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", margin: 0, padding: "0.65rem 1.1rem", fontSize: "0.85rem", whiteSpace: "nowrap", height: "42px", justifyContent: "center" }}>
                      <span>رفع صورة 📷</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          
                          const formData = new FormData();
                          formData.append("file", file);
                          
                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData
                            });
                            const data = await res.json();
                            if (data.success) {
                              setProductForm({...productForm, image: data.url});
                            } else {
                              alert("فشل رفع الصورة: " + data.error);
                            }
                          } catch (err) {
                            alert("حدث خطأ أثناء رفع الصورة.");
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">وصف المنتج بالتفصيل</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="أدخل وصفاً مشوقاً للمنتج..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">المواصفات / المميزات (افصل بينها بفصلة ,)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="ميزة 1, ميزة 2, ميزة 3"
                    value={productForm.featuresStr}
                    onChange={(e) => setProductForm({...productForm, featuresStr: e.target.value})}
                  />
                </div>

                {productForm.category === "مستلزمات شخصية" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">المقاسات المتاحة (افصل بفصلة ,)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="M, L, XL, XXL"
                        value={productForm.sizesStr}
                        onChange={(e) => setProductForm({...productForm, sizesStr: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">الألوان المتاحة (افصل بفصلة ,)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="أسود, أبيض, كحلي"
                        value={productForm.colorsStr}
                        onChange={(e) => setProductForm({...productForm, colorsStr: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className={styles.modalFooterActions}>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "حفظ التغييرات" : "إضافة المنتج"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={`${styles.modalContent} ${styles.orderDetailModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>تفاصيل الفاتورة والطلب: {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className={styles.closeModalBtn}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.orderDetailGrid}>
              <div className={styles.customerBox}>
                <h4>معلومات العميل والشحن</h4>
                <p><strong>الاسم:</strong> {selectedOrder.customerName}</p>
                <p><strong>رقم الموبايل:</strong> {selectedOrder.phone}</p>
                <p><strong>العنوان الكامل:</strong> {selectedOrder.address}</p>
                <p><strong>ملاحظات العميل:</strong> {selectedOrder.notes || "لا يوجد ملاحظات"}</p>
                <p><strong>تاريخ الطلب:</strong> {new Date(selectedOrder.date).toLocaleString("ar-EG")}</p>
                <p>
                  <strong>حالة الطلب:</strong>{" "}
                  <span className={`badge ${
                    selectedOrder.status === "completed" ? "badge-success" : 
                    selectedOrder.status === "cancelled" ? "badge-danger" : "badge-warning"
                  }`}>
                    {selectedOrder.status === "completed" ? "مكتمل" : 
                     selectedOrder.status === "cancelled" ? "ملغي" : "قيد الانتظار"}
                  </span>
                </p>
              </div>

              <div className={styles.itemsBox}>
                <h4>المنتجات المطلوبة</h4>
                <div className={styles.orderItemsList}>
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.orderItemRow}>
                      <img src={item.image} alt={item.name} className={styles.orderItemThumb} />
                      <div className={styles.orderItemInfo}>
                        <h5>{item.name}</h5>
                        <div className={styles.orderItemMeta}>
                          {item.size && <span>المقاس: {item.size}</span>}
                          {item.color && <span>اللون: {item.color}</span>}
                          <span>الكمية: {item.quantity}</span>
                        </div>
                      </div>
                      <div className={styles.orderItemPrice}>
                        {item.price * item.quantity} ج.م
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderTotalRow}>
                  <span>إجمالي الحساب:</span>
                  <strong>{selectedOrder.total} جنيه مصري</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalFooterActions}>
              {selectedOrder.status === "pending" && (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")}
                  >
                    <CheckCircle2 size={16} />
                    شحن وإكمال الطلب
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "cancelled")}
                  >
                    <Trash2 size={16} />
                    إلغاء الطلب
                  </button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB: COUPONS ===================== */}
      {/* Rendered as a sibling section, conditionally shown via the activeTab state in contentContainer */}

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCouponModalOpen(false)}>
          <div className={`${styles.modalContent} ${styles.couponModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>إضافة كوبون خصم جديد</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className={styles.closeModalBtn}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCoupon} className={styles.couponForm}>
              <div className="form-group">
                <label className="form-label">كود الخصم *</label>
                <input type="text" className="form-input" placeholder="مثال: SAVE20" required
                  value={couponForm.code}
                  onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">نوع الخصم *</label>
                <select className="form-select"
                  value={couponForm.discountType}
                  onChange={e => setCouponForm({...couponForm, discountType: e.target.value})}
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">قيمة ثابتة (ج.م)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  قيمة الخصم * {couponForm.discountType === "percentage" ? "(بالنسبة المئوية)" : "(بالجنيه المصري)"}
                </label>
                <input type="number" className="form-input" min="1" max={couponForm.discountType === "percentage" ? "100" : undefined} required
                  placeholder={couponForm.discountType === "percentage" ? "مثال: 10" : "مثال: 50"}
                  value={couponForm.discountValue}
                  onChange={e => setCouponForm({...couponForm, discountValue: e.target.value})}
                />
              </div>
              <div className={styles.modalFooterActions}>
                <button type="submit" className="btn btn-primary"><Tag size={16} /> إضافة الكوبون</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCouponModalOpen(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal (Admin) */}
      {isAddReviewModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddReviewModalOpen(false)}>
          <div className={`${styles.modalContent} ${styles.couponModal}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>إضافة تقييم تسويقي</h3>
              <button onClick={() => setIsAddReviewModalOpen(false)} className={styles.closeModalBtn}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddReview} className={styles.couponForm}>
              <div className="form-group">
                <label className="form-label">اختر المنتج *</label>
                <select className="form-select" required
                  value={addReviewForm.productId}
                  onChange={e => setAddReviewForm({...addReviewForm, productId: e.target.value})}
                >
                  <option value="">-- اختر منتجاً --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">اسم العميل *</label>
                <input type="text" className="form-input" placeholder="مثال: سارة أحمد" required
                  value={addReviewForm.userName}
                  onChange={e => setAddReviewForm({...addReviewForm, userName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">التقييم (1-5 نجوم) *</label>
                <div className={styles.starRatingPicker}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button"
                      className={`${styles.starPickBtn} ${addReviewForm.rating >= star ? styles.starPickActive : ""}`}
                      onClick={() => setAddReviewForm({...addReviewForm, rating: star})}
                    >
                      <Star size={22} fill={addReviewForm.rating >= star ? "#d97706" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">نص التقييم *</label>
                <textarea className="form-textarea" placeholder="اكتب رأي العميل هنا..." required
                  value={addReviewForm.comment}
                  onChange={e => setAddReviewForm({...addReviewForm, comment: e.target.value})}
                />
              </div>
              <div className={styles.modalFooterActions}>
                <button type="submit" className="btn btn-primary"><Star size={16} /> إضافة التقييم</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddReviewModalOpen(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
