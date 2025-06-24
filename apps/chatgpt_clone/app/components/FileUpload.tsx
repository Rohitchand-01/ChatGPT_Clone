'use client';

import { useRef, useState, useEffect } from 'react';

export default function FileUpload({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Only trigger the file input click when the component mounts if the inputRef exists.
    // This is now controlled by the parent component's conditional rendering,
    // so this useEffect will only run when the FileUpload component is intentionally mounted.
    if (inputRef.current) {
      inputRef.current.click();
    }

    // Set up a listener for the 'change' event on the input to detect
    // when a file is selected or the dialog is cancelled.
    const currentInput = inputRef.current;
    const handleInputChange = () => {
      // If no file is selected (user cancelled the dialog), close the modal.
      // This ensures the FileUpload component is unmounted if no file is chosen.
      if (currentInput && !currentInput.files?.length) {
        onClose();
      }
    };

    if (currentInput) {
      currentInput.addEventListener('change', handleInputChange);
    }

    // Cleanup the event listener when the component unmounts.
    return () => {
      if (currentInput) {
        currentInput.removeEventListener('change', handleInputChange);
      }
    };
  }, [onClose]); // Dependency on onClose to ensure cleanup works correctly if onClose changes

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // If no file is selected (e.g., user clicked cancel after the dialog opened),
      // the useEffect's change listener will handle calling onClose.
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Perform the file upload to your API endpoint.
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
      // Call onClose to unmount the FileUpload component and close the modal
      // after the upload attempt (whether successful or failed).
      onClose();
    }
  };

  return (
    // This component renders a hidden file input.
    // The browser's native file dialog will appear when inputRef.current.click() is called in useEffect.
    // The `onClose` will be called once a file is selected or the dialog is cancelled,
    // which will then unmount this component from the DOM.
    <div>
      <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" id="fileInput" />
    </div>
  );
}