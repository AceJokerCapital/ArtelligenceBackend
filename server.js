import express from "express"; //external libraies
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js"; //inernal libraries
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

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
app.use(express.json({ limit: "50mb" }));
app.disable("strict routing");

//an api endpoint is like a home directory within it many api requests will be executed such as get post etc. to that endpoint
/* app.use((req, res, next) => {
  if (req.path.substr(-1) === "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.slice(0, -1) + query);
  }
  next();
}); */

app.use("/api/v1/post-x", postRoutes); //created api endpoints or access route like app.get is using the '/' route this will use the '/api/v1/post' to execute queries
app.use("/api/v1/dalle-x", dalleRoutes);
app.use("/api/v1/user-x", userRoutes);


app.get("/", async (req, res) => {
  //created an endpoint '/' or route
  res.send("Welcome To Artelligence API");
});

const startserver = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log("Server has started on port http://localhost:8080/");
      console.log(AllowedOrigin);
    });
  } catch (error) {
    console.log(error);
  }
};

startserver();
