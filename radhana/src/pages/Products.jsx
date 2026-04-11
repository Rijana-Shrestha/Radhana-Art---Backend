import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductContext } from "../context/ProductsContext";
import { AuthContext } from "../context/AuthContext";

const Products = () => {
  const { addToCart } = useCart();
  const { fetchProducts } = useContext(ProductContext);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState("");
  const [addedToCart, setAddedToCart] = useState(null);

  const handleAddToCart = (product) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to login page
      navigate('/login');
      return;
    }

    try {
      addToCart(product);
      setAddedToCart(product.name);
      setTimeout(() => setAddedToCart(null), 2000); // Show notification for 2 seconds
      console.log(`Added ${product.name} to cart`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setServerError('Failed to add item to cart');
    }
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setError(false);
        setServerError("");
      } else {
        setProducts([]);
        setError(true);
        setServerError("No products available at the moment.");
      }
      console.log(data)
    } catch (error) {
      console.log(error)
      setError(true);
      setProducts([]);
      setServerError("Unable to connect to the server. Please try again later.");
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Apply filters and sorting
  useEffect(() => {
    let result = products;

    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [sortBy, categoryFilter, products]);

  return (
    <main>
      <section className="bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Explore our collection of beautifully laser-engraved items
          </p>
        </div>
      </section>

      {/* Toast Notification */}
      {addedToCart && (
        <div className="fixed top-20 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ {addedToCart} added to cart!
        </div>
      )}

      <section className="py-12 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-72">
              <div className="sticky top-20">
                <div className="mb-8 bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                          categoryFilter === cat
                            ? "bg-blue-600 text-white font-medium"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-bold">{filteredProducts.length}</span>{" "}
                  products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-600"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {error ? (
                  <div className="col-span-full text-center py-16">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 inline-block">
                      <p className="text-xl text-red-700 font-semibold">⚠️ Server Error</p>
                      <p className="text-red-600 mt-2">{serverError}</p>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-xl text-gray-600 font-semibold">No Products Available</p>
                    <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
                  >
                    <div className="relative overflow-hidden bg-gray-100 h-48">
                      <img
                        src={product.imageUrls?.[0] || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27300%27%3E%3Crect fill=%27%23f0f0f0%27 width=%27300%27 height=%27300%27/%3E%3C/svg%3E'}
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Popular
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-blue-600 font-semibold mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < Math.floor(product.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">
                          Rs. {product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-8 lg:px-12 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Don't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We can create custom designs for any product. Get in touch for a
            personalized quote!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Request Custom Design
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Products;
