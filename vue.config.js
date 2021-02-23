module.exports = {
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport', 'keytar'],
            preload: 'src/preload.js',
        }
    }
}