import React from "react";
import '../css/Login.css';
import $ from 'jquery';
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom";
import logo from '../assets/logo.svg';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.props = props
        this.state = {
            uname: "",
            pwd: "",
            error: "",
            apiResponse: null,
            apiStatus: 0
        }
    }

    componentDidMount() {
        $.ajax(
            {
                url: "https://3.6.198.164.nip.io/login",
                type: "GET",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                complete: () => {

                },
                success: (data, textStatus, xhr) => {
                    if (data.status === 1) {
                        this.props.navigate("/dashboard")
                    }
                },
                error: () => {

                }
            }
        )
    }

    onUnameChange = (e) => {
        this.setState({uname: e.target.value, error: ""})
    }
    onPwdChange = (e) => {
        this.setState({pwd: e.target.value, error: ""})
    }
    apiRequestComplete = () => {
        if (!(this.state.apiStatus === -1)) {
            if (this.state.apiResponse.status === -1) {
                this.setState({error: this.state.apiResponse.message});
            } else if (this.state.apiResponse.status === 1) {
                this.props.navigate('/dashboard')
            }
        } else {
            this.setState({error: "A service error occurred.."});
        }
    }
    onSubmitClick = (e) => {
        e.preventDefault();
        let cookie = new Cookies();
        if (this.state.uname !== "" || this.state.pwd !== "") {
            $.ajax({
                url: "https://3.6.198.164.nip.io/login",
                type: "POST",
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                headers: {"x-csrftoken": cookie.get('csrftoken')},
                data: {uname: this.state.uname, pwd: this.state.pwd},
                complete: () => {
                    this.apiRequestComplete();
                },
                success: (data, textStatus, xhr) => {
                    this.setState({apiResponse: data, apiStatus: 1});
                },
                error: () => {
                    this.setState({apiStatus: -1})
                }
            })
        }
    }

    render() {
        return (
            <section className="login-clean h-100">
                <form noValidate={true}>
                    <h2 className="text-center text-white">LOGIN&nbsp;</h2>
                    <div className="illustration"><img src={logo} alt="logo"/></div>
                    <div className="mb-3">
                        <input className="form-control" type="text" name="uname" placeholder="Username"
                               value={this.state.uname} onChange={this.onUnameChange}/>
                    </div>
                    <div className="mb-3">
                        <input className="form-control" type="password" name="password"
                               placeholder="Password" value={this.state.pwd} onChange={this.onPwdChange}/>
                    </div>
                    <div className={"error " + (!this.state.error ? "visually-hidden" : "")}>
                        <p className="text-end text-danger">{this.state.error}</p>
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-warning d-block w-100" type="submit" onClick={this.onSubmitClick}>Log
                            In
                        </button>
                    </div>
                    <a className="forgot" href="#" style={{fontSize: "14px", paddingBottom: "20px"}}
                       onClick={() => this.props.navigate('/signup')}>Sign Up</a>
                    <a className="forgot" href="#" data-bs-toggle="modal" data-bs-target="#modal-1">Forgot your username
                        or
                        password?</a>
                </form>
                <div className="modal fade" role="dialog" tabIndex="-1" id="modal-1">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Forgot Username/Password?</h4>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"
                                        aria-label="Close"/>
                            </div>
                            <div className="modal-body">
                                <p>Contact your admin..</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" type="button" data-bs-toggle="modal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

function Login() {
    let navigate = useNavigate();
    return <Main navigate={navigate}/>;
}

export default Login;