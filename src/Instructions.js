import React, {Component} from 'react'
import { Grid, Col, Row, Jumbotron, Button } from 'react-bootstrap'

class Instructions extends Component {

  render() {
    return (
      <div className='container'>
        <Jumbotron>
          <Button type="button" bsStyle="primary" className="btn btn-lg" name='isntructions' onClick={this._setView.bind(this)}>Instructions</Button>
          <Button type="button" bsStyle="primary" className="btn btn-lg" name='routines' onClick={this._setView.bind(this)}>Routines</Button>
          {this.state.currentUser.isPt && (
            <Button type="button" bsStyle="primary" className="btn btn-lg" name='feedback' onClick={this._setView.bind(this)}>Feedback</Button>
          )}

          {!this.state.currentUser && (
            <div>
              {this.state.currentUser.isPt && (
                <div>
                  <h1>I am a pt</h1>
                </div>
              )}
              {!this.state.currentUser.isPt && (
                <div>
                  <h1>I am NOT a pt</h1>
                </div>
              )}
            </div>
          )}



        </Jumbotron>
      </div>
    )
  }
}

export default Instructions
