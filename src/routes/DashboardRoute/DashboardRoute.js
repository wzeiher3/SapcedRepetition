import React, { Component } from "react";
import { Link } from "react-router-dom";
import LanguageService from "../../services/language-service";
import languageContext from "../../contexts/languageContext";
import './DashboardRoute.css';

class DashboardRoute extends Component {
  state = {
    error: null,
  };

  static contextType = languageContext;
  componentDidMount() {
    LanguageService.getWords()
      .then((res) => {
        this.context.setLangAndWords(res)})
      .catch((error) => this.setState({ error: error }));
  }

  render() {
    return (
      <section className="dashboard">
        <h2>Learn {this.context.language.name}!</h2>
        <Link to="/learn">
          <button id="learn_button" type="button">Start practicing</button>
        </Link>
        
        <p>Total correct: {this.context.language.total_score}</p>
        <section className="word_list_box">
          <h3>Words to practice</h3>
          <ul className="word_list">
            {this.context.words.map((word, index) => {
              return (
                <li key={index} className="word_item">
                    <h4 id="name-title">{word.original}</h4>
                  <p>Correct: {word.correct_count}</p>
                  <p>Incorrect: {word.incorrect_count}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
    );
  }
}

export default DashboardRoute;