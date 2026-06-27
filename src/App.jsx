import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Publications from './components/Publications'
import Education from './components/Education'
import Footer from './components/Footer'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <div className="bg-decor" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Publications />
        <Education />
      </main>
      <Footer />
    </>
  )
}
