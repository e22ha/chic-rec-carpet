import * as sharp from 'sharp';

export async function generatePattern(
  shape: string,
  color: string,
  pattern: string
): Promise<string | null> {
  const width = 200;
  const height = 200;

  // Create a new image with a solid background color
  let image = sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  });

  // Draw the pattern on the image
  if (pattern === 'lines') {
    const strokeColor = color === 'monochrome' ? '#000000' : '#ffffff';
    for (let i = 0; i < 10; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = Math.random() * width;
      const y2 = Math.random() * height;
      const line = sharp({
        create: {
          width: Math.hypot(x2 - x1, y2 - y1),
          height: 1,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
        .rotate((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI)
        .flop()
        .flip()
        .toColourspace('srgb')
        .composite([
          {
            input: sharp({
              create: {
                width: 1,
                height: 1,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 },
              },
            })
              .toColourspace('srgb')
              .set({ alpha: 0 }),
            blend: 'dest-over',
          },
          {
            input: sharp({
              create: {
                width: 1,
                height: 1,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 },
              },
            })
              .toColourspace('srgb')
              .set({ rgb: strokeColor }),
            blend: 'source-over',
          },
        ]);
      image = image.composite([{ input: line, left: x1, top: y1 }]);
    }
  } else if (pattern === 'chaos') {
    const fillColor = color === 'monochrome' ? '#000000' : '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2;
      const circle = sharp({
        create: {
          width: radius * 2,
          height: radius * 2,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
        .circle({
          x: radius,
          y: radius,
          radius,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        })
        .toColourspace('srgb')
        .composite([
          {
            input: sharp({
              create: {
                width: radius * 2,
                height: radius * 2,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 },
              },
            })
              .toColourspace('srgb')
              .set({ alpha: 0 }),
            blend: 'dest-over',
          },
          {
            input: sharp({
              create: {
                width: radius * 2,
                height: radius * 2,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 },
              },
            })
              .toColourspace('srgb')
              .set({ rgb: fillColor }),
            blend: 'source-over',
          },
        ]);
      image = image.composite([{ input: circle, left: x - radius, top: y - radius }]);
    }
  }

  // Draw the shape on the image
  if (shape === 'square') {
    const strokeColor = color === 'monochrome' ? '#000000' : '#ffffff';
    const square = sharp({
      create: {
        width: width - 40,
        height: height - 40,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
      .rectangle({
        x: 0,
        y: 0,
        width: width - 40,
        height: height - 40,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .toColourspace('srgb')
      .composite([
        {
          input: sharp({
            create: {
              width: width - 40,
              height: height - 40,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 1 },
            },
          })
            .toColourspace('srgb')
            .set({ alpha: 0 }),
          blend: 'dest-over',
        },
        {
          input: sharp({
            create: {
              width: width - 40,
              height: height - 40,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 1 },
            },
          })
            .toColourspace('srgb')
            .set({ rgb: strokeColor }),
          blend: 'source-over',
        },
      ]);
    image = image.composite([{ input: square, left: 20, top: 20 }]);
  } else if (shape === 'rectangle') {
    const strokeColor = color === 'monochrome' ? '#000000' : '#ffffff';
    const width = Math.floor(Math.random() * (width - 40)) + 20;
    const height = Math.floor(Math.random() * (height - 40)) + 20;
    const rectangle = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      },
    })
      .rectangle({
        x: 0,
        y: 0,
        width,
        height,
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .toColourspace('srgb')
      .composite([
        {
          input: sharp({
            create: {
              width,
              height,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 1 },
            },
          })
            .toColourspace('srgb')
            .set({ alpha: 0 }),
          blend: 'dest-over',
        },
        {
          input: sharp({
            create: {
              width,
              height,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 1 },
            },
          })
            .toColourspace('srgb')
            .set({ rgb: strokeColor }),
          blend: 'source-over',
        },
      ]);
    image = image.composite([{ input: rectangle, left: 20, top: 20 }]);
  }

  // Convert the image to a data URL and return it
  try {
    const dataUrl = `data:image/png;base64,${(await image.toBuffer({ format: 'png' })).toString('base64')}`;
    return dataUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
