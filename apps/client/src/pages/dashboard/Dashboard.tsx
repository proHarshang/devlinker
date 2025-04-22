import { useAppSelector } from '@/store';

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name || user?.email}!</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Your Profile</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user?.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
