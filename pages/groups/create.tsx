import Layout from '../../components/Layout';
import ImageGenerationGroupForm from '../../components/ImageGenerationGroupForm';
import { useState } from 'react';


// const [error, setError] = useState<string | null>(null);

const CreateImageGenerationGroupPage: React.FC = () => {
    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Create Image Generation Group</h1>
            <ImageGenerationGroupForm onSubmit={handleCreateGroup} />
            {/* {error && <div className="text-red-500 mt-4">{error}</div>} */}
        </Layout>
    );
}

const handleCreateGroup = async (data: { name: string }) => {
    // Here, you'd typically make an API call to save the new group
    // For example:
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        // Handle success - perhaps redirect or show a success message
      } else {
        // Handle error - show an error message
      }
    } catch (error) {
      // Handle unexpected error - show an error message
    }
  };
  

export default CreateImageGenerationGroupPage;
