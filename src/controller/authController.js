import { request, response } from "express";
import prisma from "../config/database.js";
import jwt from "jsonwebtoken";

// untuk membuat register
export const register = async (req = request, res = response) => {
    try {
        // buat form
        const { name, password } = req.body;

        // buat validasi
        if (!name && !password) {
            return res.status(400).json({
                message: "name or password is required",

            })
        }

        // mengambil nilai unik = untuk nama jika ada nama yang sama, mengambil nilai name saja yang diambil
        const existingAccount = await prisma.user.findUnique({
            where: { name }
        })

        if (existingAccount) {
            return res.status(400).json({
                message: "account already"
            })
        }

        // tambah data
        const result = await prisma.user.create({
            data: { name, password }
        })

        // respon berhasil
        return res.status(200).json({
            message: "created account success", result
        })


    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

// untuk membuat login
export const login = async (req = request, res = response) => {
    try {
        // untuk penggunaan form = req.body
        const { name, password } = req.body

        // buat validasi, username dan password tidak boleh kosong
        if (!name && !password) {
            return res.status(400).json({
                message: "name or password is required",

            })
        }

        // mencari username dan melakukan validasi
        const user = await prisma.user.findUnique({
            where: { name }
        })

        // melakukan validasi username
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        // untuk membandingkan password yang ada di database (validasi password)
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "password not found"
            })
        }

        // buat token menggunakan jwt = untuk generate token dan membuat batas waktu ketika sudah login
        const token = await jwt.sign(
            {
                id: user.id,
                name: user.name
            },
            // 
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        // respon berhasil
        return res.status(200).json({
            message: "login success", token
        })



    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}

// untuk membuat Dashboard (protected)
export const getDashboard = async (req = request, res = response) => {
    try {
        // req.user di-set oleh middleware, diambil dari login
        const userId = req.user.id;

        // mencari username dan melakukan validasi
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true }
        })

        if (!user) {
            return res.status(404).json({
                message: "user tidak ditemukan"
            })
        }

        res.status(200).json({
            message: "Selamat datang di dashboard",
            data: {
                user,
                info: "Ini adalah data terproteksi. Hanya user dengan token valid yang bisa mengaksesnya."
            }
        })


    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}