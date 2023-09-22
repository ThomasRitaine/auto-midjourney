import Layout from '../../components/Layout';
import React from 'react';
import ImageUploadForm from '../../components/ImageUploadForm';

interface Props {
    onSubmit: (file: File) => void;
}

const UploadImagePage: React.FC = () => {
    const handleSubmit: Props['onSubmit'] = (file) => {
        // handle form submission
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Upload New Image</h1>
            <ImageUploadForm onSubmit={handleSubmit} />
        </Layout>
    );
};

export default UploadImagePage;
