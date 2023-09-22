import React, { useState } from 'react';

interface Props {
  info?: { prompt: string, repeat: number };  // for editing
  onSubmit: (data: { prompt: string, repeat: number }) => void;
}

const ImageGenerationInfoForm: React.FC<Props> = ({ info, onSubmit }) => {
  const [prompt, setPrompt] = useState(info ? info.prompt : "");
  const [repeat, setRepeat] = useState(info ? info.repeat : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ prompt, repeat });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Prompt</label>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Repeat</label>
        <input
          type="number"
          value={repeat}
          onChange={e => setRepeat(Number(e.target.value))}
          className="mt-1 p-2 w-full border rounded-md"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
    </form>
  );
}

export default ImageGenerationInfoForm;
