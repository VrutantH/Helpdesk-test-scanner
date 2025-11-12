"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('join_ticket', (ticketId) => {
            socket.join(`ticket_${ticketId}`);
            console.log(`User ${socket.id} joined ticket room: ${ticketId}`);
        });
        socket.on('leave_ticket', (ticketId) => {
            socket.leave(`ticket_${ticketId}`);
            console.log(`User ${socket.id} left ticket room: ${ticketId}`);
        });
        socket.on('typing_start', (data) => {
            socket.to(`ticket_${data.ticketId}`).emit('user_typing', data);
        });
        socket.on('typing_stop', (data) => {
            socket.to(`ticket_${data.ticketId}`).emit('user_stop_typing', data);
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    const emitToTicketRoom = (ticketId, event, data) => {
        io.to(`ticket_${ticketId}`).emit(event, data);
    };
    const emitToAllUsers = (event, data) => {
        io.emit(event, data);
    };
    global.socketHelpers = {
        emitToTicketRoom,
        emitToAllUsers,
    };
};
exports.setupSocketHandlers = setupSocketHandlers;
//# sourceMappingURL=socketHandlers.js.map