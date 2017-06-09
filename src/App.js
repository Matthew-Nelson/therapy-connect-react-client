import React, { Component } from 'react'
import './App.css'
import clientAuth from './clientAuth'
import Home from './Home'
import LogIn from './Login'
import SignUp from './Signup'
import { Button, ButtonGroup, Navbar, Nav, ControlLabel, Jumbotron, Grid, Col, Row } from 'react-bootstrap'
//import your components here

class App extends Component {

  constructor() {
    super()
    this.state = {
      currentUser: null,
      loggedIn: false,
      clients: [],
      routine: {}
    }
  }

  componentDidMount() {
    const currentUser = clientAuth.getCurrentUser()
    console.log(currentUser);
    this.setState({
      currentUser: currentUser,
      loggedIn: !!currentUser,
      view: currentUser ? 'main' : 'home'
    })
    if(currentUser) {
      console.log('FUCK THIS FIRST ' + currentUser.name);
      clientAuth.getClients(currentUser._id)
        .then(res => {
          this.setState({
            clients: res.data.clients
          })
        })
    }
    if(currentUser) {
      console.log('FUCK THIS ' + currentUser.routine);
      clientAuth.getRoutine(currentUser.routine)
      .then(res => {
        console.log(res);
        console.log(res.data)
        if(res.data){
          const loadingRoutine = {
            name: res.data.name,
            body: res.data.body,
            completeDate: res.data.completeDate,
            id: res.data._id
          }
          console.log(loadingRoutine);
          this.setState({
            routine: loadingRoutine
          })
          console.log(this.state.routine);
        }
      })
      console.log(this.state.routine);
    }
  }

  _signUp(newUser) {
    clientAuth.signUp(newUser).then((data) => {
      console.log(data)
      this.setState({
        view: 'login'
      })
    })
  }

  _logIn(credentials) {
    clientAuth.logIn(credentials)
      .then(user => {
        this.setState({
          currentUser: user,
          loggedIn: true,
          view: 'main'
        })
        return user
      })
      .then(user => {
        clientAuth.getClients(user._id)
          .then(res => {
            this.setState({
              clients: res.data.clients
            })
          })
        clientAuth.getRoutine(user.routine)
          .then(res => {
            if(res.data){
              const loadingRoutine = {
                name: res.data.name,
                body: res.data.body,
                completeDate: res.data.completeDate,
                id: res.data._id
              }
              this.setState({
                routine: loadingRoutine
              })
            }
          })
      })
  }

  _logOut() {
    clientAuth.logOut().then(message => {
      console.log(message)
      this.setState({
        currentUser: null,
        loggedIn: false,
        view: 'home',
        routine: {}
      })
    })
  }

  _main() {
    this.setState({
      view: 'main'
    })
  }

  _setView(evt) {
    evt.preventDefault()
    const view = evt.target.name
    this.setState({
      view: view
    })
  }

  _addPt(evt) {
    evt.preventDefault()
    const form = document.getElementById("notPtForm")
    clientAuth.addPt(this.refs.ptId.value).then(res => {
      console.log(res)
    })
    form.style.display = "none"
  }

  _updateRoutine(evt) {
    evt.preventDefault()
    const form = document.getElementById("ptForm")
    const newRoutine = {
      name: this.refs.name.value,
      body: this.refs.body.value,
      completeDate: this.refs.completeDate.value
    }
    const dropdown = this.refs.client
    const clientId = dropdown.options[dropdown.selectedIndex].id
    console.log(clientId)
    clientAuth.addRoutine(newRoutine)
      .then( res => {
        console.log(res);
        const routineId = res.data.routine._id
        console.log(clientId + " " + routineId);

        clientAuth.updateRoutine(clientId, routineId)
      })
    form.reset()
  }

  _deleteRoutine(id) {
    console.log(id)
    clientAuth.deleteRoutine(id).then((res) => {
      this.setState({
        routine: {}
      })
    })
  }

