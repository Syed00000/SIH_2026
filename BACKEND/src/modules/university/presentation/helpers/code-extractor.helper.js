export function extractUniversityCode(req, defaultCode = 'RUNI-JH') {
  return (
    req.query.universityCode ||
    req.body?.universityCode ||
    req.user?.profile?.aisheCode ||
    req.user?.profile?.code ||
    req.user?.profile?.universityCode ||
    defaultCode
  );
}

export default extractUniversityCode;
