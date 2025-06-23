// components/FileUpload.tsx
'use client';

import { useRef, useState } from 'react';

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setUploading(false);
    inputRef.current!.value = '';
  };

  return (
    <div>
      <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" id="fileInput" />
      <label
        htmlFor="fileInput"
        className="px-4 py-2 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-700"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </label>
    </div>
  );
}
