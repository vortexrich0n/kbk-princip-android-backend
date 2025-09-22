import { termsOfServiceHTML } from './terms-content';

export default function TermsOfService() {
  return (
    <div dangerouslySetInnerHTML={{ __html: termsOfServiceHTML }} />
  );
}