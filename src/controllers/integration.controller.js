const axios = require('axios');

const searchYoutube = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'YouTube API configuration missing' });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                maxResults: 5,
                q: q,
                type: 'video',
                key: apiKey
            }
        });

        const items = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
            channel: item.snippet.channelTitle
        }));

        res.json(items);
    } catch (error) {
        console.error('YouTube Search Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
};

module.exports = { searchYoutube };
