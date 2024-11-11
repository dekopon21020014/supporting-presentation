// app/page.tsx

'use client';

import React from 'react';
import Form from '@/components/Form'; // 適切なパスに変更

const Page = () => {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form />
    </main>
  );
};

export default Page;
