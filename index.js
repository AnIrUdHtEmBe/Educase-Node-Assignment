import express from "express";
import { config } from './utils/config.js';
import { schoolRouter } from "./api/school.js";

const app = express();
app.use(express.json());
const port = config.app.port;



app.use("/", schoolRouter);

app.listen(port, () => {
  console.log(`App Listening on port ${port}`);
});
