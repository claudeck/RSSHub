const got = require('@/utils/got');
const cheerio = require('cheerio');

const rootUrl = 'https://www.colamanga.com';

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const url = `${rootUrl}/${id}`;

    const response = await got.post('http://xmapp03:8191/v1', {
        headers: {
          'Content-Type': 'application/json',
        },
        json: {
          cmd: 'request.get',
          url: url,
          maxTimeout: 60000,
        }
    });
  
    const responseBody = JSON.parse(response.body);
    const solutionResponse = responseBody?.solution?.response; // Extract .solution.response

    const $ = cheerio.load(solutionResponse);
    const comicTitle = $('h1.fed-part-eone').text();
    const list = $('.all_data_list > .fed-part-rows > li')
        .map((_, item) => {
            const title = $(item).find('a').text();
            const link = rootUrl + $(item).find('a').attr('href');

            return {
                title,
                link,
                description: `<br/><br/><a href="${link}">点击跳转到站点观看漫画</a>`,
            };
        })
        .get();

    ctx.state.data = {
        title: `考拉漫画-${comicTitle}`,
        link: url,
        item: list,
    };
};
