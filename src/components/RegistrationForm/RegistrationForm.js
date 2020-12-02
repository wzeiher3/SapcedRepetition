import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Required, Label } from '../Form/Form'
import AuthApiService from '../../services/auth-api-service'
import Button from '../Button/Button'
import './RegistrationForm.css'

class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => { }
  }

  state = { error: null }

  firstInput = React.createRef()

  handleSubmit = ev => {
    ev.preventDefault()
    const { name, username, password } = ev.target
    console.log(name.value, username.value, password.value)
    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
      .then(user => {
        
        this.props.onRegistrationSuccess(username.value, password.value)
        name.value = ''
        username.value = ''
        password.value = ''
        
        // this.props.onRegistrationSuccess()
      })
      .catch(res => {
        this.setState({ error: res.error })
      })

  }

  // handleLogIn = (username, password) => {
  //   this.setState({ error: null })

  //   AuthApiService.postLogin({
  //     username: username.value,
  //     password: password.value,
  //   })
  //     .then(res => {
  //       username.value = ''
  //       password.value = ''
  //       this.context.processLogin(res.authToken)
  //       this.props.onLoginSuccess()
  //     })
  //     .catch(res => {
  //       this.setState({ error: res.error })
  //     })
  // }

  componentDidMount() {
    this.firstInput.current.focus()
  }

  render() {
    const { error } = this.state
    return (
      <form className='main-form center'
        onSubmit={this.handleSubmit}
      >
        <div role='alert'>
          {error && <p id="errorAlert">{error}</p>}
        </div>
        <div className='LoginItem center'>
          <Label htmlFor='registration-name-input'>
            Enter your name<Required />
          </Label>
          
          <Input
            ref={this.firstInput}
            id='registration-name-input'
            name='name'
            required
          />

        </div>
        <div className='LoginItem center'>
          <Label htmlFor='registration-username-input'>
            Choose a username<Required />
          </Label>
          
          <Input
            id='registration-username-input'
            name='username'
            required
          />
        
        </div>
        <div className='LoginItem center'>
          <Label htmlFor='registration-password-input'>
            Choose a password<Required />
          </Label>
          
          <Input
            id='registration-password-input'
            name='password'
            type='password'
            required
          />
        
        
        </div>
        <footer className='center'>
          
          <Button className='LoginItem center' type='submit'>
            Sign up
          </Button>
          
          {' '}
          <Link to='/login'>Already have an account?</Link>
        </footer>
      </form>
    )
  }
}

export default RegistrationForm
