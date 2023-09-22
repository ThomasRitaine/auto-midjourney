import React, { useEffect, useState } from 'react';

interface Image {
  id: string;
  path: string;
}

const ImageList: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => setImages(data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map(image => (
        <div key={image.id} className="border rounded-md overflow-hidden">
          <img src={image.path} alt="Generated AI Art" className="w-full h-64 object-cover"/>
          <div className="p-2">
            <a href={`/images/${image.id}`} className="text-indigo-600 hover:text-indigo-900">View Details</a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ImageList;
