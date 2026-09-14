import { Department } from './department.schema.js';
import { DepartmentFundAllocation } from './department-fund-allocation.schema.js';

let streamActive = false;

export function initFundAllocationWatcher() {
  if (streamActive) return;

  try {
    const changeStream = DepartmentFundAllocation.watch([], {
      fullDocumentBeforeChange: 'whenAvailable'
    });

    changeStream.on('change', async (change) => {
      try {
        if (change.operationType === 'delete') {
          const doc = change.fullDocumentBeforeChange;
          if (doc && doc.deptId && doc.amount > 0) {
            const dept = await Department.findOne({ deptId: doc.deptId });
            if (dept) {
              const cur = Number(dept.allocatedFundPool) || 0;
              dept.allocatedFundPool = Math.max(0, cur - Number(doc.amount));
              await dept.save();
              console.log(`[Watcher] Auto-reverted ₹${doc.amount} from ${dept.name} (${dept.deptId}) on DB document deletion. New pool: ₹${dept.allocatedFundPool}`);
            }
          }
        }
      } catch (innerErr) {
        console.warn('[Watcher Inner Error]:', innerErr.message);
      }
    });

    changeStream.on('error', (err) => {
      console.warn('[Watcher Stream Error]:', err.message);
      streamActive = false;
    });

    streamActive = true;
    console.log('[Watcher] Change stream active on department_fund_allocations');
  } catch (err) {
    console.warn('[Watcher Init Error]:', err.message);
  }
}

export default initFundAllocationWatcher;
