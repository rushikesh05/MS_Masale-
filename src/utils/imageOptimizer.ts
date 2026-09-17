/**
 * Fast Client-Side Image Compression & Optimization Utility
 * Automatically resizes large camera photos (e.g. 5-15MB) to optimal e-commerce dimensions
 * (max 1000px, 85% WebP/JPEG), reducing file size by 95%+ down to ~60-120KB.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  sizeKb: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Maintain aspect ratio while scaling within maxWidth x maxHeight
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas 2D context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer WebP for high efficiency and smaller payload; fallback to JPEG
      let format = 'image/webp';
      let dataUrl = canvas.toDataURL(format, quality);
      if (!dataUrl.startsWith('data:image/webp')) {
        format = 'image/jpeg';
        dataUrl = canvas.toDataURL(format, quality);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              dataUrl,
              blob,
              width,
              height,
              sizeKb: Math.round(blob.size / 1024),
            });
          } else {
            const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
            resolve({
              dataUrl,
              blob: new Blob([], { type: format }),
              width,
              height,
              sizeKb,
            });
          }
        },
        format,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for optimization'));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads compressed image to the server API
 * Returns clean static URL like `/uploads/prod_1726581923.webp`
 * Falls back to optimized base64 dataUrl if offline or server is unavailable
 */
export async function uploadImageToServer(
  dataUrlOrFile: string | File,
  filename?: string
): Promise<{ url: string; isRemote: boolean; sizeKb?: number }> {
  try {
    let dataUrl: string;
    let name = filename || 'product-image.webp';
    let sizeKb = 0;

    if (dataUrlOrFile instanceof File) {
      name = dataUrlOrFile.name;
      const compressed = await compressImage(dataUrlOrFile);
      dataUrl = compressed.dataUrl;
      sizeKb = compressed.sizeKb;
    } else {
      dataUrl = dataUrlOrFile;
      sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
    }

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: dataUrl,
        filename: name,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return { url: data.url, isRemote: true, sizeKb };
      }
    }

    // Fallback: return optimized dataUrl
    return { url: dataUrl, isRemote: false, sizeKb };
  } catch (err) {
    console.warn('Direct server upload fallback to optimized data URL:', err);
    if (typeof dataUrlOrFile === 'string') {
      return { url: dataUrlOrFile, isRemote: false };
    }
    const compressed = await compressImage(dataUrlOrFile);
    return { url: compressed.dataUrl, isRemote: false, sizeKb: compressed.sizeKb };
  }
}

/**
 * Removes studio white/light background from product photo in browser canvas,
 * returning a transparent PNG data URL.
 */
export async function removeBackgroundClient(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imgData;

        // Check corners
        const corners = [
          0,
          (width - 1) * 4,
          ((height - 1) * width) * 4,
          ((height - 1) * width + (width - 1)) * 4
        ];
        let bgR = 0, bgG = 0, bgB = 0;
        corners.forEach(idx => {
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });
        bgR /= 4; bgG /= 4; bgB /= 4;

        if (bgR > 190 && bgG > 190 && bgB > 190) {
          const visited = new Uint8Array(width * height);
          const queue: number[] = [];

          for (let x = 0; x < width; x++) {
            queue.push(x, 0);
            queue.push(x, height - 1);
            visited[x] = 1;
            visited[(height - 1) * width + x] = 1;
          }
          for (let y = 0; y < height; y++) {
            queue.push(0, y);
            queue.push(width - 1, y);
            visited[y * width] = 1;
            visited[y * width + (width - 1)] = 1;
          }

          let head = 0;
          while (head < queue.length) {
            const cx = queue[head++];
            const cy = queue[head++];

            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1]
            ];

            for (let i = 0; i < 4; i++) {
              const nx = neighbors[i][0];
              const ny = neighbors[i][1];
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nIdx = ny * width + nx;
                if (!visited[nIdx]) {
                  const pIdx = nIdx * 4;
                  const r = data[pIdx];
                  const g = data[pIdx + 1];
                  const b = data[pIdx + 2];
                  const diff = Math.max(r, g, b) - Math.min(r, g, b);
                  if ((r >= 190 && g >= 190 && b >= 190 && diff < 45) || (r >= 225 && g >= 225 && b >= 225)) {
                    visited[nIdx] = 1;
                    queue.push(nx, ny);
                  }
                }
              }
            }
          }

          for (let i = 0; i < width * height; i++) {
            if (visited[i]) {
              data[i * 4 + 3] = 0;
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(imageSrc);
        }
      } catch {
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}
