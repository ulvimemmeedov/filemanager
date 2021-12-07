import React ,{Component}from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

export default class Navi extends Component {
  constructor(props){
      super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
        isOpen : false
    }
  }
  toggle(){
      this.setState({
          isOpen : !this.state.isOpen
      });
  }

  render (){
    return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">File Manager</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/upload">upload</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="">test</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
    )
  };
}