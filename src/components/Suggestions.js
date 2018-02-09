import React from 'react';
import { CommandCenter } from './CommandCenter';
import { Suggestion } from './Suggestion';
import { SuggestionTypes } from './SuggestionTypes';

export const Suggestions = (props) => {
    const { currentInput, onParameterClick, onCommandClick } = props;

    const availableParameters = CommandCenter.availableParameters(currentInput);
    const availableCommands = CommandCenter.availableCommands();

    const parameters = availableParameters.map((c, i) => <Suggestion command={c} type={SuggestionTypes.parameter} onClick={onParameterClick} key={`param-${c}-${i}`} />);
    const commands = availableCommands.map((c, i) => <Suggestion command={c} type={SuggestionTypes.command} onClick={onCommandClick} key={`cmd-${c}-${i}`} />);

    return [...parameters, ...commands];
};
