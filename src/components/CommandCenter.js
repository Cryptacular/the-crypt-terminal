export const CommandCenter = {
    handleCommand: (input) => {
        input = input.toLowerCase().trim();
        const inputs = input.split(" ");
        const command = inputs[0];
        const parameters = inputs.length > 1 ? inputs.slice(1, inputs.length) : null;

        if (!command || typeof(command) !== "string" || command.length === 0) {
            return { success: false, response: [`Please enter a valid command.`] };
        }

        const c = commands[command];

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

            if (command === "help") {
                result = availableCommands.find((c) => (c.startsWith(parameter)));
            } else if (commands[command]) {
                const commandFound = commands[command].parameters && commands[command].parameters.find((c) => (c.name.startsWith(parameter)));
                result = commandFound && commandFound.name;
            }
        } else {
            result = availableCommands.find((c) => (c.startsWith(textCommands[textCommands.length - 1])));
        }

        if (result) {
            textCommands[textCommands.length - 1] = result + " ";
        }
        return textCommands.join(" ");
    }
}

const commands = {
    help: {
        description: [
            "You can run commands by typing the command name, followed by an optional parameter.",
            "For example, you can run `help contact` to find out more about the `contact` command."
        ],
        parameterRequired: false,
        parameters: [
            {
                name: "<command>",
                description: "Provides information about the provided command."
            }
        ],
        execute: function(command) {
            if (!command) {
                return {success: true, response: this.description };
            }
            
            const c = commands[command[0]];

            if (!c) {
                return {
                    success: false,
                    response: [`Could not find command ${command[0]}.`]
                };
            }

            const { description, parameterRequired, parameters } = c;
            let response = [
                `Command: ${command}`,
                " ",
                description
            ];
            if (parameters && parameters.length > 0) {
                response = [
                    ...response,
                    " ",
                    `Parameters${parameterRequired ? " - required" : ""}:`,
                    ...parameters.map((p, i) => `  ${p.name}: ${p.description}`)
                ];
            }

            return {
                success: true,
                response
            };
        }
    },
    contact: {
        description: ["Request contact details."],
        parameterRequired: false,
        parameters: [
            {
                name: "email",
                description: "Returns Nick's email address.",
                link: {
                    url: "mailto:nick@thecrypt.co.nz",
                    text: "nick@thecrypt.co.nz"
                }
            },
            {
                name: "twitter",
                description: "Returns Nick's Twitter account.",
                link: {
                    url: "https://twitter.com/Cryptacular",
                    text: "twitter.com@Cryptacular"
                }
            },
            {
                name: "medium",
                description: "Returns Nick's Medium page.",
                link: {
                    url: "https://medium.com/@Cryptacular",
                    text: "medium.com/@Cryptacular"
                }
            }
        ],
        execute: function(parameter) {
            if (!parameter) {
                return {success: true, response: [...this.description, ...this.parameters.map((v, i) => (
                    `  ${v.name}: ${v.description}`
                ))] };
            }
            
            const type = parameter[0];
            const response = this.parameters.find((x) => x.name === type);

            if (response && response.link) {
                const {text, url} = response.link;
                return {
                    success: true,
                    response: [{text, url}]
                };
            } else {
                return {
                    success: false,
                    response: [`Could not find ${type}.`]
                };
            }
        }
    }
}

const availableCommands = [];
for (const c in commands) {
    if (commands.hasOwnProperty(c)) {
        const name = c.toString();
        availableCommands.push(name);
    }
}
