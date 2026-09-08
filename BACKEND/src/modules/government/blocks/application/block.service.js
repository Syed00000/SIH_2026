import { blockRepository } from '../infrastructure/block.repository.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class BlockService {
  constructor(repo = blockRepository) {
    this.repo = repo;
  }

  async ensureDefaultBlocks() {
    try {
      const count = await this.repo.count();
      if (count === 0) {
        await this.repo.create({
          blockId: 'BLK-JH-RN-01',
          name: 'Kanke Block',
          district: 'Ranchi',
          bdoName: 'Shri Rajesh Kumar Sinha',
          bdoEmail: 'bdo.kanke@jharkhand.gov.in',
          bdoPhone: '+91 94311 88201',
          headquarters: 'Block Development Office, Kanke, Ranchi',
          panchayats: [
            'Kanke', 'Arsande', 'Sukurhutu', 'Boreya', 'Mesra',
            'Pithoriya', 'Hutub', 'Neori', 'Choreya', 'Kanke West'
          ],
          departments: [
            'Drinking Water & Sanitation', 'Roads & Rural Works',
            'Electricity & Power', 'Sanitation & Solid Waste', 'Public Health & Anganwadi'
          ],
          credentials: {
            loginId: 'bdo.kanke@jharkhand.gov.in',
            loginEmail: 'bdo.kanke@jharkhand.gov.in',
            password: 'Block@2026'
          },
          status: 'Active'
        });
      } else {
        // Ensure credentials exist for default Kanke Block
        const kanke = await this.repo.findById('BLK-JH-RN-01');
        if (kanke && (!kanke.credentials || !kanke.credentials.loginId || !kanke.credentials.password)) {
          await this.repo.update('BLK-JH-RN-01', {
            credentials: {
              loginId: kanke.bdoEmail || 'bdo.kanke@jharkhand.gov.in',
              loginEmail: kanke.bdoEmail || 'bdo.kanke@jharkhand.gov.in',
              password: 'Block@2026'
            }
          });
        }
      }
    } catch (err) {
      console.warn('Auto-seed default block error:', err.message);
    }
  }

  async getAllBlocks(query = {}) {
    await this.ensureDefaultBlocks();
    return await this.repo.findAll(query);
  }

  async getBlockById(id) {
    await this.ensureDefaultBlocks();
    const block = await this.repo.findById(id);
    if (!block) throw new NotFoundError(`Block not found with ID: ${id}`);
    return block;
  }

  async createBlock(data) {
    if (!data.name?.trim()) throw new ValidationError('Block name is required');
    const district = data.district?.trim() || 'Ranchi';
    const existing = await this.repo.findByName(data.name, district);
    if (existing) throw new ValidationError(`Block "${data.name}" already exists in ${district}`);

    const count = await this.repo.count();
    const code = String(count + 1).padStart(2, '0');
    const blockId = data.blockId?.trim() || `BLK-JH-RN-${code}`;

    const panchayats = Array.isArray(data.panchayats)
      ? data.panchayats.map((p) => p.trim()).filter(Boolean)
      : (data.panchayats || '').split(',').map((p) => p.trim()).filter(Boolean);

    const loginEmail = data.loginEmail?.trim() || data.loginId?.trim() || data.bdoEmail?.trim() || `bdo.${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jharkhand.gov.in`;
    const loginId = data.loginId?.trim() || loginEmail;
    const password = data.password?.trim() || 'Block@2026';

    return await this.repo.create({
      ...data,
      blockId,
      district,
      panchayats: panchayats.length > 0 ? panchayats : ['Panchayat 1', 'Panchayat 2'],
      credentials: { loginId, loginEmail, password }
    });
  }

  async updateBlock(id, updates) {
    if (updates.panchayats && typeof updates.panchayats === 'string') {
      updates.panchayats = updates.panchayats.split(',').map((p) => p.trim()).filter(Boolean);
    }
    if (updates.password || updates.loginId || updates.loginEmail) {
      const existing = await this.repo.findById(id);
      const prevCreds = existing?.credentials || {};
      updates.credentials = {
        loginId: updates.loginId?.trim() || prevCreds.loginId || updates.bdoEmail || '',
        loginEmail: updates.loginEmail?.trim() || updates.loginId?.trim() || prevCreds.loginEmail || updates.bdoEmail || '',
        password: updates.password?.trim() || prevCreds.password || 'Block@2026'
      };
    }
    const updated = await this.repo.update(id, updates);
    if (!updated) throw new NotFoundError('Block not found for update');
    return updated;
  }

  async deleteBlock(id) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundError('Block not found for deletion');
    return { success: true, message: `Block ${id} removed successfully` };
  }
}

export const blockService = new BlockService();
export default blockService;
