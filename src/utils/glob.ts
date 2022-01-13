import nodeGlob from "glob";

export function glob(pattern: string): Promise<string[]> {
  return new Promise((yay, nah) => {
    nodeGlob(pattern, async (err, files) => {
      if (err) {
        return nah(err);
      }
      yay(files);
    });
  });
}
