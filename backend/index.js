const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken

// Automatically parse JSON request bodies
app.use(express.json());
// Use CORS to allow cross-origin requests
app.use(cors());

// Database Connection with MongoDB
mongoose
  .connect(
    "mongodb+srv://dusandinic027:dusan123456Dd@cluster0.bcpgv.mongodb.net/e-commerce",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// API Creation
app.get("/", (req, res) => {
  res.send("Express app is running!");
});

// Image Store Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./upload/images";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Create Upload Endpoint for Image
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({
      success: 0,
      message: "No file received",
    });
  } else {
    console.log("file received: ", req.file);
    return res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
  }
});

// Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  const { name, image, category, new_price, old_price } = req.body;

  if (!name || !image || !category || !new_price || !old_price) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  try {
    await product.save();
    console.log("Saved.");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to save product",
    });
  }
});

// Creating API for deleting products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed.");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find({}).lean();
    console.log("All products fetched.");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

// Schema for creating user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: Object,
    default: {},
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating endpoint for registering the users
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, errors: "Existing user with same email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//Creating endpoint  for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: "true", token });
    } else {
      res.json({ success: "false", errors: "Wrong password" });
    }
  } else {
    res.json({ success: "false", errors: "Wrong email" });
  }
});
// sada se prikazuju slike koje su dodate preko apija admina ko men,women,kid
//kada dodamo novu sliku ona se prikazuje u new collections
// creating endpoint for new collections data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  //prikazace zadnjih dodatih 8 proizvoda
  let newcollection = products.slice(1).slice(-8);
  // console.log("New collections fetched");
  res.send(newcollection);
});

//creating endpoint for popular in women category
// Endpoint for fetching popular products in women category
app.get("/popularinwomen", async (req, res) => {
  try {
    //console.log("Fetching popular products in women category...");
    let products = await Product.find({ category: "women" }).lean();
    // console.log("Products fetched from database:", products);

    let popular_in_women = products.slice(0, 3);
    //console.log("Popular in women fetched:", popular_in_women);

    res.send(popular_in_women);
  } catch (error) {
    //console.error("Error fetching popular products in women category:", error);
    res.status(500).send("Error fetching popular products in women category");
  }
});

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }
};

// Endpoint for adding products in cartdata
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    // Log request body and user data for debugging
    console.log("Request body:", req.body);
    console.log("User data:", req.user);

    // Find the user by ID
    let userData = await Users.findOne({ _id: req.user.id });

    // Update the cartData
    if (userData.cartData[req.body.itemid]) {
      userData.cartData[req.body.itemid] += 1;
    } else {
      userData.cartData[req.body.itemid] = 1;
    }

    // Save the updated user data
    await Users.findByIdAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    // Respond with a JSON object
    res.json({
      success: true,
      message: "Item added to cart",
      itemid: req.body.itemid,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
});

//creating endpoint to remove item from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    // Log request body and user data for debugging
    console.log("Request body:", req.body);
    console.log("User data:", req.user);

    // Find the user by ID
    let userData = await Users.findOne({ _id: req.user.id });

    // Update the cartData
    if (userData.cartData[req.body.itemid] > 0) {
      userData.cartData[req.body.itemid] -= 1;
    } else {
      userData.cartData[req.body.itemid] = 1;
    }

    // Save the updated user data
    await Users.findByIdAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );

    // Respond with a JSON object
    res.json({
      success: true,
      message: "Item removed from cart",
      itemid: req.body.itemid,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
});

//creating endpoint to get cartdata
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }
    res.json(user.cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
