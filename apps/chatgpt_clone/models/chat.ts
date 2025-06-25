import mongoose, { Schema, model, models } from 'mongoose'

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const ChatSchema = new Schema(
  {
    userId: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    messages: {
      type: [MessageSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Chat = models?.Chat || model('Chat', ChatSchema)
export default Chat
