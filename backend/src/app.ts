import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import type { Db } from "./db.js";
import { createMovieRouter } from "./movies/movies.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendPath = path.join(__dirname, "../../../frontend");

export function createApp(db: Db) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.json({ ok: true, world: "Disney activo" });
    });

    app.use("/api/movies", createMovieRouter(db));

    // Serve Frontend Static Files
    app.use(express.static(frontendPath));

    // SPA Fallback: Serve index.html for any other route
    app.get("*", (req, res) => {
        // Don't intercept API calls
        if (req.path.startsWith("/api")) return res.status(404).json({ error: "Not Found" });
        return res.sendFile(path.join(frontendPath, "index.html"));
    });

    return app;
}