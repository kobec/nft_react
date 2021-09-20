import React from 'react';
import './App.css';
import Minter from './Minter';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './Components/Header/Header.js';
import Collected from './Components/Collected/Collected.js';
import ItemDetails from './Components/Item-Details/item-details';


function App() {

    return (
        <div className="App">
            <Router>
                <Header />
                <Route path="/" exact component={Minter} />
                <Route path="/collected/" component={Collected} />
                <Route path="/assets/:contract_address/:token_id" component={ItemDetails} />
            </Router>
        </div>
    );
}

export default App;
