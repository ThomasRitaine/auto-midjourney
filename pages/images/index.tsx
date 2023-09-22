import Layout from '../../components/Layout';
import ImageList from '../../components/ImageList';

const ImagesPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Images</h1>
        <a href="/images/upload" className="bg-blue-500 text-white px-4 py-2 rounded-md">Upload New Image</a>
      </div>
      <ImageList />
    </Layout>
  );
}

export default ImagesPage;
