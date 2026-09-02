import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { BSON } from 'bson';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';

async function main() {
  console.log('🛡️ INITIATING PRE-MIGRATION LOGICAL BACKUP (BSON + GZIP + METADATA)');
  const db = await connectMongo();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join('C:', 'Users', 'Syed Imran Hassan', 'joharsetu_backups', `pre_phase4_migration_${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('Backup Target Directory (Outside Workspace):', backupDir);

  const collections = await db.listCollections().toArray();
  const manifest = {
    timestamp: new Date().toISOString(),
    database: db.databaseName,
    backupDir,
    collections: {},
    totalDocuments: 0
  };

  for (const c of collections.sort((a, b) => a.name.localeCompare(b.name))) {
    const colName = c.name;
    const docs = await db.collection(colName).find({}).toArray();
    const indexes = await db.collection(colName).indexes();

    // 1. Serialize documents to BSON stream
    const buffers = docs.map(d => BSON.serialize(d));
    const combinedBuffer = Buffer.concat(buffers);
    const compressedBson = zlib.gzipSync(combinedBuffer);

    // 2. Save .bson.gz
    const bsonFilePath = path.join(backupDir, `${colName}.bson.gz`);
    fs.writeFileSync(bsonFilePath, compressedBson);

    // 3. Save index metadata
    const metaFilePath = path.join(backupDir, `${colName}.metadata.json`);
    fs.writeFileSync(metaFilePath, JSON.stringify({ name: colName, indexes, count: docs.length }, null, 2));

    // 4. Calculate checksum
    const hash = crypto.createHash('sha256').update(compressedBson).digest('hex');

    manifest.collections[colName] = {
      documentCount: docs.length,
      uncompressedBytes: combinedBuffer.length,
      compressedBytes: compressedBson.length,
      bsonGzFile: `${colName}.bson.gz`,
      metadataFile: `${colName}.metadata.json`,
      sha256: hash
    };
    manifest.totalDocuments += docs.length;

    console.log(`  ✓ ${colName.padEnd(30)} : ${docs.length.toString().padStart(3)} docs | ${compressedBson.length} bytes (gz) | sha256: ${hash.slice(0, 10)}...`);
  }

  // Save manifest
  const manifestPath = path.join(backupDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('\n✅ Manifest written to:', manifestPath);
  console.log(`Total Collections Backed Up: ${Object.keys(manifest.collections).length}`);
  console.log(`Total Documents Backed Up  : ${manifest.totalDocuments}`);

  // Verification Step: Read back from archive
  console.log('\n🔍 VERIFYING BACKUP READABILITY AND INTEGRITY...');
  for (const [name, meta] of Object.entries(manifest.collections)) {
    const filePath = path.join(backupDir, meta.bsonGzFile);
    const gzData = fs.readFileSync(filePath);
    const decompressed = zlib.gunzipSync(gzData);
    let offset = 0;
    let readCount = 0;
    while (offset < decompressed.length) {
      const size = decompressed.readInt32LE(offset);
      const docBuf = decompressed.subarray(offset, offset + size);
      BSON.deserialize(docBuf);
      offset += size;
      readCount++;
    }
    if (readCount !== meta.documentCount) {
      throw new Error(`Verification mismatch for ${name}: expected ${meta.documentCount}, got ${readCount}`);
    }
  }
  console.log('✅ BACKUP INTEGRITY VERIFICATION: 100% SUCCESSFUL (All collections verified readable and valid BSON)');

  await closeMongo();
}

main().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
});
