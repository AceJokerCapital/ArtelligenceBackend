import express from "express"; //external libraies
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js"; //inernal libraries
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { mongoose } from "mongoose";

dotenv.config();

const app = express();

const AllowedOrigin = process.env.ALLOWED_ORIGINS;

app.use(
  cors({
    origin: (origin, callback) => {
      const originArray = AllowedOrigin.split(",").map((urls) => {
        return urls.trim().toLowerCase();
      });

      if (!origin) {
        return callback(null, true); // allow server-to-server calls
      }

      if (!originArray.includes(origin.toLowerCase())) {
        return callback(new Error(`Not allowed by CORS, origin: ${origin}`));
      }

      //success
      return callback(null, true);
    },
    credentials: true, // allow cookies/auth headers if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight
app.options("*", cors());
app.disable("strict routing");

//APP USE
app.use(express.json({ limit: "50mb" }));

await connectDB(process.env.MONGODB_URL);
const mongoDb = mongoose.connection;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "artelligence-auth-tkn",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoDb.getClient(),
      collectionName: "session",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

//ROUTES
app.use("/api/v1/post-x", postRoutes); //created api endpoints or access route like app.get is using the '/' route this will use the '/api/v1/post' to execute queries
app.use("/api/v1/dalle-x", dalleRoutes);
app.use("/api/v1/user-x", userRoutes);

app.get("/", async (req, res) => {
  //created an endpoint '/' or route
  res.send("Welcome To Artelligence API");
});

const startserver = async () => {
  try {
    app.listen(8080, () => {
      console.log("Server has started on port http://localhost:8080/");
      console.log(AllowedOrigin);
    });
  } catch (error) {
    console.log(error);
  }
};

startserver();
