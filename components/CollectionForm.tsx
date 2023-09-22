import React, { useState } from 'react';

interface Props {
  collection?: { name: string };
  onSubmit: (data: { name: string }) => void;
}

const CollectionForm: React.FC<Props> = ({ collection, onSubmit }) => {
  const [name, setName] = useState(collection ? collection.name : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Collection Name</label>
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

export default CollectionForm;
