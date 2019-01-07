import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../../components/Header/Header';
import HomePage from '../HomePage';
import PostsPage from '../PostsPage';
import UsersPage from '../UsersPage';
import SingleUserPage from '../UsersPage/SingleUserPage';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="container-fluid">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/posts" component={PostsPage} />
            <Route exact path="/users" component={UsersPage} />
            <Route exact path="/profile/:user" component={SingleUserPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
