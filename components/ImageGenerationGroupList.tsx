import React, { useEffect, useState } from 'react';

interface Group {
  id: string;
  name: string;
}

const ImageGenerationGroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data));
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
          {groups.map(group => (
            <tr key={group.id}>
              <td className="px-6 py-4 whitespace-nowrap">{group.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`/groups/${group.id}`} className="text-indigo-600 hover:text-indigo-900">View</a>
                {/* Add more actions as needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ImageGenerationGroupList;
