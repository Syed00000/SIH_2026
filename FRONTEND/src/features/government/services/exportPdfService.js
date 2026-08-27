/**
 * Dedicated PDF Export & Printable Report Service for JoharSetu Government Portal
 */

export const exportAdminDirectoryPdf = (admins = [], filters = {}) => {
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    alert('Please allow popups to export the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter((a) => a.status === 'Active').length;
  const suspendedAdmins = admins.filter((a) => a.status === 'Suspended').length;
  const districtFilter = filters.district || 'All Districts';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admin Directory Report - Government of Jharkhand</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 12mm 10mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0d1b3e;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .emblem {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }
    .header-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .header-subtitle {
      font-size: 10.5px;
      font-weight: 600;
      color: #475569;
      margin: 2px 0 0 0;
    }
    .header-right {
      text-align: right;
    }
    .portal-name {
      font-size: 13px;
      font-weight: 800;
      color: #0d1b3e;
      letter-spacing: 0.5px;
    }
    .portal-tag {
      font-size: 9.5px;
      color: #64748b;
      font-weight: 600;
    }
    .report-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 14px;
    }
    .meta-item {
      font-size: 10.5px;
      color: #475569;
    }
    .meta-item strong {
      color: #0f172a;
    }
    .stats-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat-card {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 4px;
      background: #ffffff;
    }
    .stat-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .stat-val {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
      padding: 7px 10px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 7.5px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10.5px;
      color: #1e293b;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    .admin-name {
      font-weight: 700;
      color: #0f172a;
    }
    .admin-phone {
      font-size: 9.5px;
      color: #64748b;
      margin-top: 1px;
    }
    .email-mono {
      font-family: monospace;
      font-size: 10px;
      color: #334155;
    }
    .role-text {
      font-weight: 700;
      font-size: 10.5px;
    }
    .role-super { color: #6b21a8; }
    .role-district { color: #0369a1; }
    .role-nodal { color: #1d4ed8; }
    .role-hei { color: #0e7490; }
    .status-active { color: #16a34a; font-weight: 700; }
    .status-suspended { color: #d97706; font-weight: 700; }
    .status-removed { color: #dc2626; font-weight: 700; }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 9.5px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="header-left">
      <img class="emblem" src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Emblem" />
      <div>
        <div class="header-title">Government of Jharkhand</div>
        <div class="header-subtitle">Department of Higher and Technical Education</div>
      </div>
    </div>
    <div class="header-right">
      <div class="portal-name">JOHARSETU ADMIN</div>
      <div class="portal-tag">System Administration Report</div>
    </div>
  </div>

  <div class="report-meta">
    <div class="meta-item">Report: <strong>System Administrators Directory</strong></div>
    <div class="meta-item">Filter District: <strong>${districtFilter}</strong></div>
    <div class="meta-item">Generated On: <strong>${currentDate}</strong></div>
  </div>

  <div class="stats-strip">
    <div class="stat-card">
      <div class="stat-label">Total Admins</div>
      <div class="stat-val">${totalAdmins}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active Admins</div>
      <div class="stat-val" style="color: #16a34a;">${activeAdmins}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Suspended Admins</div>
      <div class="stat-val" style="color: #d97706;">${suspendedAdmins}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Admin Name</th>
        <th style="width: 25%;">Email ID</th>
        <th style="width: 15%;">Role</th>
        <th style="width: 15%;">District</th>
        <th style="width: 10%;">Last Login</th>
        <th style="width: 10%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${admins.length === 0 ? `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: #64748b; font-style: italic;">
            No administrators found matching the selected filter criteria.
          </td>
        </tr>
      ` : admins.map((a) => {
        const roleClass =
          a.role === 'Super Admin'
            ? 'role-super'
            : a.role === 'District Admin'
            ? 'role-district'
            : a.role === 'Nodal Officer'
            ? 'role-nodal'
            : 'role-hei';
        const statusClass =
          a.status === 'Active'
            ? 'status-active'
            : a.status === 'Suspended'
            ? 'status-suspended'
            : 'status-removed';
        return `
          <tr>
            <td>
              <div class="admin-name">${a.fullName || a.name || '—'}</div>
              <div class="admin-phone">${a.mobileNumber || a.phone || '—'}</div>
            </td>
            <td class="email-mono">${a.email || '—'}</td>
            <td><span class="role-text ${roleClass}">${a.role || '—'}</span></td>
            <td><strong>${a.district || 'All Districts'}</strong></td>
            <td>${a.lastLogin || 'Recent'}</td>
            <td>
              <span class="${statusClass}">
                &bull; ${a.status || 'Active'}
              </span>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Official Document &bull; Government of Jharkhand &bull; JoharSetu Innovation Hub</div>
    <div>Confidential &bull; System Generated Report</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 200);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportIndustryDirectoryPdf = (industries = [], filters = {}) => {
  const printWindow = window.open('', '_blank', 'width=1050,height=750');
  if (!printWindow) {
    alert('Please allow popups to export the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalIndustries = industries.length;
  const activeCount = industries.filter((i) => i.status === 'Active' && i.accessStatus !== 'Disabled').length;
  const pendingCount = industries.filter((i) => i.verificationStatus === 'Pending').length;
  const districtFilter = filters.district || 'All Districts';
  const sectorFilter = filters.sector || 'All Sectors';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Industry & Partner Directory Report - Government of Jharkhand</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 10mm 10mm 10mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0d1b3e;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .emblem {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }
    .header-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .header-subtitle {
      font-size: 10.5px;
      font-weight: 600;
      color: #475569;
      margin: 2px 0 0 0;
    }
    .header-right {
      text-align: right;
    }
    .portal-name {
      font-size: 13px;
      font-weight: 800;
      color: #0d1b3e;
      letter-spacing: 0.5px;
    }
    .portal-tag {
      font-size: 9.5px;
      color: #64748b;
      font-weight: 600;
    }
    .report-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 14px;
    }
    .meta-item {
      font-size: 10.5px;
      color: #475569;
    }
    .meta-item strong {
      color: #0f172a;
    }
    .stats-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat-card {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 4px;
      background: #ffffff;
    }
    .stat-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .stat-val {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
      padding: 7px 8px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 7px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
      color: #1e293b;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    .org-name {
      font-weight: 700;
      color: #0f172a;
    }
    .org-code {
      font-size: 9px;
      color: #64748b;
      margin-top: 1px;
    }
    .category-text {
      font-weight: 700;
      font-size: 10px;
    }
    .status-active { color: #16a34a; font-weight: 700; }
    .status-pending { color: #d97706; font-weight: 700; }
    .status-disabled { color: #dc2626; font-weight: 700; }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 9.5px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="header-left">
      <img class="emblem" src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Emblem" />
      <div>
        <div class="header-title">Government of Jharkhand</div>
        <div class="header-subtitle">Department of Higher and Technical Education</div>
      </div>
    </div>
    <div class="header-right">
      <div class="portal-name">JOHARSETU ADMIN</div>
      <div class="portal-tag">Industry & Partner Governance Report</div>
    </div>
  </div>

  <div class="report-meta">
    <div class="meta-item">Report: <strong>Industry & Corporate Partner Directory</strong></div>
    <div class="meta-item">District: <strong>${districtFilter}</strong> | Sector: <strong>${sectorFilter}</strong></div>
    <div class="meta-item">Generated On: <strong>${currentDate}</strong></div>
  </div>

  <div class="stats-strip">
    <div class="stat-card">
      <div class="stat-label">Total Registered Partners</div>
      <div class="stat-val">${totalIndustries}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Approved & Active</div>
      <div class="stat-val" style="color: #16a34a;">${activeCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pending Review</div>
      <div class="stat-val" style="color: #d97706;">${pendingCount}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Entity ID</th>
        <th style="width: 22%;">Organization Name</th>
        <th style="width: 14%;">Category</th>
        <th style="width: 16%;">Thematic Domain</th>
        <th style="width: 14%;">Support Modes</th>
        <th style="width: 14%;">SPOC / Contact</th>
        <th style="width: 8%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${industries.length === 0 ? `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: #64748b; font-style: italic;">
            No industries found matching the selected filter criteria.
          </td>
        </tr>
      ` : industries.map((ind) => {
        const supportModes = Array.isArray(ind.supportModes) ? ind.supportModes.join(', ') : (ind.supportModes || 'Funding');
        const thematicDomain = ind.thematicDomain || (Array.isArray(ind.thematicDomains) ? ind.thematicDomains.join(', ') : 'Innovation');
        const isEnabled = ind.status === 'Active' && ind.accessStatus !== 'Disabled';
        const statusClass = ind.verificationStatus === 'Pending' ? 'status-pending' : isEnabled ? 'status-active' : 'status-disabled';
        const statusText = ind.verificationStatus === 'Pending' ? 'Pending Review' : isEnabled ? 'Active' : 'Disabled';

        return `
          <tr>
            <td style="font-family: monospace; font-weight: 700;">${ind.industryId || '—'}</td>
            <td>
              <div class="org-name">${ind.legalName || '—'}</div>
              ${ind.shortName ? `<div class="org-code">${ind.shortName}</div>` : ''}
            </td>
            <td><span class="category-text" style="color: #1d4ed8;">${ind.category || '—'}</span></td>
            <td>${thematicDomain}</td>
            <td>${supportModes}</td>
            <td>
              <div><strong>${ind.spocName || '—'}</strong></div>
              <div style="color: #64748b; font-size: 9px;">${ind.officialEmail || ind.mobileNumber || '—'}</div>
            </td>
            <td>
              <span class="${statusClass}">
                &bull; ${statusText}
              </span>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Official Document &bull; Government of Jharkhand &bull; JoharSetu Innovation Hub</div>
    <div>Confidential &bull; System Generated Report</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 200);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportUniversityDirectoryPdf = (universities = [], filters = {}) => {
  const printWindow = window.open('', '_blank', 'width=1050,height=750');
  if (!printWindow) {
    alert('Please allow popups to export the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalUniversities = universities.length;
  const activeCount = universities.filter((u) => u.accessStatus === 'Enabled' || u.status === 'Approved' || u.status === 'Active').length;
  const disabledCount = universities.filter((u) => u.accessStatus === 'Disabled').length;
  const pendingCount = universities.filter((u) => u.status === 'Pending').length;
  const districtFilter = filters.district || 'All Districts';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>University Directory Report - Government of Jharkhand</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 10mm 10mm 10mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11px;
      line-height: 1.4;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0d1b3e;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .emblem {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }
    .header-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .header-subtitle {
      font-size: 10.5px;
      font-weight: 600;
      color: #475569;
      margin: 2px 0 0 0;
    }
    .header-right {
      text-align: right;
    }
    .portal-name {
      font-size: 13px;
      font-weight: 800;
      color: #0d1b3e;
      letter-spacing: 0.5px;
    }
    .portal-tag {
      font-size: 9.5px;
      color: #64748b;
      font-weight: 600;
    }
    .report-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 14px;
    }
    .meta-item {
      font-size: 10.5px;
      color: #475569;
    }
    .meta-item strong {
      color: #0f172a;
    }
    .stats-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .stat-card {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      border-radius: 4px;
      background: #ffffff;
    }
    .stat-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    .stat-val {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
      padding: 7px 8px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 7px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
      color: #1e293b;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    .uni-name {
      font-weight: 700;
      color: #0f172a;
    }
    .uni-code {
      font-size: 9px;
      color: #64748b;
      margin-top: 1px;
    }
    .status-active { color: #16a34a; font-weight: 700; }
    .status-pending { color: #d97706; font-weight: 700; }
    .status-disabled { color: #dc2626; font-weight: 700; }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 9.5px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="header-left">
      <img class="emblem" src="https://www.jharkhand.gov.in/images/jhlogo55.PNG" alt="Emblem" />
      <div>
        <div class="header-title">Government of Jharkhand</div>
        <div class="header-subtitle">Department of Higher and Technical Education</div>
      </div>
    </div>
    <div class="header-right">
      <div class="portal-name">JOHARSETU ADMIN</div>
      <div class="portal-tag">HEI & University Governance Report</div>
    </div>
  </div>

  <div class="report-meta">
    <div class="meta-item">Report: <strong>Higher Education Institutions Directory</strong></div>
    <div class="meta-item">Filter District: <strong>${districtFilter}</strong></div>
    <div class="meta-item">Generated On: <strong>${currentDate}</strong></div>
  </div>

  <div class="stats-strip">
    <div class="stat-card">
      <div class="stat-label">Total Universities</div>
      <div class="stat-val">${totalUniversities}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active & Approved</div>
      <div class="stat-val" style="color: #16a34a;">${activeCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Disabled Access</div>
      <div class="stat-val" style="color: #dc2626;">${disabledCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pending Approval</div>
      <div class="stat-val" style="color: #d97706;">${pendingCount}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Code</th>
        <th style="width: 25%;">University / Institution</th>
        <th style="width: 14%;">District</th>
        <th style="width: 23%;">Nodal Officer Details</th>
        <th style="width: 12%;">Registered On</th>
        <th style="width: 14%;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${universities.length === 0 ? `
        <tr>
          <td colspan="6" style="text-align: center; padding: 24px; color: #64748b; font-style: italic;">
            No universities found matching the selected filter criteria.
          </td>
        </tr>
      ` : universities.map((u) => {
        const isEnabled = u.accessStatus === 'Enabled' || u.status === 'Approved' || u.status === 'Active';
        const statusClass = u.status === 'Pending' ? 'status-pending' : isEnabled ? 'status-active' : 'status-disabled';
        const statusText = u.status === 'Pending' ? 'Pending Approval' : (u.accessStatus || u.status || 'Active');
        const regDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
        const nodalName = typeof u.nodalOfficer === 'string' ? u.nodalOfficer : (u.nodalOfficer?.name || u.nodalOfficerName || '—');
        const nodalEmail = typeof u.nodalOfficer === 'object' ? (u.nodalOfficer?.email || u.nodalOfficerEmail || '') : '';
        const nodalPhone = typeof u.nodalOfficer === 'object' ? (u.nodalOfficer?.phone || u.nodalOfficerPhone || '') : '';

        return `
          <tr>
            <td style="font-family: monospace; font-weight: 700;">${u.code || u.universityId || u.id || '—'}</td>
            <td>
              <div class="uni-name">${u.name || u.institutionName || u.legalName || '—'}</div>
              <div class="uni-code">${u.universityEmail || u.officialEmail || ''}</div>
            </td>
            <td><strong>${u.district || '—'}</strong></td>
            <td>
              <div><strong>${nodalName}</strong></div>
              <div style="color: #64748b; font-size: 9px;">${nodalEmail} ${nodalPhone ? `&bull; ${nodalPhone}` : ''}</div>
            </td>
            <td>${regDate}</td>
            <td>
              <span class="${statusClass}">
                &bull; ${statusText}
              </span>
            </td>
          </tr>
        `;
      }).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Official Document &bull; Government of Jharkhand &bull; JoharSetu Innovation Hub</div>
    <div>Confidential &bull; System Generated Report</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 200);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportCsrLifecycleReportPdf = ({
  proposals = [],
  ledger = [],
  filterSource = 'All Sources'
} = {}) => {
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    alert('Please allow popups to export the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CSR & Grants Fund Lifecycle Audit Report - Government of Jharkhand</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 10mm; }
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 11px; line-height: 1.4; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d1b3e; padding-bottom: 10px; margin-bottom: 14px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
    .kpi-card .val { font-size: 16px; font-weight: bold; color: #0d1b3e; }
    .kpi-card .lbl { font-size: 9.5px; color: #64748b; text-transform: uppercase; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10.5px; }
    th { background: #f1f5f9; color: #475569; font-weight: bold; text-align: left; padding: 7px 8px; border-bottom: 1px solid #cbd5e1; text-transform: uppercase; font-size: 9.5px; }
    td { padding: 7px 8px; border-bottom: 1px solid #f1f5f9; }
    .sec-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #0d1b3e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 16px; }
    .footer { border-top: 1px solid #cbd5e1; margin-top: 25px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2 style="margin:0; font-size: 15px; text-transform: uppercase; color: #0d1b3e;">Government of Jharkhand</h2>
      <p style="margin:2px 0 0 0; color:#475569; font-size:11px;">Department of Higher & Technical Education · Complete Fund Lifecycle Management</p>
      <p style="margin:2px 0 0 0; font-weight: bold; color: #0369a1;">JOHARSETU CSR & GOVERNMENT GRANTS AUDIT DOSSIER</p>
    </div>
    <div style="text-align:right;">
      <span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10px;">Audit Active: 2026-27</span>
      <p style="margin:6px 0 0 0; color:#64748b; font-size:9.5px;">Generated: ${currentDate}</p>
      <p style="margin:2px 0 0 0; color:#64748b; font-size:9.5px;">Filter: ${filterSource}</p>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="lbl">Corporate CSR Pool</div>
      <div class="val">₹68.5 Cr</div>
      <div style="font-size:9px; color:#64748b;">14 Active Donors</div>
    </div>
    <div class="kpi-card">
      <div class="lbl">Govt Grants Pool</div>
      <div class="val">₹110.0 Cr</div>
      <div style="font-size:9px; color:#64748b;">08 Active Schemes</div>
    </div>
    <div class="kpi-card">
      <div class="lbl">Joint Co-Funding</div>
      <div class="val">₹35.0 Cr</div>
      <div style="font-size:9px; color:#64748b;">05 Active Projects</div>
    </div>
    <div class="kpi-card">
      <div class="lbl">Escrow Lock-in Vaults</div>
      <div class="val">12 Vaults</div>
      <div style="font-size:9px; color:#16a34a;">Dual-Key Enforced</div>
    </div>
  </div>

  <div class="sec-title">1. Approved Proposals & Due Diligence Pipeline</div>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Institution / Project</th>
        <th>Source & Scheme</th>
        <th>Due Diligence</th>
        <th>Board Approval</th>
        <th>MoU Stage</th>
        <th>Sanctioned</th>
      </tr>
    </thead>
    <tbody>
      ${proposals.map(p => `
        <tr>
          <td style="font-family: monospace; font-weight: bold; color: #0284c7;">${p.id}</td>
          <td><strong>${p.institutionName}</strong></td>
          <td>${p.sourceScheme}</td>
          <td style="color: #16a34a; font-weight: 600;">${p.dueDiligence}</td>
          <td>${p.boardApproval}</td>
          <td>${p.mouExecution}</td>
          <td style="font-family: monospace; font-weight: bold;">${p.allocatedAmount}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="sec-title">2. Banking Payment Transfer Ledger & UTR Reconciliation</div>
  <table>
    <thead>
      <tr>
        <th>Payment ID</th>
        <th>Payer &rarr; Payee</th>
        <th>Amount</th>
        <th>Mode</th>
        <th>UTR Reference</th>
        <th>Maker-Checker</th>
        <th>Bank Status</th>
      </tr>
    </thead>
    <tbody>
      ${ledger.map(l => `
        <tr>
          <td style="font-family: monospace; font-weight: bold; color: #0284c7;">${l.id}</td>
          <td>${l.payer} &rarr; <strong>${l.payee}</strong></td>
          <td style="font-family: monospace; font-weight: bold;">${l.disbursedAmount}</td>
          <td>${l.mode}</td>
          <td style="font-family: monospace;">${l.utrNumber}</td>
          <td style="color: #16a34a; font-weight: 600;">${l.makerCheckerSign}</td>
          <td>${l.bankAckStatus}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Department of Higher & Technical Education, Government of Jharkhand &bull; Official Dossier</div>
    <div>Confidential & Statutory Audit Compliant (Sec 135 / Schedule VII)</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => { window.print(); }, 200);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportGenericReportPdf = (title = 'Portal Report', data = {}) => {
  const printWindow = window.open('', '_blank', 'width=950,height=750');
  if (!printWindow) {
    alert('Please allow popups to export the PDF report.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} - Government of Jharkhand</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; font-size: 11px; margin: 0; padding: 0; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0d1b3e; padding-bottom: 10px; margin-bottom: 14px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 20px; color: #64748b; font-size: 9.5px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h2 style="margin:0; font-size: 14px; text-transform: uppercase;">Government of Jharkhand</h2>
      <p style="margin:2px 0 0 0; color:#475569; font-size:10.5px;">Department of Higher and Technical Education</p>
    </div>
    <div style="text-align:right;">
      <h3 style="margin:0; font-size: 13px; color:#0d1b3e;">JOHARSETU ADMIN</h3>
      <p style="margin:2px 0 0 0; color:#64748b; font-size:9.5px;">Generated: ${currentDate}</p>
    </div>
  </div>
  <h3 style="color:#0f172a; margin-top: 10px;">${title}</h3>
  <p style="color:#475569;">This official report contains system summaries and active operational data.</p>
  <div class="footer">
    <div>Official Document &bull; Government of Jharkhand</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(() => { window.print(); }, 200);
    };
  </script>
</body>
</html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
};


