if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const helmet = require("helmet");

const ExpressError = require("./utils/ExpressError");
const { connectDB, closeDB } = require("./config/database");
const getSessionConfig = require("./config/session");
const passportConfig = require("./config/passport");

// Routers
const listingRouter = require("./routes/listing.routes");
const reviewRouter = require("./routes/review.routes");
const userRouter = require("./routes/user.routes");

const PORT = process.env.PORT || 3000;

// App Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for now to allow mapbox/leaflet scripts

// Initialize App
const initApp = async () => {
  // 1. Connect DB (Cloud or In-Memory fallback)
  const dbUrl = await connectDB();

  // 2. Setup Session
  app.use(getSessionConfig(dbUrl));
  app.use(flash());

  // 3. Setup Passport Auth
  passportConfig(app);

  // 4. Global Middleware
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });

  // 5. Routes
  app.get("/", (req, res) => res.redirect("/listings"));
  app.use("/listings", listingRouter);
  app.use("/listings/:id/reviews", reviewRouter);
  app.use("/", userRouter);

  // 6. 404 Handler
  app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
  });

  // 7. Global Error Handler
  app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
  });

  // 8. Start Server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
  });

  // Graceful Shutdown
  const gracefulShutdown = async () => {
    console.log("\nShutting down gracefully...");
    server.close(async () => {
      console.log("Closed out remaining connections.");
      await closeDB();
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
};

initApp();
