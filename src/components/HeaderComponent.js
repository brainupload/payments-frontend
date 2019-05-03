import React, {Component} from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink, withRouter } from 'react-router-dom';
import { baseUrl } from "../shared/baseUrl";
import { setApiToken, unsetApiToken, addUserData, purgeAccounts,
    purgeUserData, purgeTransactions } from '../redux/ActionCreators';
import { connect } from "react-redux";

const mapStateToProps = state => {
    return {
        apiToken: state.apiToken
    }
};

const mapDispatchToProps = dispatch => ({
    setApiToken: (token) => { dispatch(setApiToken(token)) },
    unsetApiToken: () => { dispatch(unsetApiToken()) },
    addUserData: (data) => { dispatch(addUserData(data)) },
    purgeUserData: () => { dispatch(purgeUserData()) },
    purgeAccounts: () => { dispatch(purgeAccounts()) },
    purgeTransactions: () => { dispatch(purgeTransactions()) }
});

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            isLoginModalOpen: false,
            isRegisterModalOpen: false,
            loggedIn: !!this.props.apiToken,
            username: localStorage.getItem('username')
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleRegistration(event) {
        event.preventDefault();
        fetch(baseUrl + 'core/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': this.username.value, 'password': this.password.value})
        })
            .then(res => res.json())
            .then(json => {
                this.props.setApiToken(json.token);
                this.setState({
                    username: json.username
                });
                this.toggleRegisterModal();
            });
    };

    handleLogin(event) {
        event.preventDefault();
        fetch(baseUrl + 'token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': this.username.value, 'password': this.password.value})
        })
            .then(res => res.json())
            .then(json => {
                this.props.setApiToken(json.token);
                this.props.addUserData(json.user);
                this.setState({
                    username: json.user.username
                });
                this.toggleLoginModal();
            });
    };

    handleLogout() {
        this.props.unsetApiToken();
        this.props.purgeUserData();
        this.props.purgeTransactions();
        this.props.purgeAccounts();
        this.setState({
            username: '',
            loggedIn: false
        });
    };

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleLoginModal() {
        this.setState({
            isLoginModalOpen: !this.state.isLoginModalOpen
        });
    }

    toggleRegisterModal() {
        this.setState({
            isRegisterModalOpen: !this.state.isRegisterModalOpen
        });
    }

    render() {

        const RenderNavButtons = ({isLoggedIn}) => {

            if (!isLoggedIn) {
                return (
                    <NavItem>
                        <Button outline onClick={this.toggleLoginModal}><span className="fa fa-sign-in"></span> Login</Button>{' '}
                        <Button outline onClick={this.toggleRegisterModal}><span className="fa fa-user-plus"></span> Register</Button>
                    </NavItem>
                )
            }
            else
                return (
                    <NavItem>
                        <Button outline onClick={this.handleLogout}><span className="fa fa-sign-in"></span> Logout {this.state.username}</Button>
                    </NavItem>
                )
        };

        return (
            <React.Fragment>

                <Modal isOpen={this.state.isLoginModalOpen} toggle={this.toggleLoginModal}>
                    <ModalHeader toggle={this.toggleLoginModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                       innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                       innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Login</Button>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.isRegisterModalOpen} toggle={this.toggleRegisterModal}>
                    <ModalHeader toggle={this.toggleRegisterModal}>Register</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleRegistration}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                       innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                       innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Register</Button>
                        </Form>
                    </ModalBody>
                </Modal>

                <Navbar dark expand="md">
                    <div className="container">

                        <NavbarToggler onClick={this.toggleNav} />

                        <NavbarBrand className="mr-5">
                            <img src="/assets/images/pay-logo.jpg" height="75" width="75" alt="Pay Logo" />
                        </NavbarBrand>

                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavLink className="nav-link" to="/accounts/">
                                    <span className="fa fa-info fa-lg"> Accounts</span>
                                </NavLink>
                                <NavLink className="nav-link" to="/transfer/">
                                    <span className="fa fa-credit-card fa-lg"> Transfer</span>
                                </NavLink>
                                <NavLink className="nav-link" to="/history/">
                                    <span className="fa fa-list fa-lg"> History</span>
                                </NavLink>
                            </Nav>
                        </Collapse>

                        <Nav className="ml-auto" navbar>
                            <RenderNavButtons isLoggedIn={this.state.loggedIn} />
                        </Nav>

                    </div>
                </Navbar>

                <Jumbotron>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h3>Fast Payments Prototype</h3>
                                <p>Faster Payments Service is an initiative to reduce payment times</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>

            </React.Fragment>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));