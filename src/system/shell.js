let spawn = require("child_process").spawn;

export function run(command, onStdout = null, onStderr = null) {
    return new Promise((resolve, reject) => {
        let [app, ...params] = command;

        let bat = spawn(app, params);

        bat.stdout.on("data", onStdout || (() => {}));

        bat.stderr.on("data", onStderr || (() => {}));

        bat.on("exit", (code) => {
            if (code === 0) {
                resolve(code);
            }

            reject(code);
        });
    });
}