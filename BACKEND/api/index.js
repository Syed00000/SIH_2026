import app from '../src/app.js';
import { connectMongo } from '../src/infrastructure/database/mongo/client.js';
import { bootstrapAdmins } from '../src/infrastructure/bootstrap/bootstrapAdmins.js';
import mongoose from 'mongoose';

let isInitialized = false;

/**
 * Vercel Serverless Function Handler for JoharSetu Backend Express API.
 * Ensures persistent MongoDB Atlas connection reuse and bootstrapping across Lambda cold starts.
 */
export default async function handler(req, res) {
  // Ensure database is connected
  if (mongoose.connection.readyState === 0 || !isInitialized) {
    try {
      await connectMongo();
      await bootstrapAdmins();
      isInitialized = true;
    } catch (err) {
      console.error('❌ Vercel Serverless Mongo connection error:', err?.message || err);
    }
  }

  // Forward request to Express app and wait until response finishes
  return new Promise((resolve, reject) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    res.on('error', reject);
    app(req, res);
  });
}
