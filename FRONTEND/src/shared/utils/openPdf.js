export function openPdfDocument(url, fileName = 'document.pdf') {
  if (!url) return;
  const secureUrl = url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  const link = document.createElement('a');
  link.href = secureUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const openPdf = openPdfDocument;
export default openPdfDocument;
