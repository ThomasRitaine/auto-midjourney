import React, { useEffect, useState } from 'react';

interface Group {
  id: string;
  name: string;
  ImageGenerationInfo: { prompt: string; }[];  // Expand as needed
}

interface Props {
  groupId: string;
}

const SingleImageGenerationGroup: React.FC<Props> = ({ groupId }) => {
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetch(`/api/groups/${groupId}`)
      .then(res => res.json())
      .then(data => setGroup(data));
  }, [groupId]);

  if (!group) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl">{group.name}</h2>
      <h3 className="text-xl mt-5">Image Generation Info:</h3>
      <ul>
        {group.ImageGenerationInfo.map(info => (
          <li key={info.prompt}>{info.prompt}</li>
          // Expand as needed
        ))}
      </ul>
    </div>
  );
}

export default SingleImageGenerationGroup;
