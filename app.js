const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const template = require('./json/templates.json')

app.use(cors({
  origin : ['http://localhost:5173' , 'https://oscar-print.vercel.app/'],
  credentials : true
}));

const fs = require("fs");
const multer = require("multer");
const PORT = 8000;
app.listen(PORT, () => {
  console.log(
    "Server has started! Open https://canva-editor-api.vercel.app",
    PORT
  );
});
app.use(express.static(__dirname + "/public")); //Serves resources from public folder
app.use(express.static(path.join(__dirname , '/public/images/templates')))

function paginateArrayWithFilter(array, size = 30, index = 0, keyword = "") {
  const startIndex = index * size;
  const endIndex = startIndex + size;
  let filteredArray = array;
  if (keyword && keyword !== "") {
    const lowerCaseKeyword = keyword.toLowerCase();
    filteredArray = array.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(lowerCaseKeyword)
    );
  }

  return filteredArray.slice(startIndex, endIndex);
}

function handleFontStyleName(fontName, style) {
  if (style === "regular") return fontName + " Regular";

  const fontStrong = parseInt(style);
  if (style.includes("italic")) {
    return fontName + (fontStrong ? ` Italic Bold ${fontStrong}` : " Italic");
  }

  if (!fontStrong) return fontName + " Regular";
  return fontName + ` Bold ${fontStrong}`;
}

function searchKeywords(query, data) {
  if (!query) return [];
  const lowerCaseQuery = query.toLowerCase();
  const uniqueKeywords = new Set();

  data.forEach((item) => {
    const lowerCaseDesc = item.desc.toLowerCase();
    const keywords = lowerCaseDesc.split(" ");

    keywords.forEach((keyword) => {
      if (keyword.includes(lowerCaseQuery)) {
        uniqueKeywords.add(keyword);
      }
    });
  });

  return Array.from(uniqueKeywords);
}

/**
 * Get draft fonts
 */
app.get("/api/draft-fonts", async (req, res) => {
  console.log(req.query);
  fs.readFile(
    path.join(__dirname, "./json/draft-fonts.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const filtered = JSON.parse(jsonString).items.map((font) => {
        return {
          family: font.family,
          styles: Object.keys(font.files).map((style) => {
            return {
              name: handleFontStyleName(font.family, style),
              style,
              url: font.files[style],
            };
          }),
        };
      });
      res.send({ data: filtered });
    }
  );
});

/**
 * Get fonts
 */
app.get("/api/fonts", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/fonts.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const { ps, pi, kw } = req.query;
      res.send(
        paginateArrayWithFilter(JSON.parse(jsonString).data, +ps, +pi, kw)
      );
    }
  );
});

/**
 * Search templates
 */
app.get("/api/templates", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/templates.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const { ps, pi, kw } = req.query;
      res.send(
        paginateArrayWithFilter(JSON.parse(jsonString).data, +ps, +pi, kw)
      );
    }
  );
});

/**
 * Search template keywords
 */
app.get("/api/template-suggestion", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/templates.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const rs = searchKeywords(req.query.kw, JSON.parse(jsonString).data);
      res.send(rs.map((kw, idx) => ({ id: idx + 1, name: kw })));
    }
  );
});

/**
 * Search text templates
 */
app.get("/api/texts", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/texts.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const { ps, pi, kw } = req.query;
      res.send(
        paginateArrayWithFilter(JSON.parse(jsonString).data, +ps, +pi, kw)
      );
    }
  );
});

/**
 * Search text keywords
 */
app.get("/api/text-suggestion", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/texts.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const rs = searchKeywords(req.query.kw, JSON.parse(jsonString).data);
      res.send(rs.map((kw, idx) => ({ id: idx + 1, name: kw })));
    }
  );
});

/**
 * Search frames
 */
app.get("/api/frames", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/frames.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const { ps, pi, kw } = req.query;
      res.send(
        paginateArrayWithFilter(JSON.parse(jsonString).data, +ps, +pi, kw)
      );
    }
  );
});

/**
 * Search frame keywords
 */
app.get("/api/frame-suggestion", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/frames.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const rs = searchKeywords(req.query.kw, JSON.parse(jsonString).data);
      res.send(rs.map((kw, idx) => ({ id: idx + 1, name: kw })));
    }
  );
});

/**
 * Search shapes
 */
app.get("/api/shapes", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/shapes.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const { ps, pi, kw } = req.query;
      res.send(
        paginateArrayWithFilter(JSON.parse(jsonString).data, +ps, +pi, kw)
      );
    }
  );
});

/**
 * Search shape keywords
 */
app.get("/api/shape-suggestion", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/shapes.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const rs = searchKeywords(req.query.kw, JSON.parse(jsonString).data);
      res.send(rs.map((kw, idx) => ({ id: idx + 1, name: kw })));
    }
  );
});

/**
 * Search images
 */
app.get("/api/images", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/images.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const { ps, pi, kw } = req.query;
      res.send(
        paginateArrayWithFilter(JSON.parse(jsonString).data, +ps, +pi, kw)
      );
    }
  );
});

/**
 * Search image keywords
 */
app.get("/api/image-suggestion", async (req, res) => {
  fs.readFile(
    path.join(__dirname, "./json/images.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.error(err);
        res.send(null);
        return;
      }
      const rs = searchKeywords(req.query.kw, JSON.parse(jsonString).data);
      res.send(rs.map((kw, idx) => ({ id: idx + 1, name: kw })));
    }
  );
});


const getAllTemplate = async (req , res ) => {
  try{
      if(!template) {
          res.status(404).json({
              success : false,
              message  : "We can't get data from json file"
          })
      }else{
          res.status(200).json({
              success : true,
              message : "We get all template successfully !",
              data : template
          })
      }

  }catch(err){
      res.json({
          success : "false",
          message : "Server error !"
      })
  }
}

app.get("/api/get-templates" , getAllTemplate)
