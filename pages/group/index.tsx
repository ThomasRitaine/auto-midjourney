import { useEffect, useState } from 'react';

export default () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/ImageGenerationGroup');
      const data = await response.json();
      setBatches(data);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Image Generation Batches</h1>
      <ul>
        {batches.map(batch => (
          <li key={batch.id}>{batch.name}</li>
        ))}
      </ul>
    </div>
  );
}
