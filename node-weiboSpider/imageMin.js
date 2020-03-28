const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
//  

    // (async () => {
    //     try {
    //     const files = await imagemin(['weiboSpider/weibo/**/*.{jpg,png}'], {
    //         destination: 'build/images',
    //         plugins: [
    //             imageminJpegtran(),
    //             imageminPngquant({
    //                 quality: [0.6, 0.8]
    //             })
    //         ]
    //     });
    
    //     console.log(files);
    //     //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
    // } catch (error) {
    //     console.log(error);
    // }

    // })();  
    module.exports = {
      async  Compress (path){
        try {
            const imagePath=path+".png"
        const files = await imagemin([imagePath], {
            destination: imagePath.split("/").slice(0,3).join("/")+"/min",
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });
    
        console.log(files);
        //=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
    } catch (error) {
        console.log(error);
    }
        }
    }

