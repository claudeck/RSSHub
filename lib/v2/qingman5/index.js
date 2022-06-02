const got = require('@/utils/got');
const cheerio = require('cheerio');
const puppeteer = require('@/utils/puppeteer');
const { art } = require('@/utils/render');
const path = require('path');

const rootUrl = 'http://qingman5.com';

module.exports = async (ctx) => {
    const browser = await puppeteer();
    const id = ctx.params.id;
    const url = `${rootUrl}/${id}/`;

    const response = await got.get(url);
    const $ = cheerio.load(response.data);
    const comicTitle = $('div.Introduct > div > div.sub_r > h1').text();
    const list = $('div.chapterList.d-border > div.chapters > ul > li')
        .map((_, item) => {
            const title = $(item).find('a').text();
            const link = rootUrl + $(item).find('a').attr('href');

            return {
                title,
                link,
            };
        })
        .get();

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(
                item.link,
                async () => {
                    const page = await browser.newPage();
                    await page.goto(item.link);
                    const html = await page.evaluate(() => document.querySelector('div.readerContainer').innerHTML);

                    const $ = cheerio.load(html);

                    item.description = art(path.join(__dirname, 'templates/desc.art'), {
                        imgUrlList: $('img.lazy')
                            .map((_, item) => $(item).attr('data-original'))
                            .get(),
                    });

                    return item;
                },
                5184000
            )
        )
    );

    browser.close();

    ctx.state.data = {
        title: `酷漫屋-${comicTitle}`,
        link: url,
        item: items,
    };
};
