import BudgetOfficer from './budgetOfficer.schema.js';

class BudgetOfficerRepository {
  async create(data) {
    const officer = new BudgetOfficer(data);
    return await officer.save();
  }

  async findById(id) {
    return await BudgetOfficer.findOne({ $or: [{ _id: id }, { officerId: id }] });
  }

  async findByEmailOrLoginId(identifier) {
    return await BudgetOfficer.findOne({
      $or: [
        { 'credentials.loginEmail': identifier.toLowerCase() },
        { 'credentials.loginId': identifier },
        { email: identifier.toLowerCase() }
      ]
    });
  }

  async findAll(query = {}, options = { limit: 100, skip: 0 }) {
    return await BudgetOfficer.find(query)
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit);
  }

  async update(id, updateData) {
    return await BudgetOfficer.findOneAndUpdate(
      { $or: [{ _id: id }, { officerId: id }] },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await BudgetOfficer.findOneAndDelete({ $or: [{ _id: id }, { officerId: id }] });
  }

  async count(query = {}) {
    return await BudgetOfficer.countDocuments(query);
  }
}

export const budgetOfficerRepository = new BudgetOfficerRepository();
export default budgetOfficerRepository;
