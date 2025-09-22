import { privacyPolicyHTML } from './privacy-content';

export default function PrivacyPolicy() {
  return (
    <div dangerouslySetInnerHTML={{ __html: privacyPolicyHTML }} />
  );
}