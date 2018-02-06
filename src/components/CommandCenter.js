export const CommandCenter = {
    handleCommand: (command) => {
        if (!command || typeof(command) !== "string" || command.length === 0) {
            return { success: false };
        }

        if (commands[command] !== undefined) {
            const response = commands[command]();
            return { success: true, response };
        }

        return { success: false };
    }
}

const commands = {
    help: () => {
        return [
            "You can run commands by typing the command name, followed by an optional parameter.",
            "For example, you can run `help contact` to find out more about the `contact` command."
        ];
    }
}
