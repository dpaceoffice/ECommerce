import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

class resize {
    constructor(folder) {
        this.folder = folder;
    }
    async save(buffer) {
        const filename = resize.filename();
        const filepath = this.filepath(filename);

        await sharp(buffer)
            .resize(315, 315, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filepath);

        return filename;
    }
    static filename() {
        return `${uuidv4()}.png`;
    }
    filepath(filename) {
        return path.resolve(`${this.folder}/${filename}`)
    }
}
export default resize;