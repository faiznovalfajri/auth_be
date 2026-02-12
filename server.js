// import semua
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { router } from "./src/routes/authRoute.js";


// .env = sebagai dapur, dotenv untuk mengakses file .env
dotenv.config();

// untuk mengakses express
const app = express()

// untuk penaganan form yang berkaitan form (dan client hanya boleh mengirim file sebesar 100 mb)
app.use(express.json({
    limit: "100mb"
}))

// untuk keamanan
app.use(cors())

// buat variabel untuk menangkap port di file .env, kalau port tidak di temukan maka akan ke port 3001 
const PORT = process.env.PORT || 3001

// untuk router
app.use(router)


// supaya PORT bisa di akses ke publik
app.listen(PORT, () => (console.info(`
    ===============
    RUN PORT ${PORT}
    ===============
    `))
)
