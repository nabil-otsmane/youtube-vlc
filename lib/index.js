const { fetchStream, default_selection } = require('./youtube_stream')
const { spawn } = require('child_process')
const search = require('./youtube_search')

const default_options = { audioOnly: true, selection: default_selection, player: VlcPlayer, GUI: true};

async function playUrl(url, options = default_options) {
    // TODO: case when url is a playlist to be done later

    options = {...default_options, ...options};
    const stream = await fetchStream(url, options.audioOnly, options.selection);
    return options.player(stream, options.GUI);
}

async function VlcPlayer(stream, GUI = true) {
    let vlc = 'vlc';
    if (!GUI)
        vlc = 'c' + vlc;

    let options = [
        '--play-and-exit', '--one-instance',
        '--no-qt-name-in-title', '--no-video-title-show',
        '--playlist-enqueue'
    ];

    if (stream.video === undefined)
        options.push(stream.audio.url)
    else {
        options.push(`--input-slave=${stream.audio.url}`)
        options.push(stream.video.url)
    }
    console.log("waiting for vlc to launch...");
    return spawn(vlc, options, { detached: true, stdio: 'ignore' })
}

module.exports = { playUrl, VlcPlayer, search };