import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { BSON } from 'bson';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';

async function restore(backupDir) {
  if (!backupDir || !fs.existsSync(backupDir)) {
    throw new Error(`Backup directory not found: ${backupDir}`);
  }
  const manifestPath = path.join(backupDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log('🔄 RESTORING FROM BACKUP:', manifest.backupDir);
  console.log('Original Timestamp:', manifest.timestamp);

  const db = await connectMongo();

  for (const [colName, meta] of Object.entries(manifest.collections)) {
    console.log(`Restoring collection ${colName}...`);
    const bsonFilePath = path.join(backupDir, meta.bsonGzFile);
    const gzData = fs.readFileSync(bsonFilePath);
    const decompressed = zlib.gunzipSync(gzData);

    const docs = [];
    let offset = 0;
    while (offset < decompressed.length) {
      const size = decompressed.readInt32LE(offset);
      const docBuf = decompressed.subarray(offset, offset + size);
      docs.push(BSON.deserialize(docBuf));
      offset += size;
    }

    // Replace collection documents
    await db.collection(colName).deleteMany({});
    if (docs.length > 0) {
      await db.collection(colName).insertMany(docs);
    }
    console.log(`  ✓ Restored ${docs.length} documents into ${colName}`);
  }

  await closeMongo();
  console.log('✅ RESTORATION COMPLETED SUCCESSFULLY');
}

const targetDir = process.argv[2];
if (targetDir) {
  restore(targetDir).catch(err => {
    console.error('Restore error:', err);
    process.exit(1);
  });
} else {
  console.log('Usage: node restore-migration-backup.js <backup_directory_path>');
}
