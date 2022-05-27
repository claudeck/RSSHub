const got = require('@/utils/got');
const cheerio = require('cheerio');

const rootUrl = 'http://qingman5.com';

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const url = `${rootUrl}/${id}/`;

    const response = await got.get(url);
    const $ = cheerio.load(response.data);
    const comicTitle = $('div.Introduct > div > div.sub_r > h1').text();
    const list = $('div.chapterList.d-border > div.chapters > ul > li')
        .map((_, item) => {
            const title = $(item).find('a').text();
            const link = rootUrl + $(item).find('a').attr('href');
            const description = '<a href="' + link + '">' + title + '</a>';

            return {
                title,
                link,
                description,
            };
        })
        .get();

    ctx.state.data = {
        title: `酷漫屋-${comicTitle}`,
        link: url,
        item: list,
    };
};
