import Layout from '../../components/Layout';
import ImageGenerationGroupList from '../../components/ImageGenerationGroupList';

const ImageGenerationGroupsPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Image Generation Groups</h1>
        <a href="/groups/create" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create New Group</a>
      </div>
      <ImageGenerationGroupList />
    </Layout>
  );
}

export default ImageGenerationGroupsPage;
