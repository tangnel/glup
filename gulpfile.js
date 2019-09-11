var gulp = require('gulp');

//压缩html
//gulp中运用插件 1、下载插件 npm install gulp-htmlclean --save-dev
//              2、取到插件 require('gulp-htmlclean')
//              3、应用插件
var htmlClean = require('gulp-htmlclean');

//压缩图片
var imageMin = require('gulp-imagemin');

//压缩js插件
var uglify = require('gulp-uglify');

//去掉js中的调试语句
var stripDebug = require('gulp-strip-debug');

//将less转换成css
var less = require('gulp-less');

//压缩css
var cleanCss = require('gulp-clean-css');

//加前缀   postcss autoprefixer
var postCss = require('gulp-postcss');
var autoPrefixer = require('autoprefixer');

//开启服务器
var connect = require('gulp-connect');

var folder = {
    src:"src/",
    dist:"dist/"
}

//判断当前环境变量 获取环境变量
var devMod = process.env.NODE_ENV !== "production";
//export NODE_ENV=development 设置环境变量
console.log(devMod)

gulp.task('html',function(){
    var page = gulp.src(folder.src+'html/*')
        .pipe(connect.reload());
        if(!devMod){
            page.pipe(htmlClean())
        }
        page.pipe(gulp.dest(folder.dist + 'html/'))
})

gulp.task('js',function(){
    var page = gulp.src(folder.src+'js/*')
        .pipe(connect.reload())
        if(!devMod){
            page.pipe(stripDebug())
            .pipe(uglify())
        }
        
        page.pipe(gulp.dest(folder.dist + 'js/'))
})

gulp.task('css',function(){
    var page = gulp.src(folder.src+'css/*')
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postCss([autoPrefixer()]));
        if(!devMod){
            page.pipe(cleanCss())

        }
        page.pipe(gulp.dest(folder.dist + 'css/'))
})

gulp.task('image',function(){
    gulp.src(folder.src+'images/*')
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + 'images/'))
})

gulp.task("server",function(){
    connect.server({
        port:"8888",
        livereload:true
    });
})

//监听文件变化
gulp.task("watch",function(){
    gulp.watch(folder.src + "html/*",["html"]);
    gulp.watch(folder.src + "css/*",["css"]);
    gulp.watch(folder.src + "js/*",["js"]);

})

gulp.task('default', ['html','js','css','image','server','watch']);