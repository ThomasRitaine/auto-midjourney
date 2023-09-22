// pages/collections/[id].tsx

import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import CollectionForm from '../../components/CollectionForm';

const EditCollectionPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Edit Collection</h1>
      {id && <CollectionForm collectionId={id as string} />}
    </Layout>
  );
}

export default EditCollectionPage;
