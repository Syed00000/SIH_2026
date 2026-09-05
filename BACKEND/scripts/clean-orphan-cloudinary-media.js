import { connectMongo } from '../src/infrastructure/database/mongo/client.js';
import { CitizenChallenge } from '../src/modules/citizen/infrastructure/model.js';
import { getStorageProvider } from '../src/infrastructure/storage/index.js';
import { v2 as cloudinary } from 'cloudinary';
import { initCloudinaryClient } from '../src/infrastructure/storage/providers/helpers/cloudinary-config.helper.js';

async function main() {
  await connectMongo();
  initCloudinaryClient();
  const storageProvider = getStorageProvider();

  console.log('--- SCANNING ACTIVE CHALLENGES ---');
  const activeChallenges = await CitizenChallenge.find({}).lean();
  console.log(`Found ${activeChallenges.length} active challenge(s) in citizen_challenges.`);

  const registeredUrls = new Set();
  const registeredPublicIds = new Set();

  activeChallenges.forEach((c) => {
    const all = [
      ...(Array.isArray(c.media) ? c.media : []),
      ...(Array.isArray(c.mediaUrls) ? c.mediaUrls : []),
      ...(Array.isArray(c.evidence) ? c.evidence : []),
      c.prototypePdfUrl,
      c.solutionPdfUrl
    ].filter(Boolean);

    all.forEach((item) => {
      const url = typeof item === 'string' ? item : item.url || item.accessUrl || '';
      const pId = typeof item === 'object' ? item.providerPublicId || item.storageKey : '';
      if (url) registeredUrls.add(url);
      if (pId) registeredPublicIds.add(pId);
    });
  });

  console.log(`Active registered URLs: ${registeredUrls.size}, PublicIDs: ${registeredPublicIds.size}`);

  console.log('\n--- SCANNING CLOUDINARY CITIZENS FOLDER ---');
  try {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'citizens',
      max_results: 50
    });

    console.log(`Found ${res.resources.length} asset(s) in Cloudinary under 'citizens':`);
    const shouldPurge = process.argv.includes('--purge');
    for (const asset of res.resources) {
      const isRegistered = registeredUrls.has(asset.secure_url) ||
        registeredPublicIds.has(asset.public_id) ||
        [...registeredUrls].some(u => u.includes(asset.public_id));

      if (isRegistered) {
        console.log(`- ${asset.public_id} (${asset.format}) -> Registered in DB: YES ✅`);
      } else {
        console.log(`- ${asset.public_id} (${asset.format}) -> Registered in DB: NO (Orphan) ⚠️`);
        if (shouldPurge) {
          const delRes = await cloudinary.uploader.destroy(asset.public_id, { resource_type: 'image' });
          console.log(`  -> Purged from Cloudinary: ${delRes?.result}`);
        }
      }
    }
  } catch (err) {
    console.error('Cloudinary resources list error:', err.message);
  }

  process.exit(0);
}

main().catch(console.error);
