const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Admin\\Music';
const destDir = 'F:\\web_application\\public\\shop_images';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const videoExts = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.3gp'];
const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

const files = fs.readdirSync(srcDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return imageExts.includes(ext);
});

let copied = 0;
files.forEach((file, idx) => {
    const src = path.join(srcDir, file);
    const ext = path.extname(file).toLowerCase().replace('.jpeg', '.jpg');
    const destName = `product_img_${String(idx + 1).padStart(2, '0')}${ext}`;
    const dest = path.join(destDir, destName);
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file} -> ${destName}`);
    copied++;
});

console.log(`\nTotal copied: ${copied} images to ${destDir}`);
