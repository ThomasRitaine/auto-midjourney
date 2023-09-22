import Layout from '../../components/Layout';
import CollectionList from '../../components/CollectionList';

const CollectionsPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Collections</h1>
        <a href="/collections/create" className="bg-blue-500 text-white px-4 py-2 rounded-md">Create New Collection</a>
      </div>
      <CollectionList />
    </Layout>
  );
}

export default CollectionsPage;
