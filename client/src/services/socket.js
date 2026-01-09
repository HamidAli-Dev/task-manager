import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io("http://localhost:8000", {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Community events
  joinCommunity() {
    if (this.socket) {
      this.socket.emit("user:join");
    }
  }

  leaveCommunity() {
    if (this.socket) {
      this.socket.emit("user:leave");
    }
  }

  setTyping(taskId, isTyping) {
    if (this.socket) {
      this.socket.emit("user:typing", { taskId, isTyping });
    }
  }

  // Task editing lock
  setEditing(taskId, isEditing) {
    if (this.socket) {
      this.socket.emit("task:editing", { taskId, isEditing });
    }
  }

  requestPresence() {
    if (this.socket) {
      this.socket.emit("presence:request");
    }
  }

  // Event listeners
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on("user:joined", callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on("user:left", callback);
    }
  }

  onTaskCreate(callback) {
    if (this.socket) {
      this.socket.on("task:create", callback);
    }
  }

  onTaskUpdate(callback) {
    if (this.socket) {
      this.socket.on("task:update", callback);
    }
  }

  onTaskDelete(callback) {
    if (this.socket) {
      this.socket.on("task:delete", callback);
    }
  }

  onPresenceUpdate(callback) {
    if (this.socket) {
      this.socket.on("presence:update", callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user:typing", callback);
    }
  }

  onTaskEditing(callback) {
    if (this.socket) {
      this.socket.on("task:editing", callback);
    }
  }

  // Remove listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService();
