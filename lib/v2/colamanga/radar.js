module.exports = {
    'www.colamanga.com': {
        _name: '考拉漫画',
        www: [
            {
                title: '订阅漫画',
                docs: 'https://docs.rsshub.app/multimedia.html#bandcamp-upcoming-live-streams',
                source: '/comic/:id',
                target: '/colamanga/comic/:id',
            },
        ],
    },
};
