import mongoose from "mongoose";

const cameraSchema = mongoose.Schema({
  cameraName: String,
  cameraRotation: String,
  cameraCoordinate: Object,
  cameraIP: String,
  cameraStatus: Boolean,
});

const Camera = mongoose.model("Camera", cameraSchema);

export default Camera;
