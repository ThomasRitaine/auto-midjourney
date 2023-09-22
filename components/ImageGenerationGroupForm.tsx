import React, { useState } from 'react';

interface Props {
  group?: { name: string; };  // for editing; if not provided, it's for creating
  onSubmit: (data: { name: string; }) => void;
}

const ImageGenerationGroupForm: React.FC<Props> = ({ group, onSubmit }) => {
  const [name, setName] = useState(group ? group.name : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Group Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
    </form>
  );
}

export default ImageGenerationGroupForm;
