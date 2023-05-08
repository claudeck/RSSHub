const got = require('@/utils/got');
const cheerio = require('cheerio');

const rootUrl = 'https://www.baozimh.com';

module.exports = async (ctx) => {
    const name = ctx.params.name;
    const url = `${rootUrl}/comic/${name}`;

    const response = await got.get(url);
    const $ = cheerio.load(response.data);
    const comicTitle = $('div > div.pure-u-1-1.pure-u-sm-2-3.pure-u-md-3-4 > div > h1').text();
    const list = $('#layout > div.comics-detail > div:nth-child(3) > div > div:nth-child(4) > div')
        .map((_, item) => {
            const title = $(item).find('span').text();
            let link = rootUrl + $(item).find('a').attr('href');

            // link = link.replace('www.baozimh.com', 'cn.baozimh.com');

            return {
                title,
                link,
                description: `<br/><br/><a href="${link}">点击跳转到站点观看漫画</a>`,
            };
        })
        .get();

    // const items = await Promise.all(
    //     list.map((item) =>
    //         ctx.cache.tryGet(item.link, async () => {
    //             const directUrlParams = new URLSearchParams(new URL(item.link).search);
    //             const comicId = directUrlParams.get('comic_id');
    //             const sectionSolt = directUrlParams.get('section_slot');
    //             const chapterSlot = directUrlParams.get('chapter_slot');
    //             const descUrl = `https://www.webmota.com/comic/chapter/${comicId}/${sectionSolt}_${chapterSlot}.html`;

    //             const detailResponse = await got.get(descUrl);
    //             const $ = cheerio.load(detailResponse.data);
    //             item.description = art(path.join(__dirname, 'templates/desc.art'), {
    //                 imgUrlList: $('ul.comic-contain')
    //                     .find('amp-img')
    //                     .map((_, item) => $(item).attr('src'))
    //                     .get(),
    //             });

    //             return item;
    //         })
    //     )
    // );

    ctx.state.data = {
        title: `包子漫画-${comicTitle}`,
        link: url,
        item: list,
    };
};
