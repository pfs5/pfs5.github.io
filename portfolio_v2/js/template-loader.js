var htmlHeader = '<nav id="navigation-bar" class="navbar navbar-fixed-top navbar-custom">\
        <div id="top-padding-bar"></div>\
        <div class="container">\
            <!-- Brand and toggle get grouped for better mobile display -->\
            <div class="navbar-header page-scroll">\
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">\
                    <span class="sr-only">Toggle navigation</span> Menu <i class="fa fa-bars"></i>\
                </button>\
                <a class="navbar-brand" id="navigation-logo" href="#page-top">>_pfs</a>\
            </div>\
\
            <!-- Collect the nav links, forms, and other content for toggling -->\
            <div class="collapse navbar-collapse" id="navigation-tabs">\
                <ul class="nav navbar-nav navbar-right">\
                    <li class="hidden">\
                        <a id="navigation-tab" href="#page-top"></a>\
                    </li>\
                    <li class="page-scroll">\
                        <a id="navigation-tab" href="#portfolio-personal">Portfolio</a>\
                    </li>\
                    <li class="page-scroll">\
                        <a id="navigation-tab" href="#portfolio-team">Team projects</a>\
                    </li>\
                    <li class="page-scroll">\
                        <a id="navigation-tab" href="#about">About me</a>\
                    </li>\
                    <li class="page-scroll">\
                        <a id="navigation-tab" href="#contact">Contact</a>\
                    </li>\
                </ul>\
            </div>\
        </div>\
    </nav>'

var htmlFooter = 'Personal website - Last updated Sept/2017';

document.getElementById('header').innerHTML = htmlHeader;
document.getElementById('footer').innerHTML = htmlFooter;