const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const { COOKIE_MAX_AGE } = require("../utils/constants");

const getSessionConfig = (dbUrl) => {
    const secret = process.env.SESSION_SECRET || "fallbacksecret123";

    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: secret,
        },
        touchAfter: 24 * 60 * 60,
    });

    store.on("error", (err) => {
        console.log("Error in Session Store:", err);
    });

    return session({
        store,
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: Date.now() + COOKIE_MAX_AGE,
            maxAge: COOKIE_MAX_AGE,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
    });
};

module.exports = getSessionConfig;
