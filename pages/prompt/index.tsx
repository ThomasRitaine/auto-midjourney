import { useEffect, useState } from 'react';

export default function ImageGenerationInfoList() {
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/imageGenerationInfo');
      const data = await response.json();
      setInfos(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Image Generation Info</h1>
      <ul>
        {infos.map(info => (
          <li key={info.id}>{info.prompt}</li>
        ))}
      </ul>
    </div>
  );
}
