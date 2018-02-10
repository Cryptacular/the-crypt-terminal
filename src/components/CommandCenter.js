import { Commands, AvailableCommands } from './Commands';

export const CommandCenter = {
    handleCommand: (input) => {
        input = (input && input.toLowerCase().trim()) || "";
        const inputs = input.split(" ");
        const command = inputs[0];
        const parameters = inputs.length > 1 ? inputs.slice(1, inputs.length) : null;

        if (!command || typeof(command) !== "string" || command.length === 0) {
            return { success: false, response: [`Please enter a valid command.`] };
        }

        const c = Commands[command];

        if (c !== undefined) {
            if (c.parameterRequired && !parameters) {
                return { success: false, response: [`Parameter required. Run \`help ${command}\` for more information.`]};
            }
            return (c.execute && c.execute(parameters)) || { success: false, response: ["Unknown error."] };
        }

        return { success: false, response: [`Sorry, I don't recognise the command '${command}'. Enter \`help\` for assistance.`] };
    },
    autoComplete: (text) => {
        if (!text || text.length === 0) {
            return "";
        }

        text = text.toLowerCase().trim();

        let textCommands = text.split(" ");
        let result = null;

        if (textCommands.length > 1) {
            const command = textCommands[0];
            const parameter = textCommands[textCommands.length - 1];

            if (command === "help" || command === "sudo") {
                result = AvailableCommands.find((c) => (c.startsWith(parameter)));
            } else if (Commands[command]) {
                const commandFound = Commands[command].parameters && Commands[command].parameters.find((c) => (c.name.startsWith(parameter)));
                result = commandFound && commandFound.name;
            }
        } else {
            result = AvailableCommands.find((c) => (c.startsWith(textCommands[textCommands.length - 1])));
        }

        if (result) {
            textCommands[textCommands.length - 1] = result + " ";
        }
        return textCommands.join(" ");
    },
    availableCommands: () => {
        return [...AvailableCommands];
    },
    availableParameters: (cmd) => {
        let commandToFind = (cmd && cmd.trim()) || "";

        if (!commandToFind || commandToFind.length === 0) {
            return [];
        }

        const multipleCommands = commandToFind.split(" ");
        if (multipleCommands.length > 1) {
            commandToFind = multipleCommands[0];
        }

        if (commandToFind === "help" || commandToFind === "sudo") {
            return [...AvailableCommands];
        } else if (commandToFind && Commands[commandToFind]) {
            const parameters = Commands[commandToFind].parameters;
            return parameters.map((p) => p.name);
        }
        
        return [];
    }
}
