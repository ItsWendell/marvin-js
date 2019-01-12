

class MarvinModule {
    constructor() {
        this.name = null;
    }

    getName() {
        return this.name || 'Unnamed';
    }

    register = () => {
        throw new Error(`${this.getName()} doesn't have a register handle.`);
    }

    run = () => {
        throw new Error(`${this.getName()} doesn't have a run handle.`);
    }
}