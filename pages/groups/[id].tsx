import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import SingleImageGenerationGroup from '../../components/SingleImageGenerationGroup';

const EditImageGenerationGroupPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Edit Image Generation Group</h1>
      {id && <SingleImageGenerationGroup groupId={id as string} />}
    </Layout>
  );
}

export default EditImageGenerationGroupPage;
