"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerSocketHandlers;
function registerSocketHandlers(io) {
    io.on("connection", (socket) => {
        // Register feature sockets
        socket.on("createBooking", (data) => {
            io.emit("bookingCreated", {
                message: "A new booking was created!",
                booking: data,
            });
        });
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`${socket.id} joined room ${roomId}`);
        });
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}
