import { io } from "socket.io-client";
import { CONFIG } from "../constants/config";

const socket = io(CONFIG.SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
