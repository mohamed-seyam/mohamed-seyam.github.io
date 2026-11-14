import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import OpenSource from './components/OpenSource'
import Publications from './components/Publications'
import Education from './components/Education'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <div className="bg-decor" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <OpenSource />
        <Publications />
        <Education />
      </main>
      <Footer />
    </>
  )
}
