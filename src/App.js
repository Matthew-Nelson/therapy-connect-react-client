import React, { Component } from 'react'
import './App.css'
import clientAuth from './clientAuth'
import Home from './Home'
import LogIn from './Login'
import SignUp from './Signup'
import Feedback from './Feedback'
import Instructions from './Instructions'
import Routines from './Routines'
import { Button, ButtonGroup, Navbar, Nav, ControlLabel, Jumbotron, Grid, Col, Row } from 'react-bootstrap'
//import your components here

class App extends Component {

  constructor() {
    super()
    this.state = {
      currentUser: null,
      loggedIn: false,
      clients: [],
      routine: {},
      reviews: []
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
      clientAuth.getClients(currentUser._id)
        .then(res => {
          this.setState({
            clients: res.data.clients,
            //adding our reviews in to the state when we are setting client state
            reviews: res.data.reviews
          })
        })
    }
    if(currentUser) {
      clientAuth.getRoutine(currentUser.routine)
      .then(res => {
        if(res.data){
          const loadingRoutine = {
            name: res.data.name,
            body: res.data.body,
            completeDate: res.data.completeDate,
            id: res.data._id,
            therapistId: res.data.therapistId
          }
          this.setState({
            routine: loadingRoutine
          })
        }
      })
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
                id: res.data._id,
                therapistId: res.data.therapistId
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

  _feedback() {
    this.setState({
      view: 'feedback'
    })
  }

  _instructions() {
    this.setState({
      view: 'instructions'
    })
  }

  _routines() {
    this.setState({
      view: 'routines'
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
      completeDate: this.refs.completeDate.value,
      therapistId: this.state.currentUser._id
    }
    console.log(newRoutine);
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

  _deleteRoutine(rId, tId) {
    console.log(rId)
    //this will pass our IDs to the client auth doc and run the deleteRoutine fxn
    console.log(tId)
    //passing our info to run new fxn
    if (this.refs.routineReview.value) {
      //will only create a review if there is actually a value in the text area
      clientAuth.getTherapist(tId).then((res) => {
        console.log(res)
        var therapist = res.data
        console.log(therapist)
        this.refs.routineReview
        var newReview = {}
        newReview.title = this.state.routine.name
        newReview.client = this.state.currentUser.name
        newReview.review = this.refs.routineReview.value
        console.log(newReview)
        //push to array within therapist reviews
        console.log(therapist.reviews);
        therapist.reviews.push(newReview)
        console.log(therapist);
        clientAuth.updateTherapist(therapist)
      })
    }
    clientAuth.deleteRoutine(rId).then((res) => {
      this.setState({
        routine: {}
      })
    })
  }

  _deleteReview(){}

  render() {

    console.log(this.state.view);

    const clients = this.state.clients.map((client, i) => {
      return (
        <option key={i} id={client._id}>
          {client.name}
        </option>
      )
    })

    const routine = this.state.routine
    console.log('routine thats live ' + this.state.routine.name)

    //grabbing our reviews and setting them to an array in memory
    const reviews = this.state.reviews.map((r, i) => {
      return (
      <p key={i}>
        <p>Here is what <strong>{r.client}</strong> thought of the <strong>{r.title}</strong> routine you assigned them</p>
        <p><em>"{r.review}"</em></p>
        <Button onClick={this._deleteReview.bind(this, r._id)}>X</Button><br></br><br></br>



      </p>
      )
      console.log(reviews);
    })

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
                {/* {this.state.loggedIn && (
                  <Button type="button" bsStyle="primary" className="btn btn-lg" onClick={this._logOut.bind(this)}>User Info</Button>
                )} */}
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
          main: <Main onMain={this._main.bind(this)} />,
          feedback: <Feedback onFeedback={this._feedback.bind(this)} />,
          instructions: <Instructions onInstructions={this._instructions.bind(this)} />,
          routines: <Routines onRoutines={this._routines.bind(this)} />
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
                          <div>
                            <Button type="button" bsStyle="primary" className="btn btn-lg" name='isntructions' onClick={this._setView.bind(this)}>Instructions</Button>
                            <Button type="button" bsStyle="primary" className="btn btn-lg" name='routines' onClick={this._setView.bind(this)}>Routines</Button>
                            {this.state.currentUser.isPt && (
                              <Button type="button" bsStyle="primary" className="btn btn-lg" name='feedback' onClick={this._setView.bind(this)}>Feedback</Button>
                            )}
                          </div>
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
                      <Row>
                        <Jumbotron>
                          <h2>Reviews Section!</h2>
                          <p>When your clients review their routines you can see them here.</p>
                          <ul>
                            {reviews}
                          </ul>
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
                          <Button type="button" bsStyle="primary" className="btn btn-lg" name='isntructions' onClick={this._setView.bind(this)}>Instructions</Button>
                          <Button type="button" bsStyle="primary" className="btn btn-lg" name='routines' onClick={this._setView.bind(this)}>Routines</Button>
                          <h2>{this.state.loggedIn ? "Welcome " + this.state.currentUser.name + "!": ""}</h2><br></br>
                          {this.state.routine && (
                            <div>
                              <p>Once your physical therapist has given you their Therapy Connect id, enter it into the field below and add yourself to their network.</p>
                              <p>Your therapist can then send you your next routine to complete.</p>
                              <form id="notPtForm" onSubmit={this._addPt.bind(this)}>
                                <label>Therapist ID</label><br></br>
                                <input ref="ptId" type="text" placeholder="5h3xih1h6..."></input>
                                <Button className="btn btn-md" bsStyle="primary" type='submit'>Add to network</Button>
                              </form>
                            </div>
                          )}

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
                                </Row>
                              </Grid>

                              <div>
                                <p className="rr"><br></br>{routine.body}</p>
                                <Row>
                                  <Col md={8}>
                                    {/* creating an area for feedback */}
                                    <p>write a review on this workout for your therapist. Once you mark the workout as complete, your review will be sent to your therapist</p>
                                    <textarea ref="routineReview" placeholder="This workout irritated my knee...">
                                    </textarea>
                                  </Col>
                                  <Col md={4}>
                                    {/* here we need to pass the therapist ID who created the routine, and the routine ID */}
                                    {/* also passing in the text of the review */}
                                    <Button type="button" id="compl-btn" className="btn btn-md" bsStyle="primary" onClick={this._deleteRoutine.bind(this, routine.id, routine.therapistId, )}>Mark Complete</Button>
                                  </Col>
                                </Row>



                                <style>{"\
                                  .rr{\
                                    white-space: pre-wrap;\
                                    background-color: white;\
                                    max-width: 80%;\
                                    text-align: left;\
                                    padding-left: 20px;\
                                    padding-bottom: 20px;\
                                  }\
                                  "}
                                </style>
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
