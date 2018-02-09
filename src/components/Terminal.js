import React, { Component } from 'react';
import { CommandCenter } from './CommandCenter';
import { Suggestions } from './Suggestions';
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
        this.handleSuggestionCommandClick = this.handleSuggestionCommandClick.bind(this);
        this.handleSuggestionParameterClick = this.handleSuggestionParameterClick.bind(this);

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
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
                    <div className="terminal-outputs">
                        {this.state.output.map((o, i) => (
                            <div className={`terminal-output terminal-output--${o.type}`} key={`terminal-output--${i}`}>{o.text}</div>
                        ))}
                    </div>
                    <div className="terminal-inputs">
                        <span className="terminal-currentLine">&gt;&nbsp;</span>
                        <span className="terminal-formattedInput">{this.state.input}</span>
                        <input
                            value={this.state.input}
                            onChange={this.handleInputChange}
                            type="text" className="terminal-input"
                            id="terminalInput"
                            placeholder="Enter commands here"
                            autoFocus
                            ref={(input) => { this.textInput = input; }}
                        />
                        <span className="terminal-cursor" />
                    </div>
                </div>
                <div className="terminal-suggestions">
                    <Suggestions currentInput={this.state.input} onCommandClick={this.handleSuggestionCommandClick} onParameterClick={this.handleSuggestionParameterClick} />
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

    handleKeyDown(e) {
        switch (e.code) {
            case "Enter":
                this.handleEnter();
                break;
            case "Tab":
                e.preventDefault();
                this.setState({ input: CommandCenter.autoComplete(this.state.input) });
                break;
            default:
                break;
        }
    }

    handleEnter() {
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

    handleSuggestionCommandClick(command) {
        this.setState({
            input: command + " "
        });
        this.textInput.focus();
    }

    handleSuggestionParameterClick(parameter) {
        const currentInput = this.state.input.trim();

        this.setState({
            input: `${currentInput} ${parameter} `
        });

        this.textInput.focus();
    }

    addOutput(text, type) {
        text = this.parseLink(text);
        let output = [...this.state.output];
        output.push({
            text,
            type
        });
        this.setState({
            output
        });
    }

    parseLink(link) {
        if (typeof(link) === "string") {
            return link;
        }

        if (link.text && link.url) {
            return <a href={link.url} target="_blank">{link.text}</a>
        }

        return link;
    }
}