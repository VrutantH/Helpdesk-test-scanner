import { Server } from 'socket.io';

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join ticket room
    socket.on('join_ticket', (ticketId: string) => {
      socket.join(`ticket_${ticketId}`);
      console.log(`User ${socket.id} joined ticket room: ${ticketId}`);
    });

    // Leave ticket room
    socket.on('leave_ticket', (ticketId: string) => {
      socket.leave(`ticket_${ticketId}`);
      console.log(`User ${socket.id} left ticket room: ${ticketId}`);
    });

    // Handle typing indicator
    socket.on('typing_start', (data: { ticketId: string; user: any }) => {
      socket.to(`ticket_${data.ticketId}`).emit('user_typing', data);
    });

    socket.on('typing_stop', (data: { ticketId: string; user: any }) => {
      socket.to(`ticket_${data.ticketId}`).emit('user_stop_typing', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Helper functions for emitting events
  const emitToTicketRoom = (ticketId: string, event: string, data: any) => {
    io.to(`ticket_${ticketId}`).emit(event, data);
  };

  const emitToAllUsers = (event: string, data: any) => {
    io.emit(event, data);
  };

  // Export helper functions for use in controllers
  (global as any).socketHelpers = {
    emitToTicketRoom,
    emitToAllUsers,
  };
};