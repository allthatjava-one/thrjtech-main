import JsonFormatterView from './JsonFormatterView';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './JsonFormatter.css';

export default function JsonFormatterPage() {
  return (
    <div className="json-formatter-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <JsonFormatterView />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
