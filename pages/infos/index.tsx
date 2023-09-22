import Layout from '../../components/Layout';
import ImageGenerationInfoList from '../../components/ImageGenerationInfoList';

const ImageGenerationInfosPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Image Generation Infos</h1>
        <a href="/infos/create" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create New Info</a>
      </div>
      <ImageGenerationInfoList />
    </Layout>
  );
}

export default ImageGenerationInfosPage;
