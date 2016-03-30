/**
 * Created by lenovo on 2016/3/10.
 */

$(function(){
    /* ==============================================
     Back To Top Button
     =============================================== */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-top').fadeIn();
        } else {
            $('#back-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-top').click(function () {
        $('#back-top a').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    $('#back-top').tooltip('hide');

    $(window).scroll(function(){
        if ($(this).scrollTop() == 0) {
            $('#section_header').removeClass('small');
        } else {
            $('#section_header').addClass('small');
        }
    });

    //Navigate Scroll
    $('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $(this).parent('li').addClass('active').siblings('li').removeClass('active');
                $('html,body').animate({
                    scrollTop: target.offset().top-50
                }, 500);
                return false;
            }
        }
    });

    /* ----------------------------------------------------------- */
    /*  Main slideshow
     /* ----------------------------------------------------------- */
    $('#slider_part').carousel({
        pause: true,
        interval: 100000
    });

    /* ----------------------------------------------------------- */
    /*ISotope Portfolio
     /* ----------------------------------------------------------- */

    var $container = $('.portfolio-wrap');
    var $filter = $('#isotope-filter');
    // Initialize isotope
    $container.isotope({
        filter: '*',
        layoutMode: 'fitRows',
        animationOptions: {
            duration: 750,
            easing: 'linear'
        }
    });
    // Filter items when filter link is clicked
    $filter.find('a').click(function () {
        var selector = $(this).attr('data-filter');
        $filter.find('a').removeClass('current');
        $(this).addClass('current');
        $container.isotope({
            filter: selector,
            animationOptions: {
                animationDuration: 750,
                easing: 'linear',
                queue: false
            }
        });
        return false;
    });

    // Portfolio Isotope


    var container = $('.portfolio-wrap');

    function splitColumns() {
        var winWidth = $(window).width(),
            columnNumb = 1;


        if (winWidth > 1024) {
            columnNumb = 4;
        } else if (winWidth > 900) {
            columnNumb = 2;
        } else if (winWidth > 479) {
            columnNumb = 2;
        } else if (winWidth < 479) {
            columnNumb = 1;
        }

        return columnNumb;
    }

    function setColumns() {
        var winWidth = $(window).width(),
            columnNumb = splitColumns(),
            postWidth = Math.floor(winWidth / columnNumb);

        container.find('.portfolio-box').each(function () {
            $(this).css( {
                width : postWidth + 'px'
            });
        });
    }

    function setProjects() {
        setColumns();
        container.isotope('reLayout');
    }

    container.imagesLoaded(function () {
        setColumns();
    });

    $(window).bind('resize', function () {
        setProjects();
    }).resize();

    /*$("#owl-demo").owlCarousel({

        navigation : true, // Show next and prev buttons
        // navigationText: ["prev","next"],
        navigationText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ],
        slideSpeed : 300,
        paginationSpeed : 400,
        autoPlay: true,
        items : 4,
        itemsDesktop:[1199,4],
        itemsDesktopSmall:[979,3],  //As above.
        itemsTablet:[768,3],    //As above.
        // itemsTablet:[640,2],
        itemsMobile:[479,1],    //As above
        goToFirst: true,    //Slide to first item if autoPlay reach end
        goToFirstSpeed:1000
    });*/

    // Custom Navigation Events
    var owl = $("#about-carousel");
    owl.owlCarousel({

        navigation : true, // Show next and prev buttons
        slideSpeed : 600,
        pagination:false,
        singleItem:true,
        stopOnHover: true,
        autoPlay: true

    });
    // Custom Navigation Events
    $(".next").click(function(){
        owl.trigger('owl.next');
    })
    $(".prev").click(function(){
        owl.trigger('owl.prev');
    })

    initBaiduShare();
})
function initBaiduShare(){
    window._bd_share_config = {
        common : {
            bdText : '我的个人空间-海阔天空',
            bdDesc : '这是我自己制作的纯前端静态页面的个人主页',
            bdUrl : 'http://lunyong.github.io',
            bdPic : ''
        },
        share : [{
            "bdSize" : 16
        }]
    }
    with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
}
