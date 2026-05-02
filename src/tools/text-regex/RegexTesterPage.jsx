import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import RegexTesterView from './RegexTesterView'
import './RegexTester.css'

export default function RegexTesterPage() {
  return (
    <div className="regex-tester-page">
      <Navbar />
      <main className="main">
        <div className="container">
          <div className="card">
            <RegexTesterView />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
