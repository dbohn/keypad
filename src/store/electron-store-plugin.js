import ButtonConfiguration from '../keypad/ButtonConfiguration';

export default function createElectronStorePlugin(configKey = 'actions') {
    const storage = window.electronStore;

    return store => {
        const config = storage.get(configKey, null);

        if (config !== null) {
            store.commit('setKeypadActions', {actions: ButtonConfiguration.fromStorage(config)});
        }

        store.subscribe((mutation, state) => {
            if (mutation.type === 'setKeypadAction' || mutation.type === 'setKeypadActions') {
                storage.set(configKey, state.keypad.actions);
            }
        });
    };
}