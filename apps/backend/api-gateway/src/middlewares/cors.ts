import cors from "cors";
const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};

export default corsOptions;
