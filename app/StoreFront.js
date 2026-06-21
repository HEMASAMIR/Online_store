"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  Check,
  Phone,
  MapPin,
  User,
  Sparkles,
  Grid,
  ArrowUpDown,
  ShieldCheck,
  Eye,
  EyeOff,
  Menu,
  Tag,
  MessageSquare,
  ThumbsUp,
  LogIn,
  LogOut,
  UserPlus,
  Mail,
  Lock,
  UserCheck
} from "lucide-react";
import styles from "./page.module.css";

// Sub-component: loads and displays approved reviews for a given product with a premium dashboard
function ReviewsList({ productId, styles }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reviews?productId=${productId}&status=approved`)
      .then(r => r.json())
      .then(data => { setReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className={styles.reviewsLoading}>
        <div className={styles.reviewsSpinner}></div>
        <p>جاري تحميل التقييمات والآراء...</p>
      </div>
    );
  }

  // Calculate average and distribution
  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "5.0";

  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className={styles.reviewsWrapper}>
      {/* Ratings Summary Dashboard */}
      <div className={styles.reviewsDashboard}>
        <div className={styles.reviewsSummaryCard}>
          <div className={styles.averageRatingNumber}>{averageRating}</div>
          <div className={styles.averageStars}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={18} fill={s <= Math.round(averageRating) ? "#d97706" : "none"} color={s <= Math.round(averageRating) ? "#d97706" : "#e2e8f0"} />
            ))}
          </div>
          <div className={styles.totalReviewsText}>بناءً على {totalReviews} تقييم من عملائنا</div>
        </div>

        <div className={styles.ratingBarsList}>
          {distribution.map(item => (
            <div key={item.stars} className={styles.ratingBarRow}>
              <span className={styles.barLabel}>{item.stars} نجوم</span>
              <div className={styles.barContainer}>
                <div className={styles.barFill} style={{ width: `${item.percentage}%` }}></div>
              </div>
              <span className={styles.barPercentage}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {totalReviews === 0 ? (
        <p className={styles.noReviewsText}>لا يوجد تقييمات بعد لهذا المنتج. كن أول من يشاركنا رأيه!</p>
      ) : (
        <div className={styles.reviewsListContainer}>
          {reviews.map(review => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewUserArea}>
                  <div className={styles.userAvatar}>
                    {review.userName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className={styles.userMetaInfo}>
                    <strong className={styles.reviewUserName}>{review.userName}</strong>
                    <div className={styles.verifiedBuyer}>
                      <ShieldCheck size={12} className={styles.verifiedIcon} />
                      <span>مشتري مؤكد</span>
                    </div>
                  </div>
                </div>
                <div className={styles.reviewRightHeader}>
                  <span className={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} fill={s <= review.rating ? "#d97706" : "none"} color={s <= review.rating ? "#d97706" : "#e2e8f0"} />
                    ))}
                  </span>
                  <span className={styles.reviewDate}>
                    {new Date(review.date).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
              <p className={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StoreFront({ initialProducts = [], initialSettings = {} }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("default");

  // Settings state
  const [settings, setSettings] = useState({
    storeName: "Fayrouza Store",
    whatsappNumber: "+201012345678",
    shippingFee: 45,
    facebookUrl: "https://www.facebook.com/share/1EE3VWigZ3/?mibextid=wwXIfr",
    freeShippingThreshold: 0,
    ...initialSettings
  });

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart, info, success
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [lastOrderId, setLastOrderId] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    const email = "01055673184hs@gmail.com";
    try {
      navigator.clipboard.writeText(email);
      showToast("تم نسخ البريد الإلكتروني بنجاح وجاري فتح صفحة الإرسال! ✉️", "success");
    } catch (err) {
      showToast("جاري فتح صفحة إرسال البريد الإلكتروني... ✉️", "info");
    }
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
  };

  // Reviews state for product modal
  const [productReviews, setProductReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ userName: "", rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [ratingFeedback, setRatingFeedback] = useState("رائع! يسعدنا جداً أن المنتج نال إعجابك الكامل! 🇩🇪✨");

  const ratingLabels = {
    5: "ممتاز (Excellent) ⭐⭐⭐⭐⭐",
    4: "جيد جداً (Very Good) ⭐⭐⭐⭐",
    3: "جيد (Good) ⭐⭐⭐",
    2: "مقبول (Fair) ⭐⭐",
    1: "سيء (Poor) ⭐"
  };

  const ratingFeedbacks = {
    5: "رائع! يسعدنا جداً أن المنتج نال إعجابك الكامل! 🇩🇪✨",
    4: "شكراً لك! نسعى دائماً لتقديم أفضل جودة ألمانية! ❤️",
    3: "شكراً لتقييمك، سنعمل دائماً على تحسين تجربتك! 👍",
    2: "نأسف لذلك، سنبذل قصارى جهدنا للتطوير وتجنب أي ملاحظات! 🛠️",
    1: "نعتذر منك بشدة، سنقوم بمراجعة تعليقك والعمل على حل المشكلة فوراً! 📞"
  };

  // Categories
  const defaultCategories = ["الكل", "فيتامينات ومكملات", "عناية بالبشرة", "مستلزمات شخصية"];
  const categories = Array.from(new Set([...defaultCategories, ...products.map(p => p.category).filter(Boolean)]));

  // Load cart and user from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
    const savedUser = localStorage.getItem("dm_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setReviewForm(prev => ({ ...prev, userName: user.name }));
      } catch (e) { }
    }
  }, []);

  // Reset review form when product modal changes
  useEffect(() => {
    setReviewSubmitted(false);
    setReviewForm({ userName: currentUser ? currentUser.name : "", rating: 5, comment: "" });
  }, [selectedProduct, currentUser]);

  // Save cart to localStorage
  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Auth handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("dm_user", JSON.stringify(data.user));
        setReviewForm(prev => ({ ...prev, userName: data.user.name }));
        setIsAuthModalOpen(false);
        setAuthForm({ name: "", email: "", password: "" });
        setShowPassword(false);
        showToast(authMode === "login" ? `أهلاً بك مجدداً يا ${data.user.name}! 👋` : `مرحباً بك ${data.user.name}! تم إنشاء حسابك بنجاح 🎉`);
      } else {
        setAuthError(data.error || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (err) {
      setAuthError("تعذر الاتصال بالخادم");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    const userName = currentUser?.name || "";
    setCurrentUser(null);
    localStorage.removeItem("dm_user");
    setReviewForm(prev => ({ ...prev, userName: "" }));
    showToast(`تم تسجيل خروجك بنجاح ${userName}. نتمنى رؤيتك قريباً! 👋`, "info");
  };

  // Add to cart handler
  const handleAddToCart = (product, size = "", color = "") => {
    const cartItemId = `${product.id}-${size || "none"}-${color || "none"}`;
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    let newCart = [];
    if (existingIndex > -1) {
      newCart = [...cart];
      newCart[existingIndex].quantity += 1;
    } else {
      newCart = [
        ...cart,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          size,
          color,
          quantity: 1
        }
      ];
    }

    saveCartToStorage(newCart);

    // Show toast or open cart
    setIsCartOpen(true);

    // Close detail modal if open
    setSelectedProduct(null);
    setSelectedSize("");
    setSelectedColor("");
  };

  // Update item quantity
  const updateQuantity = (cartItemId, change) => {
    const newCart = cart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    saveCartToStorage(newCart);
  };

  // Remove from cart
  const removeFromCart = (cartItemId) => {
    const newCart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCartToStorage(newCart);
  };

  // Calculate cart count & total
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Coupon discount calculation
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round(cartTotal * appliedCoupon.discountValue / 100)
      : Math.min(appliedCoupon.discountValue, cartTotal)
    : 0;

  // Dynamic shipping cost calculation
  const shippingCost = (settings.freeShippingThreshold > 0 && cartTotal >= settings.freeShippingThreshold)
    ? 0
    : settings.shippingFee;

  const orderTotal = cartTotal - couponDiscount + shippingCost;

  // Apply coupon handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponCode.trim())}`);
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || "كود غير صالح");
      }
    } catch {
      setCouponError("حدث خطأ في التحقق من الكود");
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Normalize Arabic text for robust searching
  const normalizeText = (text) => {
    if (!text) return "";
    return text.toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ـ/g, '') // Remove tatweel
      .replace(/[ًٌٍَُِّْ]/g, ''); // Remove diacritics
  };

  const normalizedSearch = normalizeText(searchQuery);

  // Filter & sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !normalizedSearch || 
        normalizeText(product.name).includes(normalizedSearch) ||
        normalizeText(product.description).includes(normalizedSearch);
      const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default order
    });

  // Handle Checkout submission
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("برجاء ملء جميع البيانات الأساسية المطلوبة");
      return;
    }

    try {
      // Create order in backend database (orders.json)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          notes: customerInfo.notes,
          items: cart,
          total: orderTotal
        })
      });

      if (res.ok) {
        const result = await res.json();
        const orderId = result.order.id;
        setLastOrderId(orderId);

        // Generate WhatsApp message content for dynamic merchant settings
        // Select one of the requested WhatsApp numbers randomly: 01153811346 and +201095932981
        const targetNumbers = ["201153811346", "201095932981"];
        const whatsappNumber = targetNumbers[Math.floor(Math.random() * targetNumbers.length)];
        const itemsText = cart.map(item => {
          let details = "";
          if (item.size) details += ` (مقاس: ${item.size})`;
          if (item.color) details += ` (لون: ${item.color})`;
          return `- *${item.name}* x${item.quantity} -> ${item.price * item.quantity} ج.م ${details}`;
        }).join("\n");

        const couponLine = appliedCoupon
          ? `\n*كود الخصم:* ${appliedCoupon.code} (-${couponDiscount} ج.م)`
          : "";

        const message = `طلب جديد من ${settings.storeName} 🛍️\n\n*رقم الطلب:* ${orderId}\n*العميل:* ${customerInfo.name}\n*الموبايل:* ${customerInfo.phone}\n*العنوان:* ${customerInfo.address}\n${customerInfo.notes ? `*ملاحظات:* ${customerInfo.notes}\n` : ""}\n*المنتجات:*\n${itemsText}\n\n*سعر المنتجات:* ${cartTotal} ج.م${couponLine}\n*تكلفة الشحن:* ${shippingCost === 0 ? "مجاني" : `${shippingCost} ج.م`}\n*إجمالي الحساب:* ${orderTotal} جنيه مصري 💵`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Clear cart and coupon
        saveCartToStorage([]);
        setAppliedCoupon(null);
        setCouponCode("");
        setCheckoutStep("success");

        // Open whatsapp in a new window/tab
        window.open(whatsappUrl, "_blank");
      } else {
        alert("حدث خطأ أثناء حفظ الطلب، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("حدث خطأ في الشبكة، برجاء المحاولة مجدداً.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          <div className={styles.logoArea}>
            <img src="/logo.jpg" alt="logo" className={styles.logoImage} />
            <span className={styles.logoText}>{settings.storeName}</span>
          </div>

          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="ابحث عن منتجات العناية، الفيتامينات، المكملات الألمانية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={styles.clearSearch}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className={styles.navActions}>
            <button
              onClick={() => {
                setCheckoutStep("cart");
                setIsCartOpen(true);
              }}
              className={styles.cartTrigger}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              <span className={styles.cartText}>السلة</span>
            </button>

            {currentUser ? (
              <div className={styles.userMenuWrapper}>
                <div className={styles.userGreeting}>
                  <UserCheck size={16} />
                  <span>{currentUser.name}</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn} title="تسجيل الخروج">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode("login"); setIsAuthModalOpen(true); }}
                className={styles.loginBtn}
              >
                <LogIn size={17} />
                <span>دخول</span>
              </button>
            )}

            {currentUser?.isAdmin && (
              <Link href="/admin" className={styles.adminLink}>
                <ShieldCheck size={18} />
                <span>لوحة التحكم</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      {!searchQuery && (
        <section className={styles.heroSection}>
        {/* Animated decorative circles */}
        <div className={styles.heroBgCircle1}></div>
        <div className={styles.heroBgCircle2}></div>
        <div className={styles.heroBgCircle3}></div>

        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>
              <span className={styles.heroPulse}></span>
              🇩🇪 منتجات ألمانية أصلية 100%
            </span>
            <h1 className={styles.heroTitle}>
              صحتك وجمالك<br />
              <span className={styles.heroGradientText}>من قلب ألمانيا لعندك</span>
            </h1>
            <p className={styles.heroSub}>
              تشكيلة حصرية من أقوى منتجات الصحة والعناية الشخصية من أشهر الماركات الألمانية — Mivolis, Balea, ebelin — بأسعار لا تُقارن مع ضمان الأصالة والجودة.
            </p>
            <div className={styles.heroButtons}>
              <a href="#products-list" className={styles.heroCTA}>
                تصفح المنتجات الآن
                <span className={styles.ctaArrow}>←</span>
              </a>
            </div>

            {/* Trust badges row */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🚚</span>
                <span>شحن لكل المحافظات</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💵</span>
                <span>الدفع عند الاستلام</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>✅</span>
                <span>ضمان أصلي 100%</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroGlassCard}>
              <div className={styles.glassCardEmoji}>💊</div>
              <span className={styles.glassCardTitle}>+{products.length > 0 ? products.length : 35} منتج</span>
              <span className={styles.glassCardSub}>ماركات ألمانية موثوقة</span>
            </div>
            <div className={styles.heroGlassCard2}>
              <div className={styles.glassCardEmoji}>⭐</div>
              <span className={styles.glassCardTitle}>4.8 تقييم</span>
              <span className={styles.glassCardSub}>رضا عملاء فائق</span>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* Filters and List */}
      <main id="products-list" className={`container ${styles.mainContent}`}>
        <div className={styles.filterSection}>
          <div className={styles.categoriesWrapper}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.activeCategory : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.sortWrapper}>
            <ArrowUpDown size={16} className={styles.sortIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>جاري تحميل المنتجات الرائعة...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingBag size={64} className={styles.emptyIcon} />
            <h2>لم نجد أي منتجات تطابق بحثك</h2>
            <p>جرب كلمات بحث أخرى أو تصفح فئات مختلفة.</p>
            <button
              onClick={() => { setSelectedCategory("الكل"); setSearchQuery(""); }}
              className="btn btn-primary"
            >
              عرض كل المنتجات
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => {
              const hasDiscount = product.oldPrice && product.oldPrice > product.price;
              const discountPercentage = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
              return (
                <div key={product.id} className={styles.productCard}>
                  <div
                    className={styles.imageWrapper}
                    onClick={() => {
                      setSelectedProduct(product);
                      setRatingFeedback(ratingFeedbacks[5]);
                      if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
                      if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/product-placeholder.png"; }}
                    />
                    <span className={styles.categoryBadge}>{product.category}</span>
                    {hasDiscount && (
                      <span className={styles.discountBadge}>خصم {discountPercentage}%</span>
                    )}
                    {product.stock <= 3 && product.stock > 0 && (
                      <span className={`${styles.stockWarning} ${hasDiscount ? styles.stockWarningWithDiscount : ""}`}>كمية محدودة!</span>
                    )}
                    {product.stock === 0 && (
                      <span className={styles.outOfStock}>نفد من المخزن</span>
                    )}
                    <div className={styles.cardHoverOverlay}>
                      <button className={styles.overlayViewBtn}>
                        <Eye size={18} />
                        تفاصيل المنتج
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardInfo}>
                    <h3
                      className={styles.productName}
                      onClick={() => {
                        setSelectedProduct(product);
                        setRatingFeedback(ratingFeedbacks[5]);
                        if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
                        if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
                      }}
                    >
                      {product.name}
                    </h3>

                    <div className={styles.ratingRow}>
                      <div className={styles.stars}>
                        <Star size={14} className={styles.starIconFill} />
                        <span>{Number(product.rating || 5).toFixed(1)}</span>
                      </div>
                      <span className={styles.stockText}>
                        {product.stock > 0 ? `متاح: ${product.stock} قطع` : "غير متوفر"}
                      </span>
                    </div>

                    <p className={styles.descriptionSnippet}>
                      {product.description.length > 80
                        ? product.description.slice(0, 80) + "..."
                        : product.description}
                    </p>

                    <div className={styles.cardFooter}>
                      <div className={styles.priceContainer}>
                        <span className={styles.priceValue}>{product.price}</span>
                        <span className={styles.priceCurrency}>ج.م</span>
                        {hasDiscount && (
                          <span className={styles.oldPrice}>{product.oldPrice} ج.م</span>
                        )}
                      </div>

                      <button
                        className={`btn btn-primary ${styles.addBtn}`}
                        disabled={product.stock === 0}
                        onClick={() => {
                          const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "";
                          const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : "";
                          handleAddToCart(product, defaultSize, defaultColor);
                        }}
                      >
                        <ShoppingCart size={16} />
                        إضافة للسلة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        {/* Animated Wave Top */}
        <div className={styles.footerWaveWrapper}>
          <svg className={styles.footerWave} viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="var(--secondary)" />
          </svg>
        </div>

        {/* Floating Particles */}
        <div className={styles.footerParticles} aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <span key={i} className={styles.footerParticle} style={{
              left: `${(i * 8.5) % 100}%`,
              animationDelay: `${(i * 0.6) % 5}s`,
              animationDuration: `${4 + (i % 4)}s`,
              width: `${4 + (i % 5)}px`,
              height: `${4 + (i % 5)}px`,
              opacity: 0.15 + (i % 3) * 0.08
            }} />
          ))}
        </div>

        <div className={`container ${styles.footerGrid}`}>
          {/* Col 1 — Brand */}
          <div className={`${styles.footerCol} ${styles.footerColAnim} ${styles.footerColDelay0}`}>
            <div className={styles.footerBrandRow}>
              <div className={styles.footerLogoRing}>
                <img src="/logo.jpg" alt="logo" className={styles.logoImageFooter} />
              </div>
              <span className={styles.logoTextFooter}>{settings.storeName}</span>
            </div>
            <p className={styles.footerDesc}>
              موقع تسوق إلكتروني متكامل يوفر لك أجود المنتجات الألمانية الأصلية بأفضل الأسعار مع خدمة عملاء وضمان كامل.
            </p>
            {/* Trust mini badges */}
            <div className={styles.footerTrustRow}>
              <span className={styles.footerTrustBadge}>🚚 شحن سريع</span>
              <span className={styles.footerTrustBadge}>✅ أصلي 100%</span>
              <span className={styles.footerTrustBadge}>💵 COD</span>
            </div>
          </div>

          {/* Col 2 — Store Sections */}
          <div className={`${styles.footerCol} ${styles.footerColAnim} ${styles.footerColDelay1}`}>
            <h4>أقسام المتجر</h4>
            <ul className={styles.footerLinks}>
              {categories.slice(1).map((cat, idx) => (
                <li key={cat} className={styles.footerLinkItem} style={{ animationDelay: `${0.6 + idx * 0.08}s` }}>
                  <button onClick={() => {
                    setSelectedCategory(cat);
                    const el = document.getElementById("products-list");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }} className={styles.footerLinkBtn}>
                    <span className={styles.footerLinkArrow}>←</span>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Customer Service */}
          <div className={`${styles.footerCol} ${styles.footerColAnim} ${styles.footerColDelay2}`}>
            <h4>خدمة العملاء</h4>
            <div className={styles.contactItem}>
              <span className={styles.contactIconWrap}><Phone size={15} /></span>
              <span>اتصل بنا / واتساب:<br />01153811346 / 01095932981</span>
            </div>
            {settings.facebookUrl && (
              <div className={styles.contactItem}>
                <span className={styles.contactIconWrap}>🌐</span>
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                  تابعنا على فيسبوك
                </a>
              </div>
            )}
            <div className={styles.contactItem}>
              <span className={styles.contactIconWrap}><MapPin size={15} /></span>
              <span>مقرنا الرئيسي: القاهرة، مصر</span>
            </div>
            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/201153811346`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerWhatsappBtn}
            >
              <span>💬</span>
              تواصل عبر واتساب
            </a>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className={styles.copyright}>
          <div className={styles.copyrightGlowLine} />
          <div className={`container ${styles.copyrightContainer}`}>
            <p className={styles.copyrightText}>
              © {new Date().getFullYear()} <span className={styles.copyrightBrand}>{settings.storeName}</span>. جميع الحقوق محفوظة.
            </p>

            <div className={styles.designerWrapper}>
              <div className={styles.designerText}>
                Designed By <span className={styles.designerName}>Eng / Ebrahiem Samir</span>
              </div>
              <div className={styles.designerTooltip}>
                <span className={styles.tooltipTitle}>تواصل مع المهندس إبراهيم:</span>
                <div className={styles.tooltipActions}>
                  <a href="https://wa.me/201055673184" target="_blank" rel="noopener noreferrer" className={styles.tooltipActionBtn} title="واتساب">
                    <span className={styles.tooltipIcon}>💬</span>
                    <span>واتساب</span>
                  </a>
                  <a
                    href="mailto:01055673184hs@gmail.com"
                    onClick={handleEmailClick}
                    className={styles.tooltipActionBtn}
                    title="البريد الإلكتروني"
                  >
                    <span className={styles.tooltipIcon}>✉️</span>
                    <span>الإيميل</span>
                  </a>
                </div>
              </div>
            </div>

            <Link href="/admin" className={styles.footerAdminBtn}>
              <ShieldCheck size={16} />
              لوحة تحكم المسؤول
            </Link>
          </div>
        </div>
      </footer>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className={styles.modalOverlay} onClick={() => { setSelectedProduct(null); setRatingFeedback(""); }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => { setSelectedProduct(null); setRatingFeedback(""); }}>
              <X size={20} />
            </button>

            <div className={styles.modalGrid}>
              <div className={styles.modalImageWrapper}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className={styles.modalImage}
                  onError={(e) => { e.target.onerror = null; e.target.src = "/product-placeholder.png"; }}
                />
                <span className={styles.imageZoomHint}>مرر لتكبير الصورة 🔍</span>
              </div>

              <div className={styles.modalInfo}>
                <span className="badge badge-primary">{selectedProduct.category}</span>
                <h2 className={styles.modalTitle}>{selectedProduct.name}</h2>

                <div className={styles.modalRating}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.round(selectedProduct.rating) ? styles.starIconFill : styles.starIconEmpty}
                      />
                    ))}
                    <span className={styles.ratingText}>
                      {Number(selectedProduct.rating || 5).toFixed(1)} {selectedProduct.reviewsCount > 0 ? `(${selectedProduct.reviewsCount} تقييم)` : "(لا توجد تقييمات)"}
                    </span>
                  </div>
                  <span className={`${styles.badge} ${selectedProduct.stock > 0 ? "badge-success" : "badge-danger"}`}>
                    {selectedProduct.stock > 0 ? `متوفر في المخزن: ${selectedProduct.stock} قطع` : "نفد من المخزن"}
                  </span>
                </div>

                <div className={styles.modalPriceContainer}>
                  <span className={styles.modalPrice}>{selectedProduct.price}</span>
                  <span className={styles.modalCurrency}>جنيه مصري</span>
                  {selectedProduct.oldPrice && selectedProduct.oldPrice > selectedProduct.price && (
                    <span className={styles.modalOldPrice}>{selectedProduct.oldPrice} جنيه مصري</span>
                  )}
                </div>

                <p className={styles.modalDesc}>{selectedProduct.description}</p>

                {/* Sizing options */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className={styles.optionGroup}>
                    <span className={styles.optionLabel}>اختر المقاس:</span>
                    <div className={styles.optionButtons}>
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`${styles.optionBtn} ${selectedSize === size ? styles.optionActive : ""}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color options */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className={styles.optionGroup}>
                    <span className={styles.optionLabel}>اختر اللون:</span>
                    <div className={styles.optionButtons}>
                      {selectedProduct.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`${styles.optionBtn} ${selectedColor === color ? styles.optionActive : ""}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key features list */}
                {selectedProduct.features && selectedProduct.features.length > 0 && (
                  <div className={styles.featuresListContainer}>
                    <span className={styles.optionLabel}>المميزات والمواصفات:</span>
                    <ul className={styles.featuresList}>
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx}>
                          <Check size={14} className={styles.checkIcon} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.modalActionRow}>
                  <button
                    className="btn btn-primary"
                    disabled={selectedProduct.stock === 0}
                    onClick={() => handleAddToCart(selectedProduct, selectedSize, selectedColor)}
                    style={{ flex: 1, padding: "1rem" }}
                  >
                    <ShoppingCart size={18} />
                    إضافة إلى سلة المشتريات
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className={styles.modalReviewsSection}>
              <div className={styles.reviewsSectionHeader}>
                <MessageSquare size={18} />
                <h4>تقييمات وآراء العملاء</h4>
              </div>

              {/* Reviews list - fetched per product */}
              <ReviewsList productId={selectedProduct.id} styles={styles} />

              {/* Submit Review Form */}
              <div className={styles.addReviewBox}>
                <h5>شاركنا رأيك في هذا المنتج 💬</h5>
                {reviewSubmitted ? (
                  <div className={styles.reviewThanks}>
                    <ThumbsUp size={20} />
                    <span>شكراً! سيتم مراجعة تقييمك ونشره قريباً.</span>
                  </div>
                ) : (
                  <form
                    className={styles.reviewForm}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!reviewForm.userName || !reviewForm.comment) return;
                      try {
                        await fetch("/api/reviews", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ ...reviewForm, productId: selectedProduct.id })
                        });
                        setReviewSubmitted(true);
                        setReviewForm({ userName: "", rating: 5, comment: "" });
                      } catch { }
                    }}
                  >
                    <input
                      type="text" required
                      className={`form-input ${styles.reviewInput}`}
                      placeholder="اسمك..."
                      value={reviewForm.userName}
                      onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    />
                    <div className={styles.ratingSelectorWrapper}>
                      <span className={styles.optionLabel}>تقييمك للمنتج:</span>
                      <div className={styles.reviewStarPicker}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button"
                            onClick={() => {
                              setReviewForm({ ...reviewForm, rating: s });
                              setRatingFeedback(ratingFeedbacks[s]);
                            }}
                            className={`${styles.reviewStarBtn} ${reviewForm.rating === s ? styles.reviewStarBtnActive : ""}`}
                          >
                            <Star size={26} fill={reviewForm.rating >= s ? "#d97706" : "none"} color={reviewForm.rating >= s ? "#d97706" : "#94a3b8"} />
                          </button>
                        ))}
                      </div>

                      {/* Active rating label */}
                      <div className={styles.activeRatingLabel}>
                        {ratingLabels[reviewForm.rating]}
                      </div>

                      {/* Stylish Animated Feedback Message */}
                      {ratingFeedback && (
                        <div key={reviewForm.rating} className={styles.ratingFeedbackToast}>
                          <span className={styles.feedbackPulse}></span>
                          <p>{ratingFeedback}</p>
                        </div>
                      )}
                    </div>
                    <textarea required
                      className={`form-textarea ${styles.reviewInput}`}
                      placeholder="اكتب رأيك هنا..."
                      rows={3}
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                      <Star size={15} /> إرسال التقييم
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className={styles.cartDrawerOverlay} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <div className={styles.cartHeaderTitle}>
                <ShoppingCart size={20} />
                <h3>سلة المشتريات</h3>
                <span className={styles.cartTotalBadge}>{cartCount}</span>
              </div>
              <button className={styles.cartCloseBtn} onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {checkoutStep === "cart" && (
              <>
                {cart.length === 0 ? (
                  <div className={styles.emptyCart}>
                    <ShoppingCart size={48} className={styles.emptyCartIcon} />
                    <h4>السلة فارغة حالياً</h4>
                    <p>أضف بعض المنتجات لبدء التسوق!</p>
                    <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
                      تصفح المنتجات
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.cartItemsList}>
                      {cart.map((item) => (
                        <div key={item.cartItemId} className={styles.cartItemCard}>
                          <img src={item.image} alt={item.name} className={styles.cartItemImg} />
                          <div className={styles.cartItemDetails}>
                            <h4>{item.name}</h4>
                            <div className={styles.cartItemMeta}>
                              {item.size && <span>المقاس: {item.size}</span>}
                              {item.color && <span>اللون: {item.color}</span>}
                            </div>
                            <span className={styles.cartItemPrice}>{item.price} ج.م</span>
                          </div>

                          <div className={styles.qtyControls}>
                            <button onClick={() => updateQuantity(item.cartItemId, 1)}>
                              <Plus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, -1)}>
                              <Minus size={14} />
                            </button>
                          </div>

                          <button
                            className={styles.removeItemBtn}
                            onClick={() => removeFromCart(item.cartItemId)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className={styles.cartFooterPanel}>
                      {/* Coupon Code Input */}
                      <div className={styles.couponInputRow}>
                        {appliedCoupon ? (
                          <div className={styles.couponApplied}>
                            <Tag size={14} />
                            <span>تم تطبيق: <strong>{appliedCoupon.code}</strong></span>
                            <button className={styles.removeCouponBtn} onClick={handleRemoveCoupon}>
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className={styles.couponInputGroup}>
                            <input
                              type="text"
                              className={styles.couponInput}
                              placeholder="كود الخصم..."
                              value={couponCode}
                              onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                              onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                            />
                            <button className={styles.couponApplyBtn} onClick={handleApplyCoupon} disabled={couponLoading}>
                              {couponLoading ? "..." : "تطبيق"}
                            </button>
                          </div>
                        )}
                        {couponError && <p className={styles.couponError}>{couponError}</p>}
                      </div>

                      <div className={styles.cartSummaryRow}>
                        <span>المجموع الفرعي:</span>
                        <strong>{cartTotal} ج.م</strong>
                      </div>
                      {couponDiscount > 0 && (
                        <div className={styles.cartSummaryRow} style={{ color: "var(--success)" }}>
                          <span>خصم الكوبون ({appliedCoupon.code}):</span>
                          <strong>- {couponDiscount} ج.م</strong>
                        </div>
                      )}
                      <div className={styles.cartSummaryRow}>
                        <span>تكلفة الشحن:</span>
                        <span className={styles.accentText}>
                          {shippingCost === 0 ? "شحن مجاني" : `${shippingCost} ج.م`}
                        </span>
                      </div>
                      <div className={styles.cartSummaryRow} style={{ borderTop: "1px solid var(--border)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                        <strong>الحساب الإجمالي:</strong>
                        <strong>{orderTotal} ج.م</strong>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => setCheckoutStep("info")}
                        style={{ width: "100%", marginTop: "1rem" }}
                      >
                        إدخال بيانات التوصيل والتأكيد
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {checkoutStep === "info" && (
              <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
                <div className={styles.formHeader}>
                  <h4>بيانات الشحن والتسليم</h4>
                  <p>سيتم إرسال تفاصيل الطلب وتأكيده معك عبر الواتساب</p>
                </div>

                <div className="form-group">
                  <label className="form-label">الاسم بالكامل *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="مثال: محمد أحمد علي"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">رقم الموبايل (عليه واتساب) *</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    placeholder="مثال: 01012345678"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">عنوان التوصيل بالتفصيل *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="المحافظة، المدينة، الشارع، رقم العمارة"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ملاحظات إضافية (اختياري)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="أي تعليمات خاصة لشركة الشحن..."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  />
                </div>

                <div className={styles.checkoutSummary}>
                  <div className={styles.cartSummaryRow}>
                    <span>المنتجات ({cartCount}):</span>
                    <span>{cartTotal} ج.م</span>
                  </div>
                  <div className={styles.cartSummaryRow}>
                    <span>تكلفة الشحن:</span>
                    <span>{shippingCost === 0 ? "مجاني" : `${shippingCost} ج.م`}</span>
                  </div>
                  <div className={styles.cartSummaryRow} style={{ borderTop: "1px solid var(--border)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <strong>الحساب الإجمالي:</strong>
                    <strong>{orderTotal} ج.م</strong>
                  </div>
                </div>

                <div className={styles.checkoutActions}>
                  <button
                    type="submit"
                    className="btn btn-whatsapp"
                    style={{ width: "100%" }}
                  >
                    <ShoppingCart size={18} />
                    تأكيد الطلب عبر واتساب 💬
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCheckoutStep("cart")}
                    style={{ width: "100%" }}
                  >
                    العودة للسلة
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === "success" && (
              <div className={styles.successState}>
                <div className={styles.successBadgeIcon}>
                  <Check size={40} />
                </div>
                <h3>تم إرسال طلبك بنجاح! 🎉</h3>
                <p className={styles.orderNumberText}>رقم الطلب الخاص بك: <strong>{lastOrderId}</strong></p>
                <p>لقد فتحنا نافذة جديدة لإرسال الفاتورة والتفاصيل إلينا مباشرة عبر الواتساب لتأكيد الشحن الفوري.</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  إذا لم يتم فتح الواتساب تلقائياً، يمكنك إغلاق السلة والاتصال بنا مباشرة.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep("cart");
                  }}
                  style={{ width: "100%", marginTop: "1.5rem" }}
                >
                  العودة للمتجر
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================= AUTH MODAL ========================= */}
      {isAuthModalOpen && (
        <div className={styles.authOverlay} onClick={() => setIsAuthModalOpen(false)}>
          <div className={styles.authModal} onClick={e => e.stopPropagation()}>
            <button className={styles.authClose} onClick={() => setIsAuthModalOpen(false)}>
              <X size={20} />
            </button>

            <div className={styles.authHeader}>
              <div className={styles.authLogoContainer}>
                <img src="/logo.jpg" alt="DM Germany Logo" className={styles.authLogoImg} />
              </div>
              <h2 className={styles.authTitle}>
                {authMode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h2>
              <p className={styles.authSubtitle}>
                {authMode === "login"
                  ? "أهلاً بك! سجّل دخولك لإتمام تجربتك"
                  : "انضم إلينا واستمتع بتجربة تسوق مميزة 🇩🇪"}
              </p>
            </div>

            <form onSubmit={handleAuth} className={styles.authForm}>
              {authMode === "register" && (
                <div className={styles.authField}>
                  <label className={styles.authLabel}>
                    <User size={15} /> الاسم الكامل
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد"
                    className={styles.authInput}
                    value={authForm.name}
                    onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}

              <div className={styles.authField}>
                <label className={styles.authLabel}>
                  <Mail size={15} /> البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  placeholder="example@email.com"
                  className={styles.authInput}
                  value={authForm.email}
                  onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>

              <div className={styles.authField}>
                <label className={styles.authLabel}>
                  <Lock size={15} /> كلمة المرور
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={authMode === "register" ? "6 أحرف على الأقل" : "••••••••"}
                    className={`${styles.authInput} ${styles.passwordInput}`}
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className={styles.authError}>
                  <X size={14} /> {authError}
                </div>
              )}

              <button type="submit" disabled={authLoading} className={styles.authSubmitBtn}>
                {authLoading ? (
                  <span className={styles.authSpinner}></span>
                ) : authMode === "login" ? (
                  <><LogIn size={17} /> دخول</>
                ) : (
                  <><UserPlus size={17} /> إنشاء الحساب</>
                )}
              </button>
            </form>

            <div className={styles.authToggle}>
              {authMode === "login" ? (
                <>
                  <span>ليس لديك حساب؟</span>
                  <button className={styles.authToggleBtn} onClick={() => { setAuthMode("register"); setAuthError(""); }}>
                    سجّل الآن
                  </button>
                </>
              ) : (
                <>
                  <span>لديك حساب بالفعل؟</span>
                  <button className={styles.authToggleBtn} onClick={() => { setAuthMode("login"); setAuthError(""); }}>
                    سجّل الدخول
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ========================= TOAST NOTIFICATION ========================= */}
      {toast.show && (
        <div className={`${styles.toastOverlay} ${toast.type === "info" ? styles.toastInfo : styles.toastSuccess}`}>
          <div className={styles.toastContent}>
            <span className={styles.toastIcon}>
              {toast.type === "info" ? "👋" : "✅"}
            </span>
            <span className={styles.toastMessage}>{toast.message}</span>
            <button className={styles.toastClose} onClick={() => setToast({ show: false, message: "", type: "success" })}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
