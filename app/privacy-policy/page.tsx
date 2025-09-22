import fs from 'fs';
import path from 'path';

export default function PrivacyPolicy() {
  const filePath = path.join(process.cwd(), 'public', 'privacy-policy.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}