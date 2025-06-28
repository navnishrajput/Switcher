import React from 'react';
import DocConverter from '../components/doc-tools/DocConverter';

export default function DocConverterTest() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h1>DocConverter Standalone Test</h1>
      <DocConverter onBackToTools={() => alert('Back to tools clicked')} />
    </div>
  );
}
