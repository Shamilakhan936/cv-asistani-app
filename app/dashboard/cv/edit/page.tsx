import { Suspense } from 'react';
import CVEditContent from './cv-edit-content';

export default function CVEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CVEditContent />
    </Suspense>
  );
}