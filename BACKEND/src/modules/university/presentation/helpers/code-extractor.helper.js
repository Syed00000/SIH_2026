export function extractUniversityCode(req, defaultCode = 'RU001') {
  if (req.user?.role === 'GOVERNMENT' && !req.query?.universityCode && !req.body?.universityCode) {
    return 'ALL';
  }
  return (
    req.query?.universityCode ||
    req.body?.universityCode ||
    req.user?.profile?.aisheCode ||
    req.user?.profile?.code ||
    req.user?.profile?.universityCode ||
    defaultCode
  );
}

export default extractUniversityCode;
