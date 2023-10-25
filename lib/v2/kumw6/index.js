const got = require('@/utils/got');
const cheerio = require('cheerio');

const rootUrl = 'http://www.kumwu.com/';

module.exports = async (ctx) => {
    // const browser = await puppeteer();
    const id = ctx.params.id;
    const url = `${rootUrl}/${id}/`;

    const response = await got.get(url);
    const $ = cheerio.load(response.data);
    const comicTitle = $('div.banner_detail_form > div.info > h1').text();
    const list = $('.view-win-list > li')
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

    // const items = await Promise.all(
    //     list.map((item) =>
    //         ctx.cache.tryGet(
    //             item.link,
    //             async () => {
    //                 const page = await browser.newPage();
    //                 await page.goto(item.link);
    //                 const html = await page.evaluate(() => document.querySelector('div.main_img').innerHTML);

    //                 const $ = cheerio.load(html);

    //                 item.description = art(path.join(__dirname, 'templates/desc.art'), {
    //                     imgUrlList: $('img')
    //                         .map((_, item) => $(item).attr('src'))
    //                         .get(),
    //                 });

    //                 return item;
    //             },
    //             5184000
    //         )
    //     )
    // );

    // browser.close();

    ctx.state.data = {
        title: `酷漫屋-${comicTitle}`,
        link: url,
        item: list,
    };
};
