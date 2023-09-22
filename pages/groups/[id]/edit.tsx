import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ImageGenerationGroupForm from '../../../components/ImageGenerationGroupForm';
import ImageGenerationInfoForm from '../../../components/ImageGenerationInfoForm';

function EditGroup({ group }) {
  const router = useRouter();
  const [currentGroup, setCurrentGroup] = useState(group);

  const handleUpdateGroup = async (updatedData) => {
    try {
      const response = await fetch(`/api/groups/${router.query.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const updatedGroup = await response.json();
        setCurrentGroup(updatedGroup);
        alert('Group updated successfully!');
      } else {
        alert('Failed to update group.');
      }
    } catch (error) {
      console.error("Error updating group:", error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <ImageGenerationGroupForm 
        group={currentGroup} 
        onSubmit={handleUpdateGroup} 
      />

      <ImageGenerationInfoForm 
        /* Assuming the form can accept a group ID to associate the info */
        groupId={currentGroup.id}
        /* You can add other required props for ImageGenerationInfoForm */
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const response = await fetch(`http://localhost:3000/api/groups/${id}`);
  const group = await response.json();

  return {
    props: {
      group,
    },
  };
}

export default EditGroup;
