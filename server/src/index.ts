import dotenv from "dotenv";
import app from "./app";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: "./env" });

const prisma = new PrismaClient();

const startServer = async () => {
    try {
        // Check PostgreSQL connection
        await prisma.$connect();
        console.log("Connected to PostgreSQL via Prisma");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("PostgreSQL connection failed. Error:", error);
        process.exit(1); // Stop the process if DB fails
    }
};

startServer();
