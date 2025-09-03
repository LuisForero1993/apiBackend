import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";
import { connect } from "./prismaClient.js";

dotenv.config();

const app = express();

app.use(cors()); // Permite peticiones desde otros orígenes (ej: frontend)
app.use(express.json()); // Permite recibir JSON desde el frontend
app.use("/api/orders", orderRoutes); // Prefijo para nuestras rutas

// conectarme a la base de datos

connect();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { 
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
}); 