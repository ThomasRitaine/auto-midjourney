import React, { useEffect, useState } from 'react';

interface Collection {
  id: string;
  name: string;
}

const CollectionList: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => setCollections(data));
  }, []);

  return (
    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {collections.map(collection => (
            <tr key={collection.id}>
              <td className="px-6 py-4 whitespace-nowrap">{collection.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`/collections/${collection.id}`} className="text-indigo-600 hover:text-indigo-900">View</a>
                {/* Add more actions as needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectionList;
