import React, {Component} from 'react'
import { Button, ButtonGroup, Navbar, Nav, ControlLabel, Jumbotron, Grid, Col, Row } from 'react-bootstrap'

class SignUp extends Component {
  _handleSignup(evt) {
    evt.preventDefault()
    const newUser = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      isPt: this.refs.isPt.checked

    }
    this.props.onSignup(newUser)
  }

  render() {
    return (
      <Grid>
        <Row>
          <Jumbotron>
            <div className='container'>
              <h2>Sign Up</h2>
              <form onSubmit={this._handleSignup.bind(this)}>
                Name: <input type='text' placeholder='Name' ref='name' /> <br></br>
                Email: <input type='text' placeholder='Email' ref='email' /> <br></br>
                Password: <input type='password' placeholder='Password' ref='password' /> <br></br>
                Are you signing up as a therapist? <input type='radio' ref='isPt' /><br></br>
                <Button className="btn btn-md" bsStyle="primary" type='submit'>Sign Up</Button>
              </form>
            </div>
          </Jumbotron>
        </Row>
      </Grid>
    )
  }
}

export default SignUp
