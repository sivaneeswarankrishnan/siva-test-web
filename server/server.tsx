require("dotenv").config({path: "./config.env"})
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debugging

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Define Mongoose Schema
const ActivitySchema = new mongoose.Schema({
  activity: String,
  price: Number,
  type: String,
  bookingRequired: Boolean,
  accessibility: Number,
});

const Activity = mongoose.model("Activity", ActivitySchema);

// CREATE Activity
app.post("/activities", async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ Activities
app.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Activity
app.put("/activities/:id", async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE Activity
app.delete("/activities/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
