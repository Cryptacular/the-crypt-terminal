import { CommandCenter } from './CommandCenter';

it('exists', () => {
    expect(CommandCenter).toBeDefined();
});

describe('handleCommand', () => {
    it('returns `success: false` when input is undefined', () => {
        const response = CommandCenter.handleCommand(undefined);
        expect(response.success).toEqual(false);
    });
    
    it('returns `success: false` when input is null', () => {
        const response = CommandCenter.handleCommand(null);
        expect(response.success).toEqual(false);
    });

    it('returns `success: false` when input is empty string', () => {
        const response = CommandCenter.handleCommand("");
        expect(response.success).toEqual(false);
    });

    it('returns `success: false` when input is non-existent command', () => {
        const response = CommandCenter.handleCommand("Deadpool would like to talk to you");
        expect(response.success).toEqual(false);
    });

    it('returns `success: true` when input is valid command', () => {
        const response = CommandCenter.handleCommand("help");
        expect(response.success).toEqual(true);
    });

    it('returns `success: true` when input is valid command with trailing white space', () => {
        const response = CommandCenter.handleCommand("help      ");
        expect(response.success).toEqual(true);
    });

    it('returns `success: true` when input has uppercase characters', () => {
        const response = CommandCenter.handleCommand("hELp");
        expect(response.success).toEqual(true);
    });
});

describe('autoComplete', () => {
    it('returns empty string when input is undefined', () => {
        const response = CommandCenter.autoComplete(undefined);
        expect(response).toEqual("");
    });
    
    it('returns empty string when input is null', () => {
        const response = CommandCenter.autoComplete(null);
        expect(response).toEqual("");
    });

    it('returns empty string when input is empty string', () => {
        const response = CommandCenter.autoComplete("");
        expect(response).toEqual("");
    });

    it('returns input string when input does not match command', () => {
        const response = CommandCenter.autoComplete("not-a-valid-command");
        expect(response).toEqual("not-a-valid-command");
    });

    it('returns matched command and trailing space when input matches command', () => {
        const response = CommandCenter.autoComplete("help");
        expect(response).toEqual("help ");
    });

    it('returns matched command and trailing space when input matches beginning of command', () => {
        const response = CommandCenter.autoComplete("he");
        expect(response).toEqual("help ");
    });

    it('returns matched command and parameter when input matches command and valid parameter', () => {
        const response = CommandCenter.autoComplete("help contact");
        expect(response).toEqual("help contact ");
    });

    it('returns matched command and parameter when input matches command and beginning of valid parameter', () => {
        const response = CommandCenter.autoComplete("help con");
        expect(response).toEqual("help contact ");
    });
});

describe('availableCommands', () => {
    it('returns list of available commands', () => {
        const expected = ['help', 'contact'];
        const availableCommands = CommandCenter.availableCommands();
        expect(availableCommands).toEqual(expect.arrayContaining(expected));
    });
});

describe('availableParameters', () => {
    it('returns empty array when input is undefined', () => {
        const availableParameters = CommandCenter.availableParameters(undefined);
        expect(availableParameters).toEqual([]);
    });

    it('returns empty array when input is null', () => {
        const availableParameters = CommandCenter.availableParameters(null);
        expect(availableParameters).toEqual([]);
    });

    it('returns empty array when input is empty string', () => {
        const availableParameters = CommandCenter.availableParameters("");
        expect(availableParameters).toEqual([]);
    });

    it('returns empty array when input does not match command', () => {
        const availableParameters = CommandCenter.availableParameters("not-a-valid-command");
        expect(availableParameters).toEqual([]);
    });

    it('returns array of parameters when input matches valid command', () => {
        const expected = ['email', 'twitter', 'medium'];
        const availableParameters = CommandCenter.availableParameters("contact");
        expect(availableParameters).toEqual(expect.arrayContaining(expected));
    });
});
