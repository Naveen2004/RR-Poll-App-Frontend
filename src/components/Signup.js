import '../css/Login.css';
import {Link, useNavigate} from "react-router-dom";
import React from "react";
import $ from "jquery";
import {Modal} from "bootstrap";
import Cookies from "universal-cookie";
import logo from "../assets/logo.svg";


function ModalSuccess() {
    let navigate = useNavigate();
    return (<div className="modal fade" role="dialog" tabIndex="-1" id="modal-1">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title text-success">Success</h4>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"/>
                </div>
                <div className="modal-body">
                    <p>User Created succesfully, Please login..</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" type="button" data-bs-toggle="modal"
                            onClick={() => {
                                navigate('/login');
                                console.clear();
                            }}>Login
                    </button>
                </div>
            </div>
        </div>
    </div>);
}

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            error: "", uname: "", pwd: "", cnfPwd: "", email: "", apiResponse: null, apiStatus: 0
        }
    }

    componentDidMount() {
        $.ajax(
            {
                url: "https://3.6.198.164.nip.io/signup",
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
        this.setState({uname: e.target.value, error: ""});
    }

    onEmailChange = (e) => {
        this.setState({email: e.target.value, error: ""});
    }

    onPwdChange = (e) => {
        this.setState({pwd: e.target.value, error: ""});
    }

    onCnfPwdChange = (e) => {
        this.setState({cnfPwd: e.target.value, error: ""});
    }
    apiRequestComplete = () => {
        if (!(this.state.apiStatus === -1)) {
            if (this.state.apiResponse.status === -1) {
                this.setState({error: this.state.apiResponse.message})
            } else if (this.state.apiResponse.status === 1) {
                new Modal(document.getElementById("modal-1")).show();
            }
        } else {
            this.setState({error: "A Service error occurred.."})
        }
    }
    onSubmitClick = (e) => {
        e.preventDefault();
        let cookie = new Cookies();
        if (this.state.uname !== "" || this.state.pwd !== "" || this.state.cnfPwd !== "") {
            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
                this.setState({error: "Please Enter a valid Email.."})
                return;
            }
            if (this.state.pwd !== this.state.cnfPwd) {
                this.setState({error: "Password and Confirm password didn't match."})
                return;
            }
            if (this.state.pwd.length < 5 && this.state.uname.length < 5) {
                this.setState({error: "Username and Password should be greater than 5 characters.."})
                return;
            }
            if (this.state.uname.length < 5) {
                this.setState({error: "Username should be greater than 5 characters.."})
                return;
            }
            if (this.state.pwd.length < 5) {
                this.setState({error: "Password should be greater than 5 characters.."})
                return;
            }
            $.ajax({
                url: "https://3.6.198.164.nip.io/signup",
                type: "POST",
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                headers: {"x-csrftoken": cookie.get('csrftoken')},
                data: {uname: this.state.uname, email: this.state.email, pwd: this.state.pwd},
                complete: () => {
                    this.apiRequestComplete();
                },
                success: (data, textStatus, xhr) => {
                    this.setState({apiResponse: data, apiStatus: 1})
                },
                error: () => {
                    this.setState({apiStatus: -1})
                },
            });

        } else {
            this.setState({error: "Please check the above fields"})
        }
    }

    render() {
        return (<section className="login-clean h-100">
            <form noValidate={true}>
                <h2 className="text-center text-white">SIGN UP&nbsp;</h2>
                <div className="illustration"><img src={logo} alt="logo"/></div>
                <div className="mb-3">
                    <input className="form-control" type="text" name="uname" placeholder="Username"
                           value={this.state.uname} onChange={this.onUnameChange}/>
                </div>
                <div className="mb-3">
                    <input className="form-control" type="text" name="email" placeholder="Email"
                           value={this.state.email} onChange={this.onEmailChange}/>
                </div>
                <div className="mb-3">
                    <input className="form-control" type="password" name="password"
                           placeholder="Password" value={this.state.pwd} onChange={this.onPwdChange}/>
                </div>
                <div className="mb-3">
                    <input className="form-control" type="password" name="password"
                           placeholder="Confirm Password" value={this.state.cnfPwd}
                           onChange={this.onCnfPwdChange}/>
                </div>
                <div className={"error " + (!this.state.error ? "visually-hidden" : "")}>
                    <p className="text-end text-danger">{this.state.error}</p>
                </div>
                <div className="mb-3">
                    <button className="btn btn-warning d-block w-100" type="submit"
                            onClick={this.onSubmitClick}>Sign Up
                    </button>
                </div>
                <Link to="/login" className="forgot" href="#" style={{fontSize: 16 + "px"}}>Login</Link>
            </form>
            <ModalSuccess/>
        </section>);
    }
}

const Signup = () => {
    let navigate = useNavigate();
    return <Main navigate={navigate}/>;
}
export default Signup;