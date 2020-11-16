import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/token-service'
import UserContext from '../../contexts/UserContext'
import './Header.css'

class Header extends Component {
  static contextType = UserContext

  handleLogoutClick = () => {
    this.context.processLogout()
  }

  renderLoginLink() {
    return (
      <nav className='center'>
        <Link className='nav-link' to='/login'>Login</Link>
        {' '}
        <Link className='nav-link' to='/register'>Sign up</Link>
      </nav>
    )
  }
  
  renderLogoutLink() {
    return (
      <div className='logout'>
        <span className='user'>
          Welcome {this.context.user.name}!
        </span>
        <nav>
          <Link className='nav-link center'
            onClick={this.handleLogoutClick}
            to='/login'>
            Logout
          </Link>
        </nav>
      </div>
    )
  }


  render() {
    return (
      <header className='Header center'>
        <h1>
          <Link to='/'>
            Language Learner
          </Link>
        </h1>
        {TokenService.hasAuthToken()
          ? this.renderLogoutLink()
          : this.renderLoginLink()}
      </header>
    );
  }
}

export default Header
