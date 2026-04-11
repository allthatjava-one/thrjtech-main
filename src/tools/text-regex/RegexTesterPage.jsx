import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import RegexTesterView from './RegexTesterView'

export default function RegexTesterPage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <RegexTesterView />
      </main>
      <Footer />
    </>
  )
}
