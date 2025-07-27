import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const connectDB = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL Connected! DB Host:", client.host);
        client.release();
    } catch (error) {
        console.error(" Error connecting to PostgreSQL:", error);
        process.exit(1);
    }
};

export default connectDB;
