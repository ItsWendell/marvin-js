import { VM } from 'vm2';
import axios from 'axios';
import AppContext from './context';

export function runScriptContext(code, message = {}) {
  const appContext = new AppContext(message);
  const timeout = 5000; // Timeout in milliseconds
  const vm = new VM({
    sandbox: {
      ...appContext,
      axios: axios.create({
        // Auto timeout after 5 seconds.
        timeout
      })
    },
    timeout
  });

  try {
    vm.run(code);
  } catch (error) {
    appContext.sendMessage(`Code seems to be broken: ${error.message}`);
    console.log(`[VM] Code seems to be broken: ${error.message}`);
  }
}