  render() {

    const clients = this.state.clients.map((client, i) => {
      return (
        <option key={i} id={client._id}>
          {client.name}
        </option>
      )
    })

    const routine = this.state.routine
    console.log('routine thats live ' + this.state.routine.name)

    return (

      <div className="App">
        <div className="navbar">
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a>Therapy Connect</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav pullRight>
              <ButtonGroup>
                {!this.state.loggedIn && (
                  <Button type="button" bsStyle="primary" className="btn btn-lg" name='signup' onClick={this._setView.bind(this)}>Sign Up</Button>
                )}
                {!this.state.loggedIn && (
                  <Button type="button" bsStyle="primary" className="btn btn-lg" name='login' onClick={this._setView.bind(this)}>Log In</Button>
                )}
                {this.state.loggedIn && (
                  <Button type="button" bsStyle="primary" className="btn btn-lg" onClick={this._logOut.bind(this)}>User Info</Button>
                )}
                {this.state.loggedIn && (
                  <Button type="button" bsStyle="primary" className="btn btn-lg" onClick={this._logOut.bind(this)}>Log Out</Button>
                )}
              </ButtonGroup>
            </Nav>
          </Navbar>
        </div>
        {{
          home: <Home/>,
          login: <LogIn onLogin={this._logIn.bind(this)} />,
          signup: <SignUp onSignup={this._signUp.bind(this)} />,
          // edit: <Edit onEditUser={this._editUser.bind(this)} />,
          //edit isnt anywhere yet
          main: <Main onMain={this._main.bind(this)} />
        }[this.state.view]}
        <div className="Main">
          {this.state.currentUser && (
            <div>
              {this.state.currentUser.isPt && (



                <div id="isPT">


                  <div id="physical-therapy-view">
                    <Grid>
                      <Row>
                        <Jumbotron className="jumbotron" id="routine-forms">
                          <h2>{this.state.loggedIn ? "Welcome " + this.state.currentUser.name + "!": ""}</h2><br></br>
                          <p>Once your clients have joined your network, you can prescribe them customized and detailed health routines.</p>
                          <p>Make sure you provide your clients with your id number (yours is <strong>{this.state.currentUser._id}</strong>) so they can add themselves to your network.</p>
                          <form id="ptForm">
                            <Row className="show-grid">
                              <Col md={4}>
                                <div>
                                  <label>Select Client</label><br></br>
                                  <select ref="client" id="clientName">
                                    {clients}
                                  </select><br></br><br></br>
                                </div>
                              </Col>
                              <Col md={4}>
                                <div>
                                  <label>Routine Name</label><br></br>
                                  <input ref="name" type="text" placeholder="eg: Wrist Protocol"></input><br></br><br></br>
                                </div>
                              </Col>
                              <Col md={4}>
                                <div>
                                  <label>Date</label><br></br>
                                  <input ref="completeDate" type="date"></input><br></br><br></br>
                                </div>
                              </Col>
                            </Row>
                            <Row className="show-grid">
                              <Col md={8}>
                                <label>Routine Details</label><br></br>
                                <textarea ref="body" placeholder="Wrist rolls 30 seconds" ></textarea><br></br><br></br>
                              </Col>
                              <Col md={4}>
                                <Button id="create-routine" className="btn btn-lg" bsStyle="primary" type="submit" onClick={this._updateRoutine.bind(this)}>Create Routine</Button><br></br>
                              </Col>
                            </Row>
                          </form>
                        </Jumbotron>
                      </Row>
                    </Grid>
                  </div>
                </div>
              )}
              {!this.state.currentUser.isPt && (
                <div id="notPT">
                  <div id="not-pt-view">
                    <Grid>
                      <Row>
                        <Jumbotron>
                          <h2>{this.state.loggedIn ? "Welcome " + this.state.currentUser.name + "!": ""}</h2><br></br>
                          <p>Once your physical therapist has given you their Therapy Connect id, enter it into the field below and add yourself to their network.</p>
                          <p>Your therapist can then send you your next routine to complete.</p>
                          <form id="notPtForm" onSubmit={this._addPt.bind(this)}>
                            <label>Therapist ID</label><br></br>
                            <input ref="ptId" type="text" placeholder="5h3xih1h6..."></input>
                            <Button className="btn btn-md" bsStyle="primary" type='submit'>Add to network</Button>
                          </form>
                          {this.state.routine.name && (
                            <div>
                              <Grid>
                                <Row>
                                  <Col md={4}>
                                    <h3>{routine.name}</h3>
                                  </Col>
                                  <Col md={4}>
                                    <h3>{routine.completeDate}</h3>
                                  </Col>
                                  <Col md={4}>
                                    <Button type="button" id="compl-btn" className="btn btn-md" bsStyle="primary" onClick={this._deleteRoutine.bind(this, routine.id)}>Mark Complete</Button>
                                  </Col>
                                </Row>
                              </Grid>

                              <div>
                                <p className="rr"><br></br>{routine.body}</p>
                                <style>{"\
                                  .rr{\
                                    white-space: pre-wrap;\
                                    background-color: white;\
                                    max-width: 80%;\
                                    text-align: left;\
                                    padding-left: 20px;\
                                    padding-bottom: 20px;\
                                  }\
                                  "}</style>
                                </div>
                              </div>
                            )}
                            {!this.state.routine.name && (
                              <div>
                                <h3>Your therapist is cooking up your next routine as we speak...</h3>
                              </div>
                            )}
                        </Jumbotron>
                      </Row>
                      <Row>
                      </Row>
                    </Grid>
                  </div>


                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

class Main extends Component {

  render() {
    return (
      <div className='container'>
      </div>
    )
  }
}

export default App;
