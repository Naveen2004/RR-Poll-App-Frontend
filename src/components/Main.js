import React from "react";
import $ from 'jquery';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                question: props.data.question, options: props.data.options
            }, checked: false, selectedOption: null, isValid: true
        };
    }

    option_element = (option, index, arr) => {
        return (<div
            className={"border border-3 options-wrapper " + (this.state.selectedOption === index ? "border-black" : "border-transparent")}
            onClick={this.onOptionClick}
            key={index}>
            <div className="d-flex align-items-center form-check">
                <input className="form-check-input" type="radio" name="option" value={option}
                       checked={this.state.selectedOption === index}
                       onChange={() => this.setState({selectedOption: index})}
                       radioGroup="options" id={"option_" + (index + 1)}/>
                <label className="form-check-label" htmlFor={"option_" + (index + 1)}>{option}</label>
            </div>
        </div>);
    }

    onOptionClick = (e) => {
        let el = $(e.target);
        let inp_radio = el.children().is('input') ? el.children('input') : el.children('div').children('input');

        this.setState({selectedOption: this.state.data.options.indexOf(inp_radio.attr('value'))});
    }

    onClearClick = () => {
        this.setState({selectedOption: null, isValid: true})
    }

    onSubmitClick = () => {
        if (this.state.selectedOption !== null) {
            this.setState({validate: true})
        } else {
            this.setState({isValid: false})
        }
    }

    render() {
        let options_list = <form id="main-form" noValidate={true}>
            {this.state.data.options.map(this.option_element)}
        </form>;

        return (<div className="container flex-column flex-nowrap h-100 d-flex justify-content-center main">
            <div className="row align-self-center w-100 box">
                <div className="col">
                    <p className="question">{this.state.data.question}</p>
                    {options_list}
                    <div
                        className={"error-msg " + (!this.state.isValid && !isNaN(this.state.selectedOption)? "d-block" : "d-none")}>Check
                        out the field..
                    </div>
                    <div className="d-flex justify-content-between button-group">
                        <button className="btn btn-outline-primary btn-lg negative" type="button"
                                onClick={(e) => this.onClearClick(e)}>Clear
                        </button>
                        <button className="btn btn-primary btn-lg positive" type="button"
                                onClick={(e) => this.onSubmitClick(e)}>
                            <span>Submit</span></button>
                    </div>
                </div>
            </div>
        </div>);
    }

}

export default Main;