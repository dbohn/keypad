module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                buildDependenciesFromSource: true,
            },
            externals: ['serialport', 'keytar'],
            preload: 'src/preload.js',
        }
    }
}