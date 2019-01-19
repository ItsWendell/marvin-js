import { VM, VMScript } from 'vm2';
import AppContext from './context';
import axios from 'axios';

export function runScriptContext(code, message = {}) {
    const appContext = new AppContext(message);

    const vm = new VM({
        sandbox: {
            ...appContext,
            axios: axios.create({
                // Auto timeout after 30 seconds.
                timeout: 30000
            }),
        }
    });

    try {
        vm.run(code);
    } catch (error) {
        appContext.sendMessage(`Code seems to be broken: ${error.message}`);
        console.log(`[VM] Code seems to be broken: ${error.message}`);
    }
}
