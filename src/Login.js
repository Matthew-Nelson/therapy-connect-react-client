import React, {Component} from 'react'
import { Button, ButtonGroup, Navbar, Nav, ControlLabel, Jumbotron, Grid, Col, Row } from 'react-bootstrap'

class LogIn extends Component {
  _handleLogin(evt) {
    evt.preventDefault()
    const credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onLogin(credentials)
  }

  render() {
    return (

      <Grid>
        <Row>
          <Jumbotron>
            <div className='container'>
              <h2>Log In</h2>
              <form onSubmit={this._handleLogin.bind(this)}>
                <input type='text' placeholder='Email' ref='email' />
                <input type='password' placeholder='Password' ref='password' />
                <Button className="btn btn-md" bsStyle="primary" type='submit'>Log In</Button>
              </form>
            </div>
          </Jumbotron>
        </Row>
      </Grid>

    )
  }
}

export default LogIn
