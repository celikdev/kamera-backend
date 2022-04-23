import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ping from "ping";

import Camera from "./Camera.model.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/ihlasKamera",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log("Connected To MongoDB")
);

Camera.find().then((camera) => {
  camera.forEach((host) => {
    ping.sys.probe(host.cameraIP, (alive) => {
      console.log(host.cameraIP + alive);
    });
  });
});

app.get("/", async (req, res) => {
  await Camera.find().then((cameraData) => res.status(200).json(cameraData));
});

app.post("/", async (req, res) => {
  const { cameraName, cameraCoordinate, cameraRotation, cameraIP } = req.body;
  await Camera.create({
    cameraName,
    cameraCoordinate,
    cameraRotation,
    cameraIP,
  }).then((response) => res.status(200).json(response));
});

app.delete("/:id", async (req, res) => {
  const cameraID = req.params.id;
  await Camera.findByIdAndDelete(cameraID).then((response) => {
    res.status(200).json(response);
  });
});

app.listen(3000, "0.0.0.0", () => console.log("Server Start"));
