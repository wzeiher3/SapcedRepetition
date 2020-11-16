import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from '../Header/Header'
import PrivateRoute from '../PrivateRoute/PrivateRoute'
import PublicOnlyRoute from '../PublicOnlyRoute/PublicOnlyRoute'
import RegistrationRoute from '../../routes/RegistrationRoute/RegistrationRoute'
import LoginRoute from '../../routes/LoginRoute/LoginRoute'
import DashboardRoute from '../../routes/DashboardRoute/DashboardRoute'
import LearningRoute from '../../routes/LearningRoute/LearningRoute'
import NotFoundRoute from '../../routes/NotFoundRoute/NotFoundRoute'
import './App.css'
import languageContext from '../../contexts/languageContext'
import LanguageService from '../../services/language-service'
import TokenService from '../../services/token-service'

export default class App extends Component {
  state = {
    hasError: false,
    language: "",
    words: [],
  }

  static getDerivedStateFromError(error) {
    console.error(error)
    return { hasError: true }
  }

  static contextType = languageContext;

  setLangAndWords = (res) => {
    this.setState({
      language: res.language,
      words: res.words
    })
  };

  render() {

    if (TokenService.hasAuthToken() && this.state.language === "") {
      LanguageService.getWords()
        .then((res) => this.state.setLangAndWords(res))
        .catch((error) => this.setState({ error: error }));
    }
    const value = {
      language: this.state.language,
      words: this.state.words,
      setLangAndWords: this.setLangAndWords,

    };

    const { hasError } = this.state
    return (
      <div className='App'>
        <languageContext.Provider value={value}>

          <Header />
          <main>
            {hasError && (
              <p>There was an error! Oh no!</p>
            )}
            <Switch>
              <PrivateRoute
                exact
                path={'/'}
                component={DashboardRoute}
              />
              <PrivateRoute
                path={'/learn'}
                component={LearningRoute}
              />
              <PublicOnlyRoute
                path={'/register'}
                component={RegistrationRoute}
              />
              <PublicOnlyRoute
                path={'/login'}
                component={LoginRoute}
              />
              <Route
                component={NotFoundRoute}
              />
            </Switch>
          </main>
      
        </languageContext.Provider>
      </div>
    );
  }
}
