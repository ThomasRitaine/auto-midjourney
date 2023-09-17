import express from 'express';
import bodyParser from 'body-parser';
import fs from 'node:fs';
import { GenerationRequest } from './types';
import generateAndDownload from './midjourney/generateAndDownload';


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', `${import.meta.dir}/views`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${import.meta.dir}/../public`));
app.use('/images', express.static(`${import.meta.dir}/../image`));


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/generate', async (req, res) => {
    const { prompt, batch, clientName } = req.body;
    const generationRequest: GenerationRequest = {
        prompt,
        batch: parseInt(batch),
        clientName,
    };

    generateAndDownload([generationRequest]);

    res.redirect('/images');
});

app.get('/images', (req, res) => {
    const imageDir = `${import.meta.dir}/../image`;

    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.send('Error reading the image directory.');
        }

        // Filter out non-image files
        const imageFiles = files.filter(file => ['png', 'jpg', 'jpeg', 'gif', 'wepb'].includes(file.split('.').pop()!));

        res.render('images', { images: imageFiles });
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
