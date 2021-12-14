let project__folder = require("path").basename(__dirname);
let source__folder = "src";

let fs = require("fs");

let path = {
  build: {
    html: project__folder + "/",
    css: project__folder + "/css/",
    js: project__folder + "/js/",
    img: project__folder + "/img/",
    fonts: project__folder + "/fonts/",
    links: project__folder + "/links/",
  },

  src: {
    html: [source__folder + "/*.html", "!" + source__folder + "/_*.html"],
    css: source__folder + "/scss/style.scss",
    js: source__folder + "/js/script.js",
    img: source__folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source__folder + "/fonts/*.ttf",
    links: source__folder + "/links/*.html",
  },

  watch: {
    html: source__folder + "/**/*.html",
    css: source__folder + "/scss/**/*.scss",
    js: source__folder + "/js/**/*.js",
    img: source__folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    links: source__folder + "/links/*.html",
  },
  clean: "./" + project__folder + "/",
};

let { src, dest, lastRun } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileInclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  clean__css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  fileinclude = require("gulp-file-include"),
  group__media = require("gulp-group-css-media-queries"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin"),
  ttf2woff = require("gulp-ttf2woff"),
  ttf2woff2 = require("gulp-ttf2woff2");

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project__folder + "/",
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
      .pipe(fileInclude())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function links() {
  return src(path.src.links)
  .pipe(dest(path.build.links))
  .pipe(browsersync.stream());
}

function fontsStyle(params) {
  let file_content = fs.readFileSync(source__folder + "/scss/fonts.scss");
  if (file_content == "") {
    fs.writeFile(source__folder + "/scss/fonts.scss", "", cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source__folder + "/scss/fonts.scss",
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

function cb() {}

function callBack() {}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
  gulp.watch([path.watch.html], links);
}

function clean() {
  return del(path.clean);
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: "expanded",
      })
    )
    .pipe(group__media())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 version"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(clean__css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts, links), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.watch = watch;
exports.default = watch;
exports.links = links;
