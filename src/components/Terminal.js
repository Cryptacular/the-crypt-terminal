import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { CommandCenter } from './CommandCenter';
import { Suggestions } from './Suggestions';
import { Spinner } from './Spinner';
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
            input: "",
            history: {
                position: -1,
                list: []
            },
            loading: false
        };

        this.submit = this.submit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBodyClick = this.handleBodyClick.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleTab = this.handleTab.bind(this);
        this.handleHistoryShift = this.handleHistoryShift.bind(this);
        this.handleSuggestionCommandClick = this.handleSuggestionCommandClick.bind(this);
        this.handleSuggestionParameterClick = this.handleSuggestionParameterClick.bind(this);
        this.addOutput = this.addOutput.bind(this);
        this.parseLink = this.parseLink.bind(this);
        this.printResponse = this.printResponse.bind(this);

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
                        <Spinner isLoading={this.state.loading} />
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
                        <span className="terminal-submit" onClick={this.submit}>Go</span>
                    </div>
                </div>
                <div className="terminal-suggestions">
                    <Suggestions currentInput={this.state.input} onCommandClick={this.handleSuggestionCommandClick} onParameterClick={this.handleSuggestionParameterClick} />
                </div>
            </div>
        );
    }

    componentDidUpdate() {
        const terminalBody = document.getElementById("terminalBody");
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    submit() {
        const { input } = this.state;

        ReactGA.event({
            category: 'Command',
            action: input,
        });

        const { success, response } = CommandCenter.handleCommand(input);
        
        if (response.toString() === "[object Promise]") {
            const term = this;
            this.setState({
                input: "",
                loading: true
            });
            response.then(function(res) {
                return res.json();
            })
            .then(function(posts) {
                const postsToAdd = posts[0].item.map(p => (p.category ? {text: p.title[0], url: p.link[0]} : ""));
                term.printResponse(input, success, postsToAdd);
            });
        } else {
            this.printResponse(input, success, response);
        }
    }

    printResponse(currentCommand, success, response) {
        let outputToAdd = [{text: currentCommand, type: "command"}, ...response.map(r => ({text: this.parseLink(r), type: success ? "info" : "error"}))];
        
        const output = this.addOutput(outputToAdd);

        let history = {...this.state.history};
        history.list.unshift(currentCommand.trim());
        history.position = -1;

        this.setState({
            input: "",
            output,
            loading: false,
            history
        });
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
                this.handleTab();
                break;
            case "ArrowUp":
                e.preventDefault();
                this.handleHistoryShift(1);
                break;
            case "ArrowDown":
                this.handleHistoryShift(-1);
                break;
            default:
                break;
        }
    }

    handleEnter() {
        this.submit();
    }

    handleTab() {
        this.setState({ input: CommandCenter.autoComplete(this.state.input) });
    }

    handleHistoryShift(change) {
        const { history } = this.state;
        history.position += change;

        if (history.position < -1) {
            history.position = -1;
        } else if (history.position >= history.list.length) {
            history.position = history.list.length - 1;
        }

        if (history.list.length === 0 || history.position < 0) {
            this.setState({
                input: ""
            });
        }

        const newInput = history.list[history.position];
        newInput && this.setState({
            input: newInput
        });
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

    addOutput(arr) {
        let output = [...this.state.output];
        output = [...output, ...arr]
        return output;
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