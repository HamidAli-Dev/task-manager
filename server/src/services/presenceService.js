import Presence from "../models/presence.model.js";

class PresenceService {
  async setUserOnline(userId, socketId, currentView = "offline") {
    try {
      await Presence.findOneAndUpdate(
        { userId },
        {
          socketId,
          isOnline: true,
          currentView,
          lastSeen: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Error setting user online:", error);
    }
  }

  async setUserOffline(userId) {
    try {
      await Presence.findOneAndUpdate(
        { userId },
        {
          isOnline: false,
          currentView: "offline",
          lastSeen: new Date(),
        }
      );
    } catch (error) {
      console.error("Error setting user offline:", error);
    }
  }

  async updateUserView(userId, currentView) {
    try {
      await Presence.findOneAndUpdate(
        { userId },
        { currentView, lastSeen: new Date() }
      );
    } catch (error) {
      console.error("Error updating user view:", error);
    }
  }

  async getActiveUsers() {
    try {
      const activeUsers = await Presence.find({
        isOnline: true,
        lastSeen: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // 5 minutes
      })
        .populate("userId", "name email")
        .select("userId currentView lastSeen");

      return activeUsers.map((presence) => ({
        id: presence.userId._id,
        name: presence.userId.name,
        email: presence.userId.email,
        currentView: presence.currentView,
        lastSeen: presence.lastSeen,
      }));
    } catch (error) {
      console.error("Error getting active users:", error);
      return [];
    }
  }

  async getCommunityViewers() {
    try {
      const viewers = await Presence.find({
        isOnline: true,
        currentView: "community",
        lastSeen: { $gte: new Date(Date.now() - 2 * 60 * 1000) }, // 2 minutes
      })
        .populate("userId", "name email")
        .select("userId");

      return viewers.map((presence) => ({
        id: presence.userId._id,
        name: presence.userId.name,
        email: presence.userId.email,
      }));
    } catch (error) {
      console.error("Error getting community viewers:", error);
      return [];
    }
  }

  async cleanupStalePresence() {
    try {
      const staleTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes
      await Presence.updateMany(
        { lastSeen: { $lt: staleTime } },
        { isOnline: false, currentView: "offline" }
      );
    } catch (error) {
      console.error("Error cleaning up stale presence:", error);
    }
  }
}

export default new PresenceService();
