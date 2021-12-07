import React ,{Component}from 'react';
import {
  Container
} from 'reactstrap';
import SunEditor from 'suneditor-react';
import api from '../../helpers/api';
const wind = window;
export default class Editor extends Component {
  constructor(props){
      super(props);
      this.onChange = this.onChange.bind(this);
  }
  onChange(data){
    api.post('/writefile',{
        filename:this.props.rawName,
        content:data.toString()
    })
  }
  render (){
    return (
    <Container style={{padding:"50px"}} >
           <SunEditor 
           onChange={this.onChange}
           setContents = {this.props.content}
           setAllPlugins={false} 
           width="100%"
           name="code" 
           lang="en" 
           height={wind.innerHeight+"px"}
           
           />
    </Container>
    )
  };
}