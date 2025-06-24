    // lib/db.ts - Confirm this change is present!
    import mongoose from 'mongoose';

    let isConnected = false;

    export const connectToDB = async () => {
      if (isConnected) {
        console.log('✅ MongoDB already connected');
        return;
      }

      try {
        await mongoose.connect(process.env.MONGODB_URI!, {
          dbName: 'chatgpt-clone',
          bufferCommands: false,
        });

        isConnected = true;
        console.log('✅ MongoDB connected');
      } catch (error) {
        console.error('❌ MongoDB connection error:', error);
     
        throw error;
      }
    };
    