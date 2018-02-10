import { CommandCenter } from "./CommandCenter";

export const Commands = {
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
            
            const c = Commands[command[0]];

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
        parameterRequired: true,
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
            },
            {
                name: "github",
                description: "Returns Nick's GitHub page.",
                link: {
                    url: "https://github.com/Cryptacular/",
                    text: "github.com/Cryptacular/"
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
    },
    about: {
        description: ["Who is Nick Mertens? What's he like? Is he a robot?"],
        parameterRequired: false,
        parameters: [],
        execute: function() {
            const date = new Date();
            let currentAge = date.getFullYear() - 1989;
            currentAge -= date.getMonth() > 4 ? 0 : 1;
            return {
                success: true,
                response: [
                    `Nick is a ${currentAge}-year-old dude, born in The Netherlands but based in Auckland, New Zealand.`,
                    ` `,
                    `He's a Web Developer by day and a Designer, Illustrator and Entrepreneur by night.`,
                    ` `,
                    `In terms of front end development, he is proficient in JavaScript, HTML, CSS, Sass and LESS, ` +
                    `as well as frameworks like React, React Native, jQuery, Kendo UI and tools like TypeScript, ` +
                    `Node / NPM, Git, Jasmine, Karma and more.`,
                    ` `,
                    `In the backend development world, he's got experience with C#, .NET, Go and Python.`,
                    ` `,
                    `In his free time he loves to play video games, listen to metal and learn new skills.`
                ]
            };
        }
    },
    vi: {
        description: ["A text editor."],
        parameterRequired: false,
        parameters: [],
        disabled: false,
        execute: function() {
            const response = {
                success: true,
                response: this.disabled ? [
                    `VIM has been disabled for your safety!`
                ] : [
                    `Remember, :q! to quit...`,
                    `In fact, just to be sure, I'll just disable VIM ;)`
                ]
            };
            this.disabled = true;
            return response;
        }
    },
    vim: {
        description: ["A text editor."],
        parameterRequired: false,
        parameters: [],
        execute: function() {
            return Commands.vi.execute();
        }
    },
    sudo: {
        description: ["Run a command with super-user privileges."],
        parameterRequired: true,
        parameters: [],
        execute: function(parameter) {
            let response = CommandCenter.handleCommand(parameter[0]);
            response.response = ["SPECIAL SUPER USER RESPOSE: <3", ...response.response];
            return response;
        }
    },
    rm: {
        description: ["Delete some stuff."],
        parameterRequired: true,
        parameters: [
            {
                name: "-rf",
                description: "Deletes all the things. ALL. THE. THINGS."
            },
            {
                name: "soul",
                description: "Deletes Nick's soul. (Hint: already long gone!)"
            }
        ],
        execute: function(parameter) {
            return {
                success: false,
                response: [
                    "Yeah, nice try buddy!"
                ]
            };
        }
    },
    git: {
        description: ["Version control."],
        parameterRequired: true,
        parameters: [
            {
                name: "status",
                description: "Check the status of your repository.",
                response: [
                    "Changes to be committed:",
                    "    modified:   the-universe.js",
                    "    modified:   everything.js",
                    " ",
                    "Untracked files:",
                    "    src/components/ILikeYouAlready.js"
                ]
            },
        ],
        execute: function(parameter) {
            const p = parameter[0];
            const response = this.parameters.find((x) => x.name === p);

            if (response && response.response) {
                return {
                    success: true,
                    response: [...response.response]
                };
            } else {
                return {
                    success: false,
                    response: [`Could not find git ${p}.`]
                };
            }
        }
    }
}

export let AvailableCommands = [];
for (const c in Commands) {
    if (Commands.hasOwnProperty(c)) {
        const name = c.toString();
        AvailableCommands.push(name);
    }
}