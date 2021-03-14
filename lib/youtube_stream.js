const ytdl = require('ytdl-core')

/**
 * @description default stream selection: select the first stream of each category
 * 
 * @param {ytdl.videoFormat[]} audio 
 * @param {ytdl.videoFormat[]} video
 * 
 * @returns Object
 */
function default_selection(audio, video) {
    audio = audio[0] || undefined;
    video = video[0] || undefined;
    return {audio, video};
}

async function fetchStream(url, audioOnly = false, selection_predicate = default_selection) {
    console.log("waiting for getInfo...");
    const ytInfo = await ytdl.getInfo(url);
    console.log("getInfo done.")
    const { author, title } = ytInfo.videoDetails;

    let streams = ytInfo.formats;
    
    if (audioOnly)
        streams = ytInfo.formats.filter(e => !e.hasVideo);
    
    const video = streams.filter(e => e.hasVideo);
    const audio = streams.filter(e => e.hasAudio);

    return { author, title, ...selection_predicate(audio, video) }
}

module.exports = { fetchStream, default_selection };