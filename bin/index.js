const { Command } = require('commander')
const inquirer = require('inquirer')
const { version } = require('../package.json');
const { search, playUrl } = require('../lib')

const program = new Command();
program.version(version)
    .option('-c, --choice', 'browse search results for the correct video')
    .option('-v, --video', 'show the video along with the audio', false)
    .option('-q, --quality <quality>', 'select the quality to play the video/audio')
    .option('-l, --limit <number>', 'number of search elements to fetch', parseInt, 10)
    .option('-n, --no-gui', 'start video with no gui', false)
    .option('-u, --url <url>', 'play url')
    .option('-s, --save', 'save video/audio before playing')
    .usage("[options] <query|url>")
    .arguments("<query>")
    .description('search command', {
        query: "search query of the vid",
        url: "test"
    })
.action(async (query, options) => {
    const searchOptions = {limit: options.limit};

    if (options.choice) {
        searchOptions.selector = async items => {
            const {selection} = await inquirer.prompt([{
                type: "list",
                name: 'selection',
                message: 'select the title you want to play :',
                choices: items.map((e, i) => ({name: e.title, value: i})),
            }]);
            
            return selection;
        }
    }

    const result = await search(query, searchOptions);

    //*
    playUrl(result.url, { audioOnly: !options.video, GUI: options.gui }).then(res => {
        res.unref();
    })
    //*/
})

program.parse(process.argv);
