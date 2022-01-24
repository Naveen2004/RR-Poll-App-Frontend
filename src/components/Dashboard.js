import React from "react";
import '../css/Dashboard.css'
import '../css/common.css'
import $ from "jquery";
import {Modal, Toast} from "bootstrap";
import {useNavigate} from "react-router-dom";
import logo from '../assets/logo.svg';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.props = props
        this.state = {
            user: {},
            question: "",
            options: [""],
            error: "",
            recentPolls: []
        }
    }

    componentDidMount() {
        this.refreshRecentPolls();
    }

    refreshRecentPolls = () => {
        $.ajax({
            url: "https://3.6.198.164.nip.io/dashboard",
            type: "GET",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            complete: () => {
            },
            success: (data, textStatus, xhr) => {
                if (data.status === 1) {
                    this.setState({apiStatus: 1});
                    this.setState({
                        user: {name: data.uname}, recentPolls: data.recentpolls
                    })
                } else if (data.status === -1) {
                    if (data.message === "unauthenticated") {
                        this.props.navigate('/signup')
                    }
                }
            },
            error: () => {
                this.setState({apiStatus: -1})
            }
        });
    }
    createOptions = (option, index, arr) => {
        index++;
        return (<div className="row" key={index}>
            <div className="col">
                <div className="d-flex justify-content-between">
                    <label className="form-label">{"Option: " + index}</label>
                    <i className={"fa fa-close d-flex align-items-center delete " + (index === 1 ? "visually-hidden" : "")}
                       onClick={() => {
                           let tArr = this.state.options;
                           tArr.splice(index - 1, 1);
                           this.setState({options: tArr})
                       }}/>
                </div>
                <input className="form-control" type="text" name={"option_" + index}
                       value={this.state.options[index - 1]}
                       autoFocus={(arr.length > 1 && arr.length === index)}
                       onChange={(e) => {
                           let mArr = this.state.options;
                           mArr[index - 1] = e.target.value;
                           this.setState({options: mArr, error: ""})
                       }}/>
            </div>
        </div>);
    }
    logout = () => {
        $.ajax(
            {
                url: "https://3.6.198.164.nip.io/dashboard",
                type: "PUT",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                complete: () => {

                },
                success: (data, textStatus, xhr) => {
                    this.props.navigate('/login')
                },
                error: () => {

                }
            }
        )
    }
    setRecentPolls = (poll, index, arr) => {
        const votesPercent = (votes, total) => {
            if (votes === 0 && total === 0) return 0
            else return votes / total * 100

        }
        return (<div className="card recents" key={index}>
            <div className="card-header d-flex justify-content-between">
                <h5 className="mb-0">{"Q: " + poll.question}</h5>
                <span>{!poll.expired ? <i className="fa fa-trash-o" onClick={() => {
                    this.setState({needsDelete: poll.link});
                    new Modal("#modal-2").show()
                }}/> : <p>expired</p>}</span>
            </div>
            <div className="card-body">
                {poll.options.map((opt, index, arr) => {
                    return <div className="d-flex justify-content-between" key={index}>
                        <p>{`Option${index + 1}: ${opt}`}</p>
                        <span className="show-votes">
                        {`${votesPercent(poll.votes[index], poll.totalvotes).toFixed(2)}% (${poll.votes[index] + " vote" + (poll.votes[index] > 1 ? "s" : "")})`}
                    </span>
                    </div>;
                })}
                {!poll.expired ? <div className="input-group">
                    <input className="form-control form-control" id="recentpoll-link" type="text" readOnly={true}
                           value={document.location.origin + "/poll/" + poll.link}/>
                    <span className="input-group-text" title="Copy"
                          onClick={() => {
                              navigator.clipboard.writeText($("#recentpoll-link").val());
                              new Toast("#toast-copy").show();
                          }}>
                                    <i className="fa fa-paperclip"/>
                                </span>
                </div> : <div/>}
            </div>
            <div className="card-footer d-flex justify-content-between">
                <p>{`Total: ${poll.totalvotes} votes`}</p>
                <p>{"Created On: " + poll.createdon}</p>
            </div>
        </div>);
    }

    addOptions = () => {
        if (this.state.options.length < 5) {
            let opts = this.state.options
            opts.push("")
            this.setState({options: opts})
        }
    }

    onCreatePoll = e => {
        e.preventDefault();
        if (this.state.question !== "" && this.state.options[0] !== "") {
            let opts = [];
            for (let i = 0; i < 5; i++) {
                if (this.state.options.length >= i + 1) opts.push(this.state.options[i])
                else opts.push(null)
            }
            $.ajax({
                url: "https://3.6.198.164.nip.io/dashboard",
                type: "POST",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {question: this.state.question, options: opts},
                complete: () => {
                    if (this.state.apiStatus === 1) {
                        if (this.state.apiData.status === 1) {
                            $("#poll-link").val(`${document.location.origin}/poll/${this.state.apiData.pollid}`)
                            new Modal(document.getElementById("modal-1")).show()
                            this.setState({question: "", options: [""]})
                            this.refreshRecentPolls();
                        }
                    }
                },
                success: (data, textStatus, xhr) => {
                    this.setState({apiStatus: 1, apiData: data});

                },
                error: () => {
                    this.setState({apiStatus: -1})
                }
            });
        } else {
            this.setState({error: "The poll must have a question and atleast one option."})
        }
    }

    deletePoll = () => {
        $.ajax(
            {
                url: "https://3.6.198.164.nip.io/dashboard/" + this.state.needsDelete,
                type: "DELETE",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                complete: () => {

                },
                success: (data, textStatus, xhr) => {
                    if (data.status === 1) {
                        this.refreshRecentPolls()
                        new Toast("#toast-delete").show()
                    }
                    console.clear();
                },
                error: () => {

                }
            }
        )
    }

    render() {
        let options = <div>
            {this.state.options.map(this.createOptions)}
        </div>;

        let recentPolls = <div className="d-flex flex-column align-items-center">
            {this.state.recentPolls.map(this.setRecentPolls)}
        </div>;

        return (<div className="dashboard h-100">
            <header className="">
                <img src={logo} alt="logo"/>
                <h1 className="text-center">DASHBOARD</h1>
            </header>
            <div className="col mx-auto">
                <div className="d-flex justify-content-between user">
                    <p className="d-inline-block"
                    >{"Welcome, " + (this.state.user.name?this.state.user.name:"")}</p>
                    <a className="logout" href="#" onClick={this.logout}>Logout</a>
                </div>
                <form noValidate={true}>
                    <h2 className="text-center">Create Poll</h2>
                    <div className="row">
                        <div className="col">
                            <label className="form-label"
                            >Question:</label>
                            <input
                                className="form-control" type="text" name="question" value={this.state.question}
                                onChange={e => this.setState({question: e.target.value, error: ""})}
                            />
                        </div>
                    </div>
                    <div className="divider"/>
                    {options}
                    <div className={"error " + (!this.state.error ? "visually-hidden" : "")}>
                        <p className="text-end text-danger">{this.state.error}</p>
                    </div>
                    <div className="row">
                        <div className="col text-end">
                            <button className="btn btn-primary add-btn" type="button"
                                    disabled={this.state.options.length >= 5}
                                    onClick={() => this.addOptions()}>Add Option<i className="fa fa-plus"/>
                            </button>
                        </div>
                    </div>
                    <div className="row btn-bar">
                        <div className="col d-flex justify-content-between">
                            <button className="btn btn-danger" type="button"
                                    onClick={() => this.setState({question: "", options: [""]})}>Reset
                            </button>
                            <button className="btn btn-success" type="submit"
                                    onClick={e => this.onCreatePoll(e)}>Create
                            </button>
                        </div>
                    </div>
                </form>
                <div className="divider"/>
                <h2 className={"text-center pb-4 " + (this.state.recentPolls.length === 0 ? "d-none" : "")}>Recent
                    Polls</h2>
            </div>
            {recentPolls}
            <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 11}}>
                <div id="toast-delete" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <i className="fa fa-check text-success" style={{paddingRight: "5px"}}/>
                        <strong className="me-auto">Done</strong>
                        <small>Just now</small>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast"
                                aria-label="Close"/>
                    </div>
                    <div className="toast-body">
                        Poll deleted Successfully..
                    </div>
                </div>
                <div id="toast-copy" className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <i className="fa fa-check text-success" style={{paddingRight: "5px"}}/>
                        <strong className="me-auto text-success">Copied</strong>
                        <small>Just now</small>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="toast"
                                aria-label="Close"/>
                    </div>
                    <div className="toast-body">
                        Link copied to clipboard..
                    </div>
                </div>
            </div>
            <div className="modal fade" role="dialog" tabIndex="-1" id="modal-1" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-success">Success</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"
                                    aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>The poll has been created successfully, it can be reached with the following link..</p>
                            <div className="input-group">
                                <input className="form-control form-control" type="text" readOnly={true}
                                       id="poll-link"/>
                                <span className="input-group-text" title="Copy"
                                      onClick={() => {
                                          navigator.clipboard.writeText($("#poll-link").val());
                                          new Toast("#toast-copy").show();
                                      }}>
                                    <i className="fa fa-paperclip"/>
                                </span>
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <button className="btn btn-success" type="button" onClick={() => {
                                document.location.href = `whatsapp://send?text=${$("#poll-link").val()}`
                            }}>Share<i className="fa fa-whatsapp"/>
                            </button>
                            <button className="btn btn-primary" type="button" data-bs-toggle="modal">OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" role="dialog" tabIndex="-1" id="modal-2" data-bs-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-danger">Delete</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"
                                    aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure to delete this poll?</p>
                            <div className="modal-footer">
                                <button className="btn btn-primary" type="button" data-bs-toggle="modal"
                                        onClick={() => delete this.state.needsDelete}>Cancel
                                </button>
                                <button className="btn btn-outline-danger" type="button" data-bs-toggle="modal"
                                        onClick={this.deletePoll}>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}


function Dashboard() {
    let navigate = useNavigate();
    return <Main navigate={navigate}/>;
}

export default Dashboard;