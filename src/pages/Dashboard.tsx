import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import PublicDashboard from '@/components/dashboard/PublicDashboard';
import ExecomeDashboard from '@/components/dashboard/ExecomeDashboard';
import TreasureDashboard from '@/components/dashboard/TreasureDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';

const Dashboard: React.FC = () => {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const renderDashboard = () => {
    switch (role) {
      case 'faculty':
        return <FacultyDashboard />;
      case 'treasure':
        return <TreasureDashboard />;
      case 'execome':
        return <ExecomeDashboard />;
      default:
        return <PublicDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        {renderDashboard()}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
