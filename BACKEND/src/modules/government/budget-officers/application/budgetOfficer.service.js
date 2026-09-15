import { budgetOfficerRepository } from '../infrastructure/budgetOfficer.repository.js';
import crypto from 'crypto';

const generateRandomString = (length) => crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);

class BudgetOfficerService {
  async createOfficer(data) {
    // Generate an officerId if not provided
    if (!data.officerId) {
      const count = await budgetOfficerRepository.count();
      data.officerId = `BO-${(count + 1).toString().padStart(3, '0')}`;
    }

    // Ensure credentials exist
    if (!data.credentials) {
      data.credentials = {};
    }
    
    // Generate loginId if not provided
    if (!data.credentials.loginId) {
      data.credentials.loginId = data.email || `${data.name.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 100)}`;
    }

    // Generate loginEmail
    if (!data.credentials.loginEmail) {
      data.credentials.loginEmail = data.email || `${data.credentials.loginId}@jharkhand.gov.in`;
    }

    // Generate password
    const plainPassword = data.credentials.password || generateRandomString(8);
    // In a real app we hash it:
    // const salt = crypto.randomBytes(16).toString('hex');
    // const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');
    
    data.credentials.password = plainPassword; // Keeping plain for demo/testing as per prototype
    data.credentials.generatedPassword = plainPassword;

    return await budgetOfficerRepository.create(data);
  }

  async getOfficers(query = {}, options = { limit: 100, skip: 0 }) {
    const officers = await budgetOfficerRepository.findAll(query, options);
    const total = await budgetOfficerRepository.count(query);
    return { data: officers, total };
  }

  async getOfficerById(id) {
    const officer = await budgetOfficerRepository.findById(id);
    if (!officer) throw new Error('Budget Officer not found');
    return officer;
  }

  async updateOfficer(id, updateData) {
    const officer = await budgetOfficerRepository.update(id, updateData);
    if (!officer) throw new Error('Budget Officer not found');
    return officer;
  }

  async deleteOfficer(id) {
    const officer = await budgetOfficerRepository.delete(id);
    if (!officer) throw new Error('Budget Officer not found');
    return { message: 'Budget Officer successfully deleted', id };
  }
}

export const budgetOfficerService = new BudgetOfficerService();
export default budgetOfficerService;
