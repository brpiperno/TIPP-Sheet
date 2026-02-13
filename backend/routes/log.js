//log.js

import express from "express";
const router = express.Router();

const logs = [
  {
    emotionBefore: "anger",
    distressBefore: 1,
    emotionAfter: "powerful",
    distressAfter: 2,
    temperatureTime: 45,
    exerciseTime: 432,
    breathingTime: 64,
    relaxationTime: 254,
  },
  {
    emotionBefore: "sad",
    distressBefore: 5,
    emotionAfter: "joy",
    distressAfter: 3,
    temperatureTime: 45,
    exerciseTime: 432,
    breathingTime: 64,
    relaxationTime: 254,
  },
];

router.get("/log", (req, res) => {
  res.json({ logs});
});

export default router;