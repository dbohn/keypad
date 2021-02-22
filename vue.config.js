module.exports = {
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport'],
            preload: 'src/preload.js',
        }
    }
}