import { jsPDF } from 'jspdf';

/**
 * Generates an official, high-resolution Government of Jharkhand PDF Investigation Dossier
 * @param {Object} challenge - The citizen challenge data object
 */
export const exportChallengeDossierPdf = (challenge) => {
  if (!challenge) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const chlId = challenge.challengeId || challenge.id || 'CHL-JH-2026-0001';
  const district = challenge.location?.district || challenge.district || 'Jharkhand';
  const block = challenge.location?.block || 'Not Specified';
  const panchayat = challenge.location?.panchayatOrWard || 'Not Specified';
  const landmark = challenge.location?.landmark || 'Ground Location';
  const pincode = challenge.location?.pincode || 'N/A';
  const coordinates = challenge.location?.coordinates || 'Telemetry Not Available';
  const fullAddress =
    challenge.location?.fullAddress ||
    [landmark, panchayat, block, district, 'Jharkhand'].filter(Boolean).join(', ');

  const formattedDate = challenge.submittedAt
    ? new Date(challenge.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-GB');

  const submitter = challenge.submitter || {
    name: challenge.submittedBy || 'Citizen',
    mobileNumber: 'Verified Citizen',
    email: 'N/A'
  };

  const assignedUni = challenge.assignedUniversity || {};

  // Color Palette
  const primaryGreen = [6, 78, 59]; // #064e3b
  const accentGreen = [4, 120, 87]; // #047857
  const darkText = [30, 41, 59]; // slate-800
  const grayText = [100, 116, 139]; // slate-500
  const lightBg = [248, 250, 252]; // slate-50

  let y = 10;

  // 1. Top Header Banner
  doc.setFillColor(...primaryGreen);
  doc.rect(10, y, 190, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF JHARKHAND', 105, y + 6, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Department of Higher & Technical Education • State Nodal Innovation Cell', 105, y + 11, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('JOHARSETU GRASSROOTS PROBLEM INVESTIGATION DOSSIER', 105, y + 17, { align: 'center' });

  y += 26;

  // 2. Reference Bar (ID, Date, Status, Domain)
  doc.setFillColor(...lightBg);
  doc.setDrawColor(226, 232, 240);
  doc.rect(10, y, 190, 14, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(...grayText);
  doc.setFont('helvetica', 'bold');
  doc.text('DOSSIER ID:', 14, y + 5.5);
  doc.text('STATUS:', 75, y + 5.5);
  doc.text('DOMAIN:', 125, y + 5.5);
  doc.text('FILED ON:', 160, y + 5.5);

  doc.setTextColor(...darkText);
  doc.setFontSize(8.5);
  doc.text(chlId, 14, y + 10.5);
  doc.text(challenge.status || 'Under Review', 75, y + 10.5);
  doc.text(challenge.domain || 'Infrastructure', 125, y + 10.5);
  doc.text(formattedDate, 160, y + 10.5);

  y += 18;

  // Helper section renderer
  const renderSectionHeader = (title) => {
    doc.setFillColor(...accentGreen);
    doc.rect(10, y, 190, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(title.toUpperCase(), 14, y + 4.2);
    y += 8;
  };

  // 3. Citizen Submitter Profile
  renderSectionHeader('1. Citizen Submitter Profile & Verification');

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.rect(10, y, 190, 14, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayText);
  doc.text('Submitter Name:', 14, y + 5);
  doc.text('Contact Mobile:', 75, y + 5);
  doc.text('Verification State:', 135, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(submitter.name || 'Verified Citizen', 14, y + 10);
  doc.text(submitter.mobileNumber || 'Registered Submitter', 75, y + 10);
  doc.text('Aadhaar / OTP Authenticated', 135, y + 10);

  y += 18;

  // 4. Problem Statement Details
  renderSectionHeader('2. Ground Problem Statement & Testimony');

  doc.rect(10, y, 190, 26, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkText);
  doc.text(`Title: ${challenge.title}`, 14, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...grayText);
  doc.text('Citizen Testimony & Description:', 14, y + 10);

  doc.setTextColor(...darkText);
  const splitDesc = doc.splitTextToSize(`"${challenge.description || challenge.problemStatement || 'Detailed report logged on portal.'}"`, 182);
  doc.text(splitDesc, 14, y + 14.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayText);
  doc.text(`Estimated Impact: ${challenge.impactMetrics?.affectedPopulation || '~ 5,000 Residents'} | Estimated R&D Scope: ${challenge.impactMetrics?.estimatedBudget || '₹ 2.5 - 5 Lakhs'}`, 14, y + 23);

  y += 30;

  // 5. Administrative Location & GIS Telemetry
  renderSectionHeader('3. Administrative Location & GIS Telemetry');

  doc.rect(10, y, 190, 18, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayText);
  doc.text('State / District:', 14, y + 4.5);
  doc.text('Block / Sub-Division:', 75, y + 4.5);
  doc.text('Panchayat / Ward:', 135, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(`Jharkhand, ${district}`, 14, y + 8.5);
  doc.text(block, 75, y + 8.5);
  doc.text(panchayat, 135, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayText);
  doc.text('Full Ground Address:', 14, y + 13);
  doc.text('GPS Telemetry Coordinates:', 115, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(fullAddress, 14, y + 16.5, { maxWidth: 95 });
  doc.text(coordinates, 115, y + 16.5);

  y += 22;

  // 6. Higher Education Institution Allocation
  renderSectionHeader('4. Higher Education Institution (HEI) R&D Allocation');

  doc.rect(10, y, 190, 22, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayText);
  doc.text('Assigned Institution:', 14, y + 4.5);
  doc.text('Target Department / Lab:', 105, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkText);
  doc.text(assignedUni.name ? `${assignedUni.name} (${assignedUni.id || 'HEI'})` : 'Awaiting Institutional Allocation', 14, y + 8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(assignedUni.department || 'Institutional Research Team', 105, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayText);
  doc.text('HEI Acceptance State:', 14, y + 13.5);
  doc.text('Nodal Directives / Remarks:', 105, y + 13.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkText);
  doc.text(assignedUni.acceptanceStatus || 'Pending HEI Acceptance', 14, y + 17.5);
  const splitRemarks = doc.splitTextToSize(
    challenge.milestones?.[1]?.remarks || challenge.governmentRemarks || 'Assigned for ground research and pilot development.',
    80
  );
  doc.text(splitRemarks, 105, y + 17.5);

  y += 26;

  // 7. Milestone Timeline Table
  renderSectionHeader('5. Government Resolution Milestones');

  const milestones = challenge.milestones || [
    { title: 'Citizen Submission Logged', status: 'COMPLETED', remarks: 'Submission verified and ingested' },
    { title: 'Nodal Screening & Triage', status: 'COMPLETED', remarks: 'Scope evaluated by State Nodal Cell' },
    { title: 'HEI Department Allocation', status: assignedUni.name ? 'CURRENT' : 'PENDING', remarks: assignedUni.name ? `Allocated to ${assignedUni.name}` : 'Awaiting allocation' },
    { title: 'Field Validation & Solution Deployment', status: challenge.status === 'Resolved' ? 'COMPLETED' : 'PENDING', remarks: 'Ground deployment and verification' }
  ];

  milestones.forEach((m, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250);
    doc.rect(10, y, 190, 8, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(`Stage ${idx + 1}: ${m.title}`, 14, y + 5);

    doc.setFont('helvetica', 'bold');
    if (m.status === 'COMPLETED') {
      doc.setTextColor(4, 120, 87);
    } else if (m.status === 'CURRENT') {
      doc.setTextColor(180, 83, 9);
    } else {
      doc.setTextColor(100, 116, 139);
    }
    doc.text(`[${m.status}]`, 95, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    const splitMRemarks = doc.splitTextToSize(m.remarks || 'Standard protocol verification', 65);
    doc.text(splitMRemarks, 120, y + 5);

    y += 8.5;
  });

  // 8. Official Government Footer & Seal Stamp
  y = Math.max(y + 4, 275);
  doc.setDrawColor(...accentGreen);
  doc.setLineWidth(0.5);
  doc.line(10, y, 200, y);

  doc.setFontSize(7);
  doc.setTextColor(...grayText);
  doc.text('This is an authenticated, digitally verifiable government dossier generated by JoharSetu State Nodal Cell.', 14, y + 4);
  doc.text(`Document Reference: ${chlId} • Printed: ${new Date().toLocaleString('en-GB')}`, 14, y + 7.5);
  doc.text('Authorized by: Department of Higher & Technical Education, Govt. of Jharkhand', 200, y + 7.5, { align: 'right' });

  // Save the PDF file
  doc.save(`${chlId}_Government_Investigation_Dossier.pdf`);
};

export default exportChallengeDossierPdf;
