import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const imageJobs = [
  { source: 'img/logo.png', name: 'logo', widths: [96, 224, 448] },
  { source: 'img/phil.jpg', name: 'phil', widths: [280, 560] },
  { source: 'img/storefront.jpg', name: 'storefront', widths: [340, 680] },
  { source: 'img/work-dagger-panther.jpg', name: 'work-dagger-panther', widths: [320, 640] },
  { source: 'img/work-om.jpg', name: 'work-om', widths: [320, 640] }
];

export async function generateImages(outputDirectory = path.join(root, 'img', 'derived')) {
  await mkdir(outputDirectory, { recursive: true });

  for (const job of imageJobs) {
    const sourcePath = path.join(root, job.source);
    const sourceMetadata = await sharp(sourcePath).metadata();
    if (!sourceMetadata.width || !sourceMetadata.height) {
      throw new Error(`Cannot determine source dimensions for ${job.source}`);
    }

    for (const width of job.widths) {
      if (width > sourceMetadata.width) {
        throw new Error(`Refusing to upscale ${job.source} from ${sourceMetadata.width}px to ${width}px`);
      }

      const resized = sharp(sourcePath).rotate().resize({
        width,
        withoutEnlargement: true
      });
      const avifPath = path.join(outputDirectory, `${job.name}-${width}.avif`);
      const webpPath = path.join(outputDirectory, `${job.name}-${width}.webp`);

      await resized.clone().avif({ effort: 6, quality: 55 }).toFile(avifPath);
      await resized.clone().webp({ effort: 5, quality: 78 }).toFile(webpPath);

      for (const outputPath of [avifPath, webpPath]) {
        const metadata = await sharp(outputPath).metadata();
        if (metadata.exif || metadata.xmp || metadata.iptc) {
          throw new Error(`Generated derivative retained private metadata: ${path.relative(root, outputPath)}`);
        }
      }
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await generateImages();
  console.log('Responsive AVIF/WebP derivatives generated without upscaling or EXIF/GPS metadata.');
}
