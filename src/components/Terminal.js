import React, { Component } from 'react';
import { CommandCenter } from './CommandCenter';
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
                    text: "For help with commands, e.g. contact, type `help contact`",
                    type: "info"
                }
            ],
            input: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBodyClick = this.handleBodyClick.bind(this);

        document.addEventListener("keydown", this.handleEnter.bind(this));
    }

    render() {
        return (
            <div className="terminal">
                <div className="terminal-controls">
                    <span className="terminalControls-control" />
                    <span className="terminalControls-control" />
                    <span className="terminalControls-control" />
                </div>
                <div className="terminal-body" onClick={this.handleBodyClick} id="terminalBody">
                    {this.state.output.map((o, i) => (
                        <div className={`terminal-output terminal-output--${o.type}`} key={`terminal-output--${i}`}>{o.text}</div>
                    ))}
                    <div>
                        <span className="terminal-currentLine">&gt;&nbsp;</span>
                        <span>{this.state.input}</span>
                        <input
                            value={this.state.input}
                            onChange={this.handleInputChange}
                            type="text" className="terminal-input"
                            id="terminalInput"
                            autoFocus
                            ref={(input) => { this.textInput = input; }}
                        />
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

    handleEnter(e) {
        if (e.code !== "Enter") {
            return;
        }

        const { input } = this.state;
        this.addOutput(input, "command");

        const { success, response } = CommandCenter.handleCommand(input);
        if (!success) {
            this.addOutput(response, "error");
        } else if (response) {
            response.forEach(r => {
                this.addOutput(r, "info");
            });
        }

        this.setState({
            input: ""
        });

        const terminalBody = document.getElementById("terminalBody");
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    addOutput(text, type) {
        let output = [...this.state.output];
        output.push({
            text,
            type
        });
        this.setState({
            output
        });
    }
}