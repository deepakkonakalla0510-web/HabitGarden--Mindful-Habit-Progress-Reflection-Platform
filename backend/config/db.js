import mongoose from 'mongoose';

let reconnectTimer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habitgarden';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🌿 [HabitGarden] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
    return conn;
  } catch (err) {
    console.error(`⚠️ [HabitGarden] MongoDB Connection Notice: ${err.message}`);
    console.warn('👉 To connect a cloud database, set MONGODB_URI in Render Environment Variables with your MongoDB Atlas URI.');

    // If in production on a cloud host without local DB, retry connecting periodically
    if (!reconnectTimer && process.env.MONGODB_URI) {
      reconnectTimer = setInterval(async () => {
        if (mongoose.connection.readyState === 0) {
          console.log('🔄 [HabitGarden] Retrying MongoDB connection...');
          try {
            await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
            console.log('🌿 [HabitGarden] Reconnection Successful!');
            clearInterval(reconnectTimer);
            reconnectTimer = null;
          } catch (e) {
            // Silence repeated noise
          }
        }
      }, 8000);
    }
    return null;
  }
};

export const disconnectDB = async () => {
  if (reconnectTimer) {
    clearInterval(reconnectTimer);
    reconnectTimer = null;
  }
  await mongoose.disconnect();
};
