const got = require('@/utils/got');
const cheerio = require('cheerio');
const baoziColaMappings = require('./baozicola');
const offSetMappings = require('./offset');

const rootUrl = 'https://www.baozimh.com';

module.exports = async (ctx) => {
    const name = ctx.params.name;
    const url = `${rootUrl}/comic/${name}`;

    const response = await got(url, {
        https: {
            rejectUnauthorized: false,
        },
    });

    const $ = cheerio.load(response.data);
    const comicTitle = $('div > div.pure-u-1-1.pure-u-sm-2-3.pure-u-md-3-4 > div > h1').text();
    const list = [];
    $('#layout > div.comics-detail > div:nth-child(3) > div > div:nth-child(2) > div')
        .toArray()
        .forEach((item, index) => {
            const offset = offSetMappings[name];
            if (offset && index < offset) {
                return;
            }

            const title = $(item).find('span').text();
            const link = 'https://www.baozimh.com' + $(item).find('a').attr('href');
            // link = link.replace('www.baozimh.com', 'cn.baozimh.com');
            const mappingFun = baoziColaMappings[name];
            if (mappingFun) {
                const parsedLink = new URL(link);
                const chapterSlot = parseInt(parsedLink.searchParams.get('chapter_slot'), 10);
                const colaLink = mappingFun(chapterSlot);
                list.push({
                    title,
                    link,
                    description: `<br/><br/><a href="${link}">包子动漫</a><br/><a href="${colaLink}">考拉动漫</a>`,
                });
                return;
            } else {
                list.push({
                    title,
                    link,
                    description: `<br/><br/><a href="${link}">点击跳转到站点观看漫画</a>`,
                });
            }
        });

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
        description: $('.comics-detail__desc').text(),
        link: url,
        item: list,
    };
};
