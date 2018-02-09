import React from 'react';
import './Suggestion.css';

export const Suggestion = (props) => (
    <span className={`terminalSuggestions-suggestion terminalSuggestions-suggestion--${props.type}`} onClick={() => props.onClick(props.command)}>{props.command}</span>
);
