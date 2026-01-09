import presenceService from "../services/presenceService.js";

export const handleConnection = (io, socket) => {
  console.log(`User ${socket.user.name} connected: ${socket.id}`);

  // Set user online
  presenceService.setUserOnline(socket.user._id, socket.id);

  // Join user to their personal room
  socket.join(`user:${socket.user._id}`);

  // Handle user joining community board
  socket.on("user:join", async (data) => {
    try {
      socket.join("community");
      await presenceService.updateUserView(socket.user._id, "community");

      const activeUsers = await presenceService.getCommunityViewers();

      // Broadcast to community viewers
      socket.to("community").emit("user:joined", {
        user: {
          id: socket.user._id,
          name: socket.user.name,
          email: socket.user.email,
        },
      });

      // Send current active users to the joining user
      socket.emit("presence:update", { activeUsers });

      // Broadcast updated user list to all community viewers
      io.to("community").emit("presence:update", { activeUsers });
    } catch (error) {
      console.error("Error handling user join:", error);
    }
  });

  // Handle user leaving community board
  socket.on("user:leave", async (data) => {
    try {
      socket.leave("community");
      await presenceService.updateUserView(socket.user._id, "my-tasks");

      const activeUsers = await presenceService.getCommunityViewers();

      // Broadcast to remaining community viewers
      socket.to("community").emit("user:left", {
        user: {
          id: socket.user._id,
          name: socket.user.name,
        },
      });

      // Broadcast updated user list
      io.to("community").emit("presence:update", { activeUsers });
    } catch (error) {
      console.error("Error handling user leave:", error);
    }
  });

  // Handle typing indicators
  socket.on("user:typing", (data) => {
    socket.to("community").emit("user:typing", {
      user: {
        id: socket.user._id,
        name: socket.user.name,
      },
      taskId: data.taskId,
      isTyping: data.isTyping,
    });
  });

  // Handle task editing lock
  socket.on("task:editing", (data) => {
    socket.to("community").emit("task:editing", {
      taskId: data.taskId,
      user: {
        id: socket.user._id,
        name: socket.user.name,
      },
      isEditing: data.isEditing,
    });
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log(`User ${socket.user.name} disconnected: ${socket.id}`);

    try {
      await presenceService.setUserOffline(socket.user._id);

      const activeUsers = await presenceService.getCommunityViewers();

      // Broadcast to community viewers
      socket.to("community").emit("user:left", {
        user: {
          id: socket.user._id,
          name: socket.user.name,
        },
      });

      // Broadcast updated user list
      io.to("community").emit("presence:update", { activeUsers });
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  // Send initial presence data
  socket.on("presence:request", async () => {
    try {
      const activeUsers = await presenceService.getCommunityViewers();
      socket.emit("presence:update", { activeUsers });
    } catch (error) {
      console.error("Error sending presence data:", error);
    }
  });
};
