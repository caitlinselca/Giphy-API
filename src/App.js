import React, {Component} from 'react';
import './App.css';
import PropTypes from "prop-types";
import SearchBar from './SearchField';

class App extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
      </div>
    );
  }
}

export default App;