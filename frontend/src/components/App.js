import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Helmet } from 'react-helmet'
import Header from './Header'
import Game from './Game'
import Footer from './Footer'

function App() {
  const TITLE = "The Irregular Verbs Game";

  return <div className="app">
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <Header />
    <Game />
    <Footer />
  </div>
}

export default App;
