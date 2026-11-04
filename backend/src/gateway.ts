import express, { Request, Response } from "express";

const app = express();

const PORT = 4000;

const BACKEND_URL = "http://127.0.0.1:3000";
const PRODUCT_SERVICE_URL = "http://127.0.0.1:4001";
const AUTH_SERVICE_URL = "http://127.0.0.1:4002";
const ORDER_SERVICE_URL = "http://127.0.0.1:4003";

app.use(express.json());

// Gateway health check
app.get("/", (req: Request, res: Response) => {
  console.log("GATEWAY HEALTH ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "API Gateway is running!",
  });
});

// Auth Service health check
app.get(["/auth", "/auth/"], async (req: Request, res: Response) => {
  console.log("AUTH HEALTH ROUTE HIT");

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/`);
    const data = await response.text();

    res.status(response.status);

    const contentType = response.headers.get("content-type");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.send(data);
  } catch (error) {
    console.error("Auth Service error:", error);

    res.status(502).json({
      success: false,
      message: "Auth Service unavailable",
    });
  }
});

// API Gateway routing
app.use(async (req: Request, res: Response) => {
  try {
    let targetBaseUrl = BACKEND_URL;

    const targetPath = req.originalUrl;

    if (
      req.path === "/products" ||
      req.path.startsWith("/products/")
    ) {
      targetBaseUrl = PRODUCT_SERVICE_URL;
    } else if (
      req.path === "/orders" ||
      req.path.startsWith("/orders/")
    ) {
      targetBaseUrl = ORDER_SERVICE_URL;
    }

    const targetUrl = `${targetBaseUrl}${targetPath}`;

    console.log("Gateway forwarding:", req.method, targetUrl);

    const headers: Record<string, string> = {};

    for (const [key, value] of Object.entries(req.headers)) {
      if (
        value &&
        !["host", "connection", "content-length"].includes(
          key.toLowerCase()
        )
      ) {
        headers[key] = Array.isArray(value)
          ? value.join(", ")
          : value;
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    });

    const data = await response.text();

    res.status(response.status);

    const contentType = response.headers.get("content-type");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.send(data);
  } catch (error) {
    console.error("Gateway forwarding error:", error);

    res.status(502).json({
      success: false,
      message: "Backend service unavailable",
    });
  }
});

// Start Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});