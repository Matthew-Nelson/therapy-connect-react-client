import React, {Component} from 'react'
import { Grid, Col, Row, Jumbotron } from 'react-bootstrap'

class Home extends Component {

  render() {
    return (
      <div className='container'>
        <Jumbotron>
          <h1>Welcome to Therapy Connect!</h1>
          <p>An application for physical therapists to connect with their clients. Through this application, therapists can quickly and easily assign their clients personalized routines and exercises for them to complete.</p>
          <p>Start by logging in or signing up!</p>
        </Jumbotron>
      </div>
    )
  }
}

export default Home
