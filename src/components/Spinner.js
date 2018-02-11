import React, { Component } from 'react';

export class Spinner extends Component {
    constructor() {
        super();
        this.state = {
            i: 0
        };
    }

    content = ["/", "-", "\\", "|"];

    componentDidMount() {
        this.animation = setInterval(() => {
            this.setState({
                i: this.state.i + 1
            });
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this.animation);
    }

    render() {
        const { isLoading } = this.props;
        const { i } = this.state;
        const { content } = this;

        return (isLoading ? <span>{content[i % content.length]}</span> : <span />);
    }
}
