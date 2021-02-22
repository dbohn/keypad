const cache = {};

function importAll(r) {
    r.keys().forEach((key) => {
        const actionName = key
            .split('/')
            .pop()
            .replace(/\.\w+$/, '');
        const componentConfig = r(key);
        cache[actionName] = componentConfig.default || componentConfig;
    });
}

importAll(require.context('./actions', false, /\.js$/));

export default cache;