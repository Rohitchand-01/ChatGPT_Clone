import mongoose, { Schema, model, models } from 'mongoose'

const ChatMessagePairSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  assistant: {
    type: String,
    required: true,
  },
})

const ChatSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    messages: {
      type: [ChatMessagePairSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Chat = models?.Chat || model('Chat', ChatSchema)
export default Chat
