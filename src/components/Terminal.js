import React, { Component } from 'react';
import AutosizeInput from 'react-input-autosize';
import './Terminal.css';

export class Terminal extends Component {
    constructor() {
        super();
        this.state = {
            output: [
                {
                    text: "Welcome to The Crypt",
                    type: "info"
                },
                {
                    text: "Enter your command below. Type `help` for, well, help!",
                    type: "info"
                },
                {
                    text: "For help with commands, e.g. contact, type `contact --help",
                    type: "info"
                }
            ],
            input: "help"
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBodyClick = this.handleBodyClick.bind(this);
    }

    render() {
        return (
            <div className="terminal">
                <div className="terminal-controls">
                    <span className="terminalControls-control" />
                    <span className="terminalControls-control" />
                    <span className="terminalControls-control" />
                </div>
                <div className="terminal-body" onClick={this.handleBodyClick}>
                    {this.state.output.map((o, i) => (
                        <div className={`terminal-output terminal-output--${o.type}`} key={`terminal-output--${i}`}>{o.text}</div>
                    ))}
                    <div>
                        <span className="terminal-currentLine">&gt;&nbsp;</span>
                        <AutosizeInput value={this.state.input} onChange={this.handleInputChange} type="text" className="terminal-input" id="terminalInput" autoFocus ref={(input) => { this.textInput = input; }} />
                        <span className="terminal-cursor" />
                    </div>
                </div>
                <div className="terminal-suggestions">
                    <span className="terminalSuggestions-suggestion">help</span>
                </div>
            </div>
        );
    }

    handleInputChange(e) {
        this.setState({
            input: e.target.value
        });
    }

    handleBodyClick() {
        this.textInput.focus();
    }
}