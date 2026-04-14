import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const ASSETS_DIR = './src/assets';
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function walk(dir) {
    let results = [];
    const list = await fs.readdir(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(await walk(filePath));
        } else {
            if (filePath.match(/\.(jpg|jpeg|png)$/i)) {
                results.push(filePath);
            }
        }
    }
    return results;
}

async function optimize() {
    console.log('--- Starting Image Optimization ---');
    const files = await walk(ASSETS_DIR);
    console.log(`Found ${files.length} images to check.`);

    let optimizedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
        try {
            const metadata = await sharp(file).metadata();
            
            // Only optimize if width > MAX_WIDTH or it's a "heavy" file
            // (We apply optimization to all to ensure they are compressed consistently)
            const stats = await fs.stat(file);
            const needsResize = metadata.width > MAX_WIDTH;
            
            if (needsResize || stats.size > 500 * 1024) { // > 500KB
                const originalSize = (stats.size / 1024).toFixed(2);
                console.log(`Optimizing: ${file} (${originalSize} KB)`);
                
                const pipeline = sharp(file);
                if (needsResize) {
                    pipeline.resize(MAX_WIDTH);
                }

                if (file.toLowerCase().endsWith('.png')) {
                    await pipeline.png({ quality: QUALITY, compressionLevel: 9 }).toBuffer().then(b => fs.writeFile(file, b));
                } else {
                    await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer().then(b => fs.writeFile(file, b));
                }

                const newStats = await fs.stat(file);
                const newSize = (newStats.size / 1024).toFixed(2);
                console.log(`  Done: ${newSize} KB`);
                optimizedCount++;
            } else {
                skippedCount++;
            }
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }

    console.log('\n--- Optimization Finished ---');
    console.log(`Optimized: ${optimizedCount}`);
    console.log(`Skipped:   ${skippedCount}`);
}

optimize().catch(console.error);
