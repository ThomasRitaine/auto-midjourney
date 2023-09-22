import React from 'react';
import Layout from '../../components/Layout';
import CollectionForm from '../../components/CollectionForm';

interface Props {
    collection?: { name: string };
    onSubmit: (data: { name: string }) => void;
}

const CreateCollectionPage: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Create New Collection</h1>
            <CollectionForm onSubmit={onSubmit} />
        </Layout>
    );
}

export default CreateCollectionPage;
