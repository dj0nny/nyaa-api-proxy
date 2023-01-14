const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const apiCache = require('apicache');

const app = express();
const rssParser = new Parser({
	customFields: {
		item: [
			['nyaa:seeders', 'seeders'],
			['nyaa:leechers', 'leechers'],
			['nyaa:size', 'size'],
			['nyaa:category', 'category'],
		],
	},
});
const cache = apiCache.middleware;

app.use(cors());
app.use(cache('5 minutes'));

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Nyaa proxy server',
	});
});

app.get('/nyaa/feed', async (req, res) => {
	try {
		const feed = await rssParser.parseURL('https://nyaa.si/?page=rss');

		res.status(200).json(feed);
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = app;
