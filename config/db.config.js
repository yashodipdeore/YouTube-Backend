import mongoose from 'mongoose';

export const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 DB connection successful 🟢');
  } catch (error) {
    console.log((error.message));
    throw new Error('🔴 DB connection failed 🔴 !\n', error);
  };
}; 