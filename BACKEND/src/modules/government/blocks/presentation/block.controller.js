import { blockService } from '../application/block.service.js';

export class BlockController {
  constructor(service = blockService) {
    this.service = service;
  }

  async getBlocks(req, res, next) {
    try {
      const { district, wardId, search } = req.query;
      const blocks = await this.service.getAllBlocks({ district, wardId, search });
      res.json({ success: true, count: blocks.length, data: blocks });
    } catch (err) {
      next(err);
    }
  }

  async getBlockById(req, res, next) {
    try {
      const block = await this.service.getBlockById(req.params.id);
      res.json({ success: true, data: block });
    } catch (err) {
      next(err);
    }
  }

  async createBlock(req, res, next) {
    try {
      const block = await this.service.createBlock(req.body);
      res.status(201).json({ success: true, message: 'Block registered successfully', data: block });
    } catch (err) {
      next(err);
    }
  }

  async updateBlock(req, res, next) {
    try {
      const block = await this.service.updateBlock(req.params.id, req.body);
      res.json({ success: true, message: 'Block updated successfully', data: block });
    } catch (err) {
      next(err);
    }
  }

  async deleteBlock(req, res, next) {
    try {
      const result = await this.service.deleteBlock(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const blockController = new BlockController();
export default blockController;
