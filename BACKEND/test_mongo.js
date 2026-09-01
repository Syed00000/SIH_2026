import mongoose from 'mongoose';

const uri = "mongodb://officialsamadhan043_db_user:mtzjk9Brhkg6AWPc@ac-wiwdm77-shard-00-00.uzxwt7j.mongodb.net:27017,ac-wiwdm77-shard-00-01.uzxwt7j.mongodb.net:27017,ac-wiwdm77-shard-00-02.uzxwt7j.mongodb.net:27017/joharsetu?ssl=true&replicaSet=atlas-wiwdm77-shard-0&authSource=admin&retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
