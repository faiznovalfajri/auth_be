import jwt from "jsonwebtoken";

// untuk verifikasi token
export const verifyToken = (req, res, next) => {
    // Ambil token dari header "Authorization: Bearer <token>"
    const authHeaer = req.headers["authorization"];
    const token = authHeaer && authHeaer.split(" ")[1];

    // cek apakah token ada
    if (!token) {
        return res.status(401).json({
            message: "Akses token di tolak! token hilang"
        })
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan data user ke request object
        req.user = decoded;

        // Lanjut ke controller berikutnya
        next()


    } catch (error) {
        return res.status(403).json({
            message: "Token tidak valid atau telah kadaluarsa!"
        })
    }
}