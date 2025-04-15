import { Server } from 'socket.io';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Socket server is not available in production', { status: 200 });
  }

  const io = new Server({
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    path: '/api/socket'
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join-chat', (chatId: string) => {
      socket.join(chatId);
    });

    socket.on('send-message', async (data: { chatId: string; text: string; senderId: string }) => {
      try {
        const chat = await prisma.chat.findUnique({
          where: { id: data.chatId },
          select: { companyId: true }
        });
        
        if (!chat) {
          console.error('Chat not found:', data.chatId);
          return;
        }
        
        const message = await prisma.message.create({
          data: {
            text: data.text,
            senderId: data.senderId,
            chatId: data.chatId,
            companyId: chat.companyId,
          },
          include: {
            sender: true,
          },
        });

        io.to(data.chatId).emit('new-message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return new Response('Socket server is running', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  });
} 