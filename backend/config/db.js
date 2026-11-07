import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habitgarden';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🌿 [HabitGarden] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`⚠️ [HabitGarden] MongoDB Connection Notice: ${err.message}`);
    console.warn('⚠️ The HTTP server will remain active to serve the web UI.');
    console.warn('👉 Please set MONGODB_URI in your Render environment variables with your MongoDB Atlas URI.');
    return null;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
