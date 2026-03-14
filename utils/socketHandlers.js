let onlineUsers = new Map();
module.exports = (io) => {
  io.on("connection", (socket) => {
    // console.log(socket.id, "connected");
    const userId = socket.userId;
    if (userId) {
      if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
      onlineUsers.get(userId).add(socket.id);

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
      console.log(`User ${userId} connected, online:${onlineUsers.size}`);
    }
    socket.on("sendMessage", (data) => {
      const receiverSockets = onlineUsers.get(data.recipientId);
      if (receiverSockets) {
        receiverSockets.forEach((id) => {
          io.to(id).emit("getMessage", { senderId: userId, text: data.text });
        });
      }
    });
    socket.on("disconnect", () => {
      if (userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) onlineUsers.delete(userId);
      }

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
      console.log(`socket disconnected, online ${onlineUsers.size}`);
    });
  });
};
