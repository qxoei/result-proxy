
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-result', async (req, res) => {
    const { seatNumber } = req.body;
    if (!seatNumber) {
        return res.status(400).json({ error: 'رقم الجلوس مفقود' });
    }

    try {
        const session = axios.create();
        await session.get('https://zst.edu.ly/zahra/');
        const response = await session.post('https://zst.edu.ly/zahra/login.php', new URLSearchParams({
            t1: seatNumber,
            b1: 'عرض النتيجة'
        }));

        const $ = cheerio.load(response.data);
        const resultText = $('body').text().trim();

        res.json({ result: resultText });
    } catch (error) {
        res.status(500).json({ error: 'حدث خطأ أثناء جلب النتيجة.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
