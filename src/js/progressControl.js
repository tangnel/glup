(function($,root){
    var dur; // 歌曲总时长
    var lastPer = 0; //最近的一次播放歌曲的所占的百分比
    var startTime; //开始播放歌曲的时间
    var frameId;    //响应动画帧id
    //渲染总时间
    function renderAllTime(time){
        dur = time;
        time = formate(time);
        $(".all-time").html(time);
    }

    //格式化时间
    function formate(time){
        time = Math.round(time);
        var m = Math.floor(time / 60);
        var s = time % 60;
        m = ("0" + m).slice(-2); 
        s = ("0" + s).slice(-2); 
        return m+":"+s;
    }

    // 进度条开始记录时间
    function start(per){
        lastPer = per == undefined ? lastPer : per;
        startTime = new Date().getTime();
        cancelAnimationFrame(frameId);        
        function frame(){
            //获取当前时间
            var nowTime = new Date().getTime();
            
            // 计算经过时间是总时间得百分比  利用百分比控制左侧经过时间显示及进度条位置
            var per = lastPer + (nowTime - startTime) / (dur * 1000);
            if(per <= 1){
                update(per);
            }else{
                cancelAnimationFrame(frameId)
            }

            frameId = requestAnimationFrame(frame)
        }
        frame();
    }

    // 更新歌曲进度
    function update(per){
        //歌曲已播放时间更新
        var curTime = formate(per * dur);
        $('.cur-time').html(curTime);

        //进度条位置更新
        var perX = (per-1) *100 + "%";
        $(".pro-top").css({transform:"translateX("+ perX +")"})
    }

    // 歌曲停止
    function stop(){
        cancelAnimationFrame(frameId);
        // 记录一下停止时间
        var stopTime = new Date().getTime();
        // 更新最新的歌曲播放进度
        lastPer = lastPer + (stopTime - startTime) / (dur * 1000);
    }


    root.progress = {
        renderAllTime: renderAllTime,
        start: start,
        update: update,
        stop: stop
    }
}(window.Zepto, (window.player || {}) ))