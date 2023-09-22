import React, { useState } from 'react';

interface Props {
  onSubmit: (file: File) => void;
}

const ImageUploadForm: React.FC<Props> = ({ onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 p-2 w-full border rounded-md"
          required
          accept=".jpg,.jpeg,.png"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Upload</button>
    </form>
  );
}

export default ImageUploadForm;
