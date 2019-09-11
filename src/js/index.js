var $ = window.Zepto;
var root = window.player;
var audio = root.audioManager;
var len = 0;
var control = null;
var songList = [];
function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        success:function(data){
            binbEvent();
            touchEvent();
            songList = data;
            len = data.length;
            control = new root.control(len);
            // 初始化页面，触发播放歌曲事件
            $('body').trigger('play:change', 0);
        },
        error:function(){
            console.log("error");
        }
    })
}
function binbEvent(){
    $("body").on("play:change",function(e,index){
        //设置歌曲地址
        audio.setSource(songList[index].audio);
        //渲染歌曲
        root.render(songList[index]);
        $(".img-box").removeClass("rotatePlay rotatePause");
        if(audio.status == "play"){
            audio.play();
            $(".img-box").addClass("rotatePlay");
        }
        // 进行渲染时间
        root.progress.renderAllTime(songList[index].duration);
    })
    $(".prev").on("click",function(){
        var i = control.prev();
        changeAudio(i);
    })
    $(".next").on("click",function(){
        var i = control.next();
        changeAudio(i);
    })
    $(".play").on("click",function(){
        if(audio.status == "pause"){
            audio.play();
            // 进度条开始动
            root.progress.start();
            audio.status = "play";
            $(this).addClass("playing");
            $(".img-box").addClass("rotatePlay");
        }else{
            audio.pause();
            // 进度条暂停
            root.progress.stop();
            audio.status = "pause";
            $(this).removeClass("playing");
            $(".img-box").addClass("rotatePause");
        }
        
    })
}

//切歌
function changeAudio(i){
    $("body").trigger("play:change",i);
    // 切歌时，进度条清零
    root.progress.start(0);
    //如果当前歌曲是暂停状态，点击上一首的时候，进度条不动，歌曲暂停
    if(audio.status == "pause"){
        audio.pause();
        root.progress.stop();
    }
}

getData('../mock/data.json');

//拖拽进度条 拖动小圆点 带着进度条运动
function touchEvent(){
    var $spot = $(".scroll-bar");
    var offset = $(".pro-bottom").offset();
    var left = offset.left;
    var width = offset.width;
    $spot.on("touchstart",function(){
        root.progress.stop();
    }).on("touchmove",function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per > 0 && per < 1 ){
            root.progress.update(per)
        }
    }).on("touchend",function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per > 0 && per < 1 ){
            var cutTime = per * songList[control.index].duration;
            $('.play').addClass('playing');
            audio.playTo(cutTime);
            audio.status = 'play';
            audio.play();
            root.progress.start(per);
        }
    })



}

// 渲染歌曲信息
// 点击按钮
// 音频的播放和暂停 切歌
// 进度条运动与拖拽
// 图片旋转
// 歌曲列表切歌