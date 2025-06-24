// models/chat.ts
import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const ChatSchema = new Schema(
  {
    messages: {
      type: [MessageSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = models?.Chat || model('Chat', ChatSchema);
export default Chat;
