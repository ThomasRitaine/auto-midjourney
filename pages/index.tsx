import Layout from '../components/Layout';

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <a href="/groups" className="text-indigo-600 hover:text-indigo-900 block">Manage Image Generation Groups</a>
        {/* Add other links as needed */}
      </div>
    </Layout>
  );
}

export default IndexPage;
