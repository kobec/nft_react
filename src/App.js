import './App.css';
import Minter from './Minter';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './Components/Header/Header.js';
import Collected from './Components/Collected/Collected.js';

function App() {
  return (
    <div className="App">
        <Router>
            <Header />
         {/*   <Minter></Minter>*/}
            <Route path="/" exact component={Minter}/>
            <Route path="/collected" component={Collected}/>
            {/*<Route path="/1" render={() => <h2>Welcome to StarD22222</h2>} />
            <Route path="/planets" component={PlanetsPage} />
            <Route path="/starships" component={StarshipsPage} />*/}

        </Router>
    </div>
  );
}

export default App;
