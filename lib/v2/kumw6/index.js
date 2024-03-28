const got = require('@/utils/got');
const cheerio = require('cheerio');

const rootUrl = 'http://m.kumwu2.com';

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const url = `${rootUrl}/${id}/`;

    const response = await got.get(url);
    const $ = cheerio.load(response.data);
    const comicTitle = $('div.Introduct > div > div.sub_r > h1').text();
    const list = $('div.chapters > ul > li')
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
        title: `酷漫屋-${comicTitle}`,
        link: url,
        item: list,
    };
};
