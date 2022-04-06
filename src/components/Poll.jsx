import React from "react";
import '../css/Poll.css';
import '../css/Poll_bs.scss';
import {useParams} from "react-router-dom";
import $ from "jquery";
import poll404 from '../assets/poll404.png';
import kallaVote from '../assets/kallaVote.jpg';

const Header = () => {
    return (<header>
        <h1 className="text-center">RR Polls</h1>
    </header>);
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                question: "", options: []
            }, checked: false, selectedOption: null, isValid: true, result: false, notFound: false, kallaVote: false
        };
    }

    componentDidMount() {
        let x = JSON.parse(localStorage.getItem("voted"))
        let secondAttempt = false
        if (x !== null) secondAttempt = x.includes(this.props.pollId)

        $.ajax({
            url: "https://rr-polls.herokuapp.com/poll/" + this.props.pollId, type: "GET", crossDomain: true, xhrFields: {
                withCredentials: true
            }, complete: () => {
            }, success: (data, textStatus, xhr) => {
                if (data.status === 1) {
                    this.setState({apiStatus: 1, data: data.data, kallaVote: secondAttempt});

                } else if (data.status === -1) {
                    this.setState({notFound: true})
                }
            }, error: () => {
                this.setState({apiStatus: -1})
            }
        });

    }

    option_element = (option, index, arr) => {
        return (<div
            className={"border border-3 position-relative options-wrapper " + (this.state.selectedOption === index ? "border-black" : "border-white ")}
            style={{backgroundColor: this.state.result ? "#44444431" : ""}}
            onClick={this.onOptionClick}
            key={index}>
            <div className="d-block position-absolute votes" style={{
                width: this.state.result ? `calc(${(this.state.votings[index] / this.state.totalVotes * 100)}% + 1px)` : "",
                background: this.state.result ? "linear-gradient(-45deg, #4743EF -40%, #C020D0 140%)" : "",
                borderRadius: this.state.result ? ((this.state.votings[index] / this.state.totalVotes * 100) > 98 ? "7px" : "7px 2px 2px 7px") : ""
            }}><span/></div>
            <div className="d-flex align-items-center form-check justify-content-between position-relative"
                 style={{color: this.state.result ? "white" : "black"}}
                 onClick={() => {
                 }}>
                <div>
                    <input className="form-check-input" type="radio" name="option" value={option}
                           disabled={this.state.result}
                           checked={this.state.selectedOption === index}
                           onChange={() => this.setState({selectedOption: index})}
                           radioGroup="options" id={"option_" + (index + 1)}/>
                    <label className="form-check-label"
                           style={{textShadow: this.state.result ? "1px 1px 1px #000000cc" : "initial"}}
                           htmlFor={"option_" + (index + 1)}>{option}</label>
                </div>
                <span
                    className={"d-block " + (!this.state.result ? "visually-hidden" : "")}
                    style={{textShadow: this.state.result ? "1px 1px 2px #000000cc, 1px -1px 4px #00000033" : "initial"}}>{this.state.result ? (`${Math.round(this.state.votings[index] / this.state.totalVotes * 100)}%`) : ""}</span>
            </div>
        </div>);
    }

    onOptionClick = (e) => {
        if (!this.state.result) {
            let el = $(e.target);
            let inp_radio = el.children().children().is('input') ? el.children('div').children('input') : el.children('div').children('div').children('input');
            this.setState({selectedOption: this.state.data.options.indexOf(inp_radio.attr('value'))});
        }
    }

    onClearClick = () => {
        this.setState({selectedOption: null, isValid: true})
    }

    onSubmitClick = () => {
        if (this.state.selectedOption !== null) {
            this.setState({isValid: true});
        } else {
            this.setState({isValid: false});
            return
        }
        $.ajax({
            url: "https://rr-polls.herokuapp.com/poll/" + this.props.pollId, type: "POST", crossDomain: true, xhrFields: {
                withCredentials: true
            }, data: {"voted": this.state.data.options[this.state.selectedOption]}, complete: () => {
                this.setState({result: true})
            }, success: (data, textStatus, xhr) => {
                this.setState({apiStatus: 1, votings: data.votes, totalVotes: data.totalvotes});
                let x = JSON.parse(localStorage.getItem("voted"))
                if (x === null) x = [this.props.pollId]; else x.push(this.props.pollId)
                localStorage.setItem("voted", JSON.stringify(x))
            }, error: () => {
                this.setState({apiStatus: -1})
            }
        });
    }

    render() {
        let options_list = <form id="main-form" noValidate={true}>
            {this.state.data.options.map(this.option_element)}
        </form>;

        return (<div className="container flex-column flex-nowrap d-flex justify-content-center main">
            <div className="row align-self-center w-100 box">
                {this.state.notFound ? <Poll404/> : (this.state.kallaVote ? <KallaVote/> : (this.state.apiStatus === 1 ?
                    <div className="col">
                        <p className="question">{this.state.data.question}</p>
                        {options_list}
                        <div
                            className={"error-msg " + (!this.state.isValid && !isNaN(this.state.selectedOption) ? "d-block" : "d-none")}>Check
                            out the field..
                        </div>
                        <div
                            className={"d-flex justify-content-between button-group " + (this.state.result ? "visually-hidden" : "")}>
                            <button className="btn btn-outline-primary btn-lg negative" type="button"
                                    disabled={this.state.result}
                                    onClick={(e) => this.onClearClick(e)}>Clear
                            </button>
                            <button className="btn btn-primary btn-lg positive" type="submit"
                                    disabled={this.state.result}
                                    onClick={(e) => this.onSubmitClick(e)}>
                                <span>Submit</span></button>
                        </div>
                        <div
                            className={"vote-thank d-flex align-items-center justify-content-center " + (this.state.result ? "" : "visually-hidden")}>
                            <p>Thanks for your vote!</p>
                        </div>
                    </div> : <div/>))}
            </div>
            <div className="bottom-0 end-0 footer">
                <span>{!(this.state.notFound || this.state.kallaVote || !this.state.data.user) ? `Created by - ${this.state.data.user}` : ""}</span>
            </div>
        </div>);
    }

}

const Poll404 = () => {
    return <div className="col nf-404">
        <div className="text-center">
            <h1>404</h1>
            <img className="rounded-3" src={poll404} alt="404"/>
            <p>The Poll you looking for, is either expired or not found..</p>
        </div>
    </div>;
}
const KallaVote = () => {
    return <div className="col nf-404">
        <div className="text-center">
            <h1>Kalla Vote</h1>
            <img className="rounded-3" src={kallaVote} alt="404"/>
            <p>Kalla Vote potina kambi enna vendiyurkum..</p>
        </div>
    </div>;
}

const Poll = () => {
    let {pollId} = useParams();

    return (<div className="d-flex flex-column h-100 poll-bg poll">
        <Header/>
        <Main pollId={pollId}/>
    </div>);
}

export default Poll;