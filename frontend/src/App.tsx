

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Search,
  UserRound,
  ArrowRight,
  Plus,
  X,
  LogOut,
} from "lucide-react";

type Product = {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
};

type User = {
  id: number;
  email: string;
  role: string;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const demo: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    category: "Audio",
    description: "Immersive sound for work and play.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Everyday Backpack",
    price: 1899,
    category: "Lifestyle",
    description: "A clean, practical everyday carry.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Minimal Watch",
    price: 3299,
    category: "Accessories",
    description: "A timeless design for every day.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Running Sneakers",
    price: 2799,
    category: "Footwear",
    description: "Comfort that keeps you moving.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Desk Lamp",
    price: 1499,
    category: "Home",
    description: "Warm light for focused moments.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Coffee Set",
    price: 999,
    category: "Home",
    description: "Make your slow mornings special.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558f?auto=format&fit=crop&w=900&q=80",
  },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

async function call(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(API + path, {
    ...init,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [modal, setModal] = useState(false);
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    call("/products")
      .then((data) =>
        setProducts(
          Array.isArray(data)
            ? data
            : data.products || data.data || []
        )
      )
      .catch((error) => {
        setApiError(error.message);
        setProducts(demo);
      })
      .finally(() => setLoading(false));

    if (localStorage.getItem("token")) {
      call("/auth/me")
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((p) => p.category).filter(Boolean) as string[])
      ),
    ],
    [products]
  );

  const shown = products.filter(
    (product) =>
      (cat === "All" || product.category === cat) &&
      product.name.toLowerCase().includes(search.toLowerCase())
  );

  const add = async (product: Product) => {
    if (localStorage.getItem("token")) {
      try {
        await call("/cart", {
          method: "POST",
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        });
      } catch (error) {
        setToast((error as Error).message);
        return;
      }
    }

    setCart((current) => [...current, product]);
    setToast(`${product.name} added to bag`);
    setTimeout(() => setToast(""), 2200);
  };

  const authenticate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (register) {
        await call("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });

        setRegister(false);
        setToast("Account created. Please sign in.");
      } else {
        const data = await call("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        const token = data.token || data.accessToken;

        if (!token) {
          throw new Error("Login response did not contain a token");
        }

        localStorage.setItem("token", token);

        // Sync guest cart items to the backend after login.
        for (const product of cart) {
          await call("/cart", {
            method: "POST",
            body: JSON.stringify({
              productId: product.id,
              quantity: 1,
            }),
          });
        }

        setUser(data.user || null);
        setModal(false);
        setToast("Welcome back!");
      }
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  const checkout = async () => {
    if (!localStorage.getItem("token")) {
      setRegister(false);
      setModal(true);
      setToast("Please sign in before placing your order.");
      return;
    }

    if (cart.length === 0) {
      setToast("Your bag is empty.");
      return;
    }

    try {
      setCheckoutLoading(true);

      const result = await call("/orders", {
        method: "POST",
      });

      setCart([]);
      setToast(result.message || "Order placed successfully!");
    } catch (error) {
      setToast((error as Error).message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToast("Logged out successfully");
  };

  return (
    <>
      <div className="topline">
        Thoughtful finds for everyday living <b>✦</b> Free shipping over ₹1,999
      </div>

      <header>
        <a className="logo" href="#">
          s<span>h</span>opease.
        </a>

        <nav>
          <a href="#shop">Shop</a>
          <a href="#story">Our story</a>
          <a href="#footer">Contact</a>
        </nav>

        <div className="actions">
          <label>
            <Search size={16} />
            <input
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <button onClick={() => (user ? logout() : setModal(true))}>
            {user ? <LogOut /> : <UserRound />}
          </button>

          <a href="#bag">
            <ShoppingBag /> Bag <b>{cart.length}</b>
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <small>✦ THOUGHTFULLY PICKED FOR YOU</small>
            <h1>
              Good things.
              <br />
              <i>Everyday.</i>
            </h1>
            <p>
              Discover useful, beautiful things that make the everyday feel a
              little more special.
            </p>
            <a className="btn" href="#shop">
              Explore the collection <ArrowRight size={17} />
            </a>
            <p className="sub">— Curated essentials, made simple.</p>
          </div>

          <div className="heroimg">
            <img
              src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=85"
              alt="Thoughtfully styled home essentials"
            />
            <div className="float">
              THE EDIT
              <h3>
                Find your
                <br />
                new favourite.
              </h3>
              <small>Small joys, big impact.</small>
            </div>
          </div>
        </section>

        <div className="promises">
          <span>01　Thoughtful selection</span>
          <span>02　Quality you can trust</span>
          <span>03　Easy, secure checkout</span>
        </div>

        <section id="shop" className="shop">
          <div className="heading">
            <div>
              <small>THE COLLECTION</small>
              <h2>
                Made for your <i>everyday.</i>
              </h2>
            </div>
            <p>
              Useful finds. Lovely details.
              <br />
              Things you'll reach for again and again.
            </p>
          </div>

          <div className="filters">
            {categories.map((category) => (
              <button
                className={cat === category ? "chosen" : ""}
                onClick={() => setCat(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>

          {apiError && (
            <p className="warning">
              Backend connection unavailable ({apiError}). Showing sample
              products for now.
            </p>
          )}

          {loading ? (
            <p>Loading products…</p>
          ) : (
            <div className="grid">
              {shown.map((product, index) => (
                <article key={product.id}>
                  <div className="photo">
                    <img
                      src={product.image || demo[index % demo.length].image}
                      alt={product.name}
                    />
                    <button onClick={() => add(product)}>
                      <Plus size={16} /> Add to bag
                    </button>
                  </div>

                  <small>{product.category || "CURATED PICK"}</small>

                  <div className="productline">
                    <h3>{product.name}</h3>
                    <b>{fmt(Number(product.price))}</b>
                  </div>

                  <p>
                    {product.description ||
                      "A thoughtful pick for your everyday routine."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="story" className="story">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85"
            alt="Store interior"
          />

          <div>
            <small>A MORE CONSIDERED WAY TO SHOP</small>
            <h2>
              Less noise.
              <br />
              <i>More meaning.</i>
            </h2>
            <p>
              ShopEase brings together everyday essentials with thoughtful
              design, useful details and quality you can feel good about.
            </p>
            <a href="#shop">
              Discover the collection <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section id="bag" className="bag">
          <div>
            <small>YOUR PICKS</small>
            <h2>
              Your shopping <i>bag.</i>
            </h2>
          </div>

          <div>
            {cart.length ? (
              cart.map((product, index) => (
                <div className="cartrow" key={`${product.id}-${index}`}>
                  <span>{product.name}</span>
                  <b>{fmt(Number(product.price))}</b>
                  <button
                    onClick={() =>
                      setCart((current) =>
                        current.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p>
                Your bag is waiting for something lovely.{" "}
                <a href="#shop">Start exploring →</a>
              </p>
            )}

            <h3>
              Subtotal:{" "}
              {fmt(
                cart.reduce(
                  (total, product) => total + Number(product.price),
                  0
                )
              )}
            </h3>

            {cart.length > 0 && (
              <button
                className="btn"
                onClick={checkout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Placing order..." : "Continue to checkout"}
                {!checkoutLoading && <ArrowRight size={16} />}
              </button>
            )}
          </div>
        </section>
      </main>

      <footer id="footer">
        <a className="logo" href="#">
          sh<span>o</span>pease.
        </a>
        <span>Everyday essentials, thoughtfully found.</span>
        <small>© 2025 ShopEase</small>
      </footer>

      {toast && <div className="toast">{toast}</div>}

      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setModal(false)}>
              <X />
            </button>

            <small>{register ? "JOIN SHOPEASE" : "WELCOME BACK"}</small>

            <h2>{register ? "Create an account." : "Good to see you."}</h2>

            <form onSubmit={authenticate}>
              {register && (
                <input
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              )}

              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button className="btn">
                {register ? "Create account" : "Sign in"}{" "}
                <ArrowRight size={16} />
              </button>
            </form>

            <p>
              {register
                ? "Already have an account?"
                : "New to ShopEase?"}{" "}
              <button onClick={() => setRegister(!register)}>
                {register ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
