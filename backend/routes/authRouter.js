import { Router } from "express";
import { connectDB } from "../db/mongoDB.js";
import { generateJWT, verifyJWT } from "../utils/jwtUtils.js";

const router = Router();

router.post("/login", async (req, res) => {
  console.log("Login route reached: ", req.body);
  try {
    const { username, password } = req.body;
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ username });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect details" });
    }

    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect details" });
    }

    const token = generateJWT(user.userId);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  console.log("Sign up route reached: ", req.body);

  try {
    const { username, firstName, password } = req.body;

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ username });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const lastUser = await users.find().sort({ userId: -1 }).limit(1).toArray();

    let newUserId = 1;
    if (lastUser.length > 0) {
      newUserId = lastUser[0].userId + 1;
    }

    await users.insertOne({
      userId: newUserId,
      username,
      firstName,
      password,
    });

    const token = generateJWT(newUserId);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.error(error);
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne(
      { userId: decoded.userId },
      { projection: { password: 0 } },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const db = await connectDB();

    const logResult = await db.collection("sessionLogs").deleteMany({
      userId: decoded.userId,
    });

    console.log(
      `Deleted ${logResult.deletedCount} session logs for user ${decoded.userId}`,
    );

    const userResult = await db.collection("users").deleteOne({
      userId: decoded.userId,
    });

    if (userResult.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: "Account and all session logs have been removed.",
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.patch("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { firstName } = req.body;
    if (!firstName || firstName.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Name cannot be empty" });
    }

    const db = await connectDB();
    const result = await db
      .collection("users")
      .updateOne(
        { userId: decoded.userId },
        { $set: { firstName: firstName.trim() } },
      );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: "Name updated" });
    } else {
      res.status(400).json({ success: false, message: "No changes made" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    console.error(error);
  }
});

export default router;
