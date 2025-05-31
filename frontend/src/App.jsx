import Footer from "./Components/Footer"
import Header from "./Components/Header"
import About from "./Pages/About";
import Result from "./Pages/ResultPage"
import {BrowserRouter, 
        Routes, 
        Route, 
        Link, 
        Navigate} from "react-router-dom";
import MassGenerate from "./Components/onAbout/MassGenerate.jsx";

function App() {


  return (
    <>
      <article id="vmega-results">
        <BrowserRouter basename="/">
          <Header />

            <Routes>
              <Route path="/result" element={< Result />}/>
              <Route path="/about" element={< About />}/> 
              <Route path="/generate" element={< MassGenerate />}/> 
              <Route path="/" element={<Navigate to="/result" replace/>}/>
              <Route path="*" element={<Navigate to="/result" replace/>}/>
            </Routes>
            
          <Footer />
          </BrowserRouter>
      </article>
    </>
  )
}

export default App

