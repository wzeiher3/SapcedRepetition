import React, { Component } from 'react';
import LanguageApiService from '../../services/language-service';
import { Input, Required, Label } from '../../components/Form/Form';
import Results from '../../components/Results/Results';
import languageContext from '../../contexts/languageContext';
import './LearningRoute.css'
var msg = new SpeechSynthesisUtterance();
msg.text = "bien y tu como estas";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';

class LearningRoute extends Component {
  static contextType = languageContext;
  constructor(props) {
    super(props);
    this.state = {
      nextWord: null,
      totalScore: null,
      wordIncorrectCount: null,
      wordCorrectCount: null,
      answer: null,
      isCorrect: null,
      guessBool: false,
      loading: true,
      guessTerm: '',
      speechBool: false,
      listening: false,
    };
  }

  handleSpeech = () => {
    this.setState({
      guessTerm: '',
      listening: true,
    })

    recognition.start();

    recognition.onresult = (e) => {
      let current = e.resultIndex;

      let transcript = e.results[current][0].transcript;

      this.setState({
        guessTerm: transcript.toLowerCase(),
        listening: false,
      })

    }
  };

  handleSendGuess = (e) => {
    e.preventDefault();
    const guess = this.state.guessTerm;
    const guessBody = {
      guess
    }

    LanguageApiService.postGuess(guessBody)
      .then(summary => {
        let newCorrectScore = this.state.wordCorrectCount;
        let newIncorrectScore = this.state.wordIncorrectCount;
        if (summary.isCorrect) {
          newCorrectScore++;
        } else {
          newIncorrectScore++;
        }
        this.setState({
          totalScore: summary.totalScore,
          wordIncorrect: newIncorrectScore,
          wordCorrect: newCorrectScore,
          answer: summary.answer,
          isCorrect: summary.isCorrect,
          guessBool: true
        })
      })

  }



  setAnswer = (val) => {
    this.setState({
      guessTerm: val.target.value
    })
  }

  handleNextWord = (event) => {
    event.preventDefault();
    LanguageApiService.getHead()
      .then(head => {
        this.setState({
          nextWord: head.nextWord,
          wordIncorrectCount: head.wordIncorrectCount,
          wordCorrectCount: head.wordCorrectCount,
          guessBool: false,
          guessTerm: ''
        })
      })

  }

  componentDidMount() {
    if (this.context.language === "") {
      LanguageApiService.getWords()
        .then((res) => this.context.setLangAndWords(res))
        .catch((error) => this.setState({ error: error }));
    }
    LanguageApiService.getHead()
      .then(head => {
        this.setState({
          nextWord: head.nextWord,
          wordIncorrectCount: head.wordIncorrectCount,
          wordCorrectCount: head.wordCorrectCount,
          totalScore: head.totalScore,
          loading: false,
          guessTerm: ''
        })
      })
  }

  render() {
    let headerText = 'Translate the word:'
    if (this.state.isCorrect && this.state.guessBool) {
      headerText = 'You were correct! :D'
    }
    if (!this.state.isCorrect && this.state.guessBool) {
      headerText = 'Good try, but not quite right :('
    }

    return (
      <section className="learning-container">
        {!this.state.loading && <><h2>{headerText}</h2><span className='word-translate'>{this.state.nextWord}{''}</span></>}
        <form id="learning-form" onSubmit={this.handleSendGuess}>

          {!this.state.guessBool && <><Label htmlFor='learn-guess-input' className="text-center">
            What's the translation for this word?
          </Label></>}

          {!this.state.guessBool && <Input
            id='learn-guess-input'
            name='answer'
            className="center"
            value={this.state.guessTerm}
            required
            onChange={e => this.setAnswer(e)}
          />}

          {this.state.listening && <p>Listening...</p>}

          {!this.state.guessBool && <button className="guess-submit" type="submit">
            Submit your answer
          </button>}
          
          <div className="results-container center DisplayScore">
            <p className='results-p'>Your total score is: {this.state.totalScore}</p>
          </div>
          {this.state.guessBool && <Results
            isCorrect={this.state.isCorrect}
            totalScore={this.state.totalScore}
            guess={this.state.guessTerm}
            answer={this.state.answer}
            original={this.state.nextWord}
            onNextWordClick={this.handleNextWord} />}

        </form>

        <div className="results-container center">
          <p>You have answered this word correctly {this.state.wordCorrectCount} times.</p>
          <p>You have answered this word incorrectly {this.state.wordIncorrectCount} times.</p>
        </div>

      </section>
    );
  }
}

export default LearningRoute;