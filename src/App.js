import './App.css';
import React from 'react';
import Navi from './components/Navi';
import { Row, Container, Col } from 'reactstrap';
import { Route, Routes } from 'react-router';
import Files from './components/files/Files';
import Editor from './components/editor/Editor';
class App extends React.Component{

  render(){
      return(
        <div>
        <Container>
          <Navi/>
          <Row>
            <Col>
              <Routes>
                <Route exact path='/' element={<Files setContent = {this.setContent}/>} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </div>
      );
  }
};

export default App;