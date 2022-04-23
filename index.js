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

const checkCameraStatus = async () => {
  await Camera.find().then((camera) => {
    camera.forEach((host) => {
      ping.sys.probe(host.cameraIP, async (cameraStatus) => {
        await Camera.findById(host._id).then((camera) => {
          if (cameraStatus) {
            camera.cameraStatus = true;
          } else {
            camera.cameraStatus = false;
          }
          camera.save();
        });
      });
    });
  });
};

app.get("/", async (req, res) => {
  await Camera.find().then((cameraData) => res.status(200).json(cameraData));
});

app.post("/", (req, res) => {
  const { cameraName, cameraCoordinate, cameraRotation, cameraIP } = req.body;
  ping.sys.probe(cameraIP, async (cameraStatus) => {
    await Camera.create({
      cameraName,
      cameraCoordinate,
      cameraRotation,
      cameraIP,
      cameraStatus,
    }).then((response) => res.status(200).json(response));
  });
});

app.delete("/:id", async (req, res) => {
  const cameraID = req.params.id;
  await Camera.findByIdAndDelete(cameraID).then((response) => {
    res.status(200).json(response);
  });
});

app.listen(3000, "0.0.0.0", () => console.log("Server Start"));
