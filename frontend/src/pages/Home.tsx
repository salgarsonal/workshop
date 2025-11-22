import Hero from '../components/Hero';
import SessionsSection from '../components/SessionsSection';
import RegistrationForm from '../components/RegistrationForm';
import LocationSection from '../components/LocationSection';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SessionsSection />
      <RegistrationForm />
      <LocationSection />
      <Footer />
    </div>
  );
}

export default Home;

