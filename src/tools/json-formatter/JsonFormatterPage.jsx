
import JsonFormatterView from './JsonFormatterView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function JsonFormatterPage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <JsonFormatterView />
      </main>
      <Footer />
    </>
  );
}
