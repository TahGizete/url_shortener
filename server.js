import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { nanoid } from "nanoid"

const app = express()

// --- Middleware ---
app.use(cors()) // Allows React app (port 5173) to connect
app.use(express.json()) // Parses incoming JSON data

// --- Database Connection ---
mongoose
  .connect("mongodb://127.0.0.1:27017/urlShortener")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// --- Database Schema & Model ---
const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  urlCode: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
})

const Url = mongoose.model("Url", urlSchema)

// --- Routes ---

/**
 * @route   POST /shorten
 * @desc    Create a short URL
 */
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body
  const baseUrl = "http://localhost:5000"

  console.log("Received longUrl:", longUrl)

  try {
    // Check if the long URL has already been shortened
    let url = await Url.findOne({ longUrl })

    if (url) {
      console.log("Found existing URL:", url.shortUrl)
      return res.json({
        longUrl: url.longUrl,
        shortUrl: url.shortUrl,
        urlCode: url.urlCode,
        date: url.date,
      })
    }

    // Create a unique code and the short URL
    const urlCode = nanoid(6)
    const shortUrl = `${baseUrl}/${urlCode}`

    console.log("Generated urlCode:", urlCode)
    console.log("Generated shortUrl:", shortUrl)

   //Save to database
    url = new Url({
      longUrl,
      shortUrl,
      urlCode,
    })

    await url.save()
    console.log("Saved to database successfully")

    res.json({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      urlCode: url.urlCode,
      date: url.date,
    })
  } catch (err) {
    console.error(" Server Error during shortening:", err)
    res.status(500).json({ error: "Internal Server Error", message: err.message })
  }
})

/**
 * @route   GET /:code
 * @desc    Redirect to the original long URL
 */
app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code })

    if (url) {
      return res.redirect(url.longUrl)
    } else {
      return res.status(404).json("No URL found")
    }
  } catch (err) {
    console.error("Server Error during redirect:", err)
    res.status(500).json("Internal Server Error")
  }
})

// --- Start Server ---
const PORT = 5000
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`)
})
