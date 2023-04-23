const express = require("express");
const cors = require("cors");
const routes = require('./routes');
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3001;

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Passport setup for Google OAuth
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, done) {
            // Handle user authentication here
            return done(null, profile);
        }
    )
);

app.use(passport.initialize());

// Google OAuth route
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/");
    }
);

// Add your API routes here


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/api/user', (req, res) => {
    res.json({ message: 'Hello from the backend server!' });
});

