import express from 'express';
import bodyParser from 'body-parser';
import fs from 'node:fs';
import { GenerationRequest } from './types';
import generateAndDownload from './midjourney/generateAndDownload';
import { join } from 'node:path';


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', `${import.meta.dir}/views`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${import.meta.dir}/../public`));
app.use('/image', express.static(`${import.meta.dir}/../image`));


app.get('/', (req, res) => {
    res.render('generationForm');
});

app.post('/generate', async (req, res) => {
    const prompts = Array.isArray(req.body.prompt) ? req.body.prompt : [req.body.prompt];
    const batches = Array.isArray(req.body.batch) ? req.body.batch : [req.body.batch];
    const collections = Array.isArray(req.body.collection) ? req.body.collection : [req.body.collection];

    const generationRequests: GenerationRequest[] = prompts.map((prompt: string, index: string | number) => ({
        prompt,
        batch: parseInt(batches[index]),
        collection: collections[index],
    }));

    generateAndDownload(generationRequests);

    // Create the client directories if they don't exist
    collections.forEach((collection: string) => {
        fs.mkdirSync(`image/${collection}`, { recursive: true });
    });

    res.redirect('/collection');
});

app.get('/collection', (req, res) => {
    const imageDir = `${import.meta.dir}/../image`;

    // Get the list of clients (directories in the image folder)
    const collections = fs.readdirSync(imageDir).filter(client => fs.statSync(join(imageDir, client)).isDirectory());

    res.render('collections', { collections });
});

app.get('/collection/:collection', (req, res) => {
    const collection = req.params.collection;
    const clientDir = `${import.meta.dir}/../image/${collection}`;

    fs.readdir(clientDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading the client directory.');
        }

        // Filter out non-image files
        const imageFiles = files.filter(file => ['png', 'jpg', 'jpeg', 'gif', 'wepb'].includes(file.split('.').pop()!));

        res.render('collection', { images: imageFiles, collection });
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
