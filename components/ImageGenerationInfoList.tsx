import React, { useEffect, useState } from 'react';

interface Info {
  id: string;
  prompt: string;
  repeat: number;
}

const ImageGenerationInfoList: React.FC = () => {
  const [infos, setInfos] = useState<Info[]>([]);

  useEffect(() => {
    fetch('/api/generations')
      .then(res => res.json())
      .then(data => setInfos(data));
  }, []);

  return (
    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repeat</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {infos.map(info => (
            <tr key={info.id}>
              <td className="px-6 py-4 whitespace-nowrap">{info.prompt}</td>
              <td className="px-6 py-4 whitespace-nowrap">{info.repeat}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`/generations/${info.id}`} className="text-indigo-600 hover:text-indigo-900">View</a>
                {/* Add more actions as needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ImageGenerationInfoList;
