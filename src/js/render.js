(function($,root){
    // 图片渲染
    function renderImg(src){
        var img = new Image();
        img.src = src;
        img.onload = function(){
            $(".img-box img").attr("src",src);
            root.blurImg(img,$('body'))
        }
    }
    // 歌曲信息
    function songInfo(data){
        var str = '<div class="song-name">'+data.song+'</div>\
        <div class="singer-name">'+data.singer+'</div>\
        <div class="album-name">'+data.album+'</div>';
        $(".song-info").html(str);
    }

    function isLike(data){
        if(data.isLike){
            $(".like").addClass("liking")
        }else{
            $(".like").removeClass("liking")
        }
    }


    root.render = function(data){
        renderImg(data.image);
        songInfo(data);
        isLike(data);
    };

}(window.Zepto,window.player || (window.player={})))