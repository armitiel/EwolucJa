import React from "react";
import ReactDOM from "react-dom/client";
import MapMotionPrototype from "./pages/MapMotionPrototype.jsx";
import "./styles/ewolucja.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("prototype-root")).render(
  <React.StrictMode>
    <MapMotionPrototype />
  </React.StrictMode>,
);
