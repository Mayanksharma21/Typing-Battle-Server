import { Server } from "socket.io";
import { GameClass } from "./classes/gameClass";

export const rooms = new Map<string, GameClass>();

export function setupListeners(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-game", (roomId: string, name: string) => {
      if (!roomId) return socket.emit("error", "Invalid Room Id");
      if (!name) return socket.emit("error", "Please provide a nickname");

      socket.join(roomId);

      if (rooms.has(roomId)) {
        const game = rooms.get(roomId);
        if (!game) return socket.emit("error", "Game not found");

        game.joinPlayer(socket.id, name, socket);
      } else {
        const game = new GameClass(roomId, io, socket.id);
        rooms.set(roomId, game);

        game.joinPlayer(socket.id, name, socket);
      }
    });
  });
}
