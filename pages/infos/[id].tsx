import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ImageGenerationInfoForm from '../../components/ImageGenerationInfoForm';

interface Props {
    info?: { prompt: string; repeat: number };  // for editing
    onSubmit: (data: { prompt: string, repeat: number }) => void;
}

const EditImageGenerationInfoPage: React.FC<Props> = ({ info, onSubmit }) => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Edit Image Generation Info</h1>
            {id && <ImageGenerationInfoForm info={info} onSubmit={onSubmit} />}
        </Layout>
    );
};

export default EditImageGenerationInfoPage;
