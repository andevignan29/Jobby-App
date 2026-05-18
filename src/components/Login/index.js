import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', error: ''}

  submit = async e => {
    e.preventDefault()
    const {username, password} = this.state

    const res = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    })
    const data = await res.json()

    if (res.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({error: data.error_msg})
    }
  }

  render() {
    const {username, password, error} = this.state
    if (Cookies.get('jwt_token')) return <Redirect to="/" />

    return (
      <div className="bg-container">
        <form className="login" onSubmit={this.submit}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label className="label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            placeholder="Username"
            value={username}
            onChange={e => this.setState({username: e.target.value})}
          />

          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => this.setState({password: e.target.value})}
          />
          <button type="submit">Login</button>
          <p>{error}</p>
        </form>
      </div>
    )
  }
}

export default Login
