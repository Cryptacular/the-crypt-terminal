export const CommandCenter = {
    handleCommand: (input) => {
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
            return c.execute && c.execute(parameters) || { success: false, response: ["Unknown error."] };
        }

        return { success: false, response: [`Sorry, I don't recognise the command '${command}'. Enter \`help\` for assistance.`] };
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
                description: "Returns Nick's email address."
            }
        ]
    }
}
