const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class FileService {
  save(file) {
    try {
      console.log(file)
      const fileName = `${uuidv4()}.jpg`;
      const currentDir = __dirname;
      const staticDir = path.join(currentDir, 'static');
      const filePath = path.join(staticDir, fileName);

      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      file.mv(filePath, (err) => {
        if (err) {
          throw new Error("Error saving file");
        }
      });

      return fileName;
    } catch (error) {
      throw new Error("Error saving file");
    }
  }
}

module.exports = new FileService();
