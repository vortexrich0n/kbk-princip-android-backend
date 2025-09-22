import fs from 'fs';
import path from 'path';

export default function TermsOfService() {
  const filePath = path.join(process.cwd(), 'public', 'terms-of-service.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}