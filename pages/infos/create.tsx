import React from 'react';
import Layout from '../../components/Layout';
import ImageGenerationInfoForm from '../../components/ImageGenerationInfoForm';

interface Props {
    onSubmit: (data: { prompt: string, repeat: number }) => void;
}

const CreateImageGenerationInfoPage: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Create Image Generation Info</h1>
            <ImageGenerationInfoForm onSubmit={onSubmit} />
        </Layout>
    );
}

export default CreateImageGenerationInfoPage;
