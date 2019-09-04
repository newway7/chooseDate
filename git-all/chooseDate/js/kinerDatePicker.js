
(function (win, doc) {
    var now = new Date();

    var now1 = new Date(now.getFullYear()-1,now.getMonth(),now.getDate())//默认值；
    

    var defaultSetting = {
        startDate: now1,
        endDate: now,
        clickMaskHide: true,//点击半透明区域是否隐藏
        swiperOptions: {//Swiper里面的参数
            direction: 'vertical',
            centeredSlides: true,
            slidesPerView: 5,
            slideToClickedSlide: true
        }
    };

    function createId() {//随机一个id，保证开始和结束时间弹出的选择框不是同一个(#id)
        var id = parseInt(new Date().getTime() + Math.random() * 999999999);
        return "kinerDatePicker_" + id;
    }
//取消，确定，年月日大体框架
    var tpl = '<div class="kinerDatePicker-container">' +
        '      <div class="kdp-mask"></div>' +
        '      <div class="kdp-box">' +
        '        <div class="kdp-header-container">' +
        '          <div class="kdp-cancel-btn">取消</div>' +
        '          <div class="kdp-title"></div>' +
        '          <div class="kdp-ok-btn">    确定</div>' +
        '        </div>' +
        '        <div class="kdp-content-container">' +
        '          <div class="year-container">' +
        '            <div class="year-swiper-container">' +
        '              <div class="swiper-wrapper">' +
        '              </div>' +
        '            </div>' +
        '          </div>' +
        '          <div class="month-container">' +
        '            <div class="month-swiper-container">' +
        '              <div class="swiper-wrapper">' +
        '              </div>' +
        '            </div>' +
        '          </div>' +
        '          <div class="date-container">' +
        '            <div class="date-swiper-container">' +
        '              <div class="swiper-wrapper">' +
        '              </div>' +
        '            </div>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        '    </div>'

    $.fn.kinerDatePicker = function (opts) {
        var opt = $.extend(true, {}, defaultSetting, opts);//在opts中写入时间，覆盖掉defaultSetting中的时间设置；
      

        var defaultVal = opt.endDate;
        var startVal=opt.startDate;
        return $(this).each(function (index, item) {
            // $(item).attr({'readonly': false,"unselectable": "on"}).focus(function () {
            //     $(this).blur()
            $(item).attr({ 'start-val': startVal, "default-val": defaultVal }).focus(function () {
                $(this).blur()
               
            });
            var self = this;


            this.startYear =opt.startDate.slice(0,4);

            this.defaultVal = $(this).attr('default-val');
            this.defaultYear = parseInt(this.defaultVal.split('-')[0]);
            this.defaultMonth = parseInt(this.defaultVal.split('-')[1]);
            this.defaultDate = parseInt(this.defaultVal.split('-')[2]);

            var defaultM = this.defaultMonth;//结束年份的最大月值；
            var defaultD = this.defaultDate;//结束月的最大日期值；
            
            var startM=parseInt(opt.startDate.slice(5,7));
            var startD=parseInt(opt.startDate.slice(8));

           

            this.container = $(tpl);
            this.pid = createId();
            this.container.attr('id', this.pid);//标记id
            $('body').append(this.container);
        
        

            
            if (this.startYear) {
                startYear = this.startYear;
            }
            var endYear = opt.endDate.slice(0,4);
            var year = endYear;
            var yearTpl = '';
            while (year >= startYear) {//只能选择今年和去年；
                yearTpl +=
                    '                <div class="swiper-slide" id="kdp_year_' + year + '">' +
                    '                  <div class="val" data-value="' + year + '">' + year + '</div>' +
                    '                </div>';
                year--;
            }




        $("#"+this.pid+' .year-swiper-container  .swiper-wrapper').append(yearTpl);//将year放入弹窗中。


         

            initMonth(endYear)
            function initMonth(year) {

                if (year == endYear) {//结束年份
                    var monthTpl = '';

                    for (var i = defaultM; i >= 1; i--) {//默认状态下月份最大值；
                        monthTpl +=
                            '                <div class="swiper-slide" id="kdp_month_' + i + '">' +
                            '                  <div class="val" data-value="' + i + '">' + i + '月</div>' +
                            '                </div>';
                    }
                    
                    self.container.find('.month-swiper-container .swiper-wrapper').html(monthTpl);

                } else if (year == startYear) {//开始年份
                    var monthTpl = '';
                    // if (new Date(startYear, startM, 0).getDate() < defaultD + 1) {
                        //这个是endDate为2019年2月28日，设定开始日期为一年前，即2018年3月1日。由于开始年份没有2月。从三月开始。
                    //     startM = defaultM + 1
                    // } else {
                    //     startM = defaultM
                    // }

                    for (var i = 12; i >= startM; i--) {//默认状态下月份最大值；
                        monthTpl +=
                            '                <div class="swiper-slide" id="kdp_month_' + i + '">' +
                            '                  <div class="val" data-value="' + i + '">' + i + '月</div>' +
                            '                </div>';
                    }
                    self.container.find('.month-swiper-container .swiper-wrapper').html(monthTpl);
                }

                
                if (self.monthSwiper) {
                    
                    self.monthSwiper.destroy(true);
                    self.monthSwiper = new Swiper('#' + self.pid + ' .month-swiper-container', $.extend(true, {}, opt.swiperOptions, {
                        initialSlide: 12 - startM,
                        onTouchMove: function (swiper, ev) {
                            ev.preventDefault();

                        },
                        onSlideChangeEnd: function (swiper) {


                            var val = $(swiper.slides[swiper.activeIndex]).find('.val').data('value');
                            self.selectedMonth = fixNum(val);
                            if (self.yearSwiper && self.dateSwiper) {
                                self.selectedYear = $(self.yearSwiper.slides[self.yearSwiper.activeIndex]).find('.val').data('value') + "";

                                initDate(new Date(parseInt(self.selectedYear), parseInt(self.selectedMonth), 0).getDate());

                                self.selectedDate = fixNum($(self.dateSwiper.slides[self.dateSwiper.activeIndex]).find('.val').data('value') + "");
                            
                            }




                        }
                    }));
                }


            }
            function initDate(len) {



                if (self.selectedYear == startYear && self.selectedMonth == startM) {//开始月份
                    var dateTpl = '';
                    for (var i = len; i >= startD; i--) {
                        dateTpl +=
                            '                <div class="swiper-slide" id="kdp_date_' + i + '">' +
                            '                  <div class="val" data-value="' + i + '">' + i + '日</div>' +
                            '                </div>';
                    }
                } else if (self.selectedYear == endYear && self.selectedMonth == defaultM) {//结束月份
                    var dateTpl = '';
                    for (var i = defaultD; i >= 1; i--) {
                        dateTpl +=
                            '                <div class="swiper-slide" id="kdp_date_' + i + '">' +
                            '                  <div class="val" data-value="' + i + '">' + i + '日</div>' +
                            '                </div>';
                    }
                } else {
                    var dateTpl = '';
                    for (var i = len; i >= 1; i--) {
                        dateTpl +=
                            '                <div class="swiper-slide" id="kdp_date_' + i + '">' +
                            '                  <div class="val" data-value="' + i + '">' + i + '日</div>' +
                            '                </div>';
                    }
                }





                self.container.find('.date-swiper-container .swiper-wrapper').html(dateTpl);
                if (self.dateSwiper) {
                    self.dateSwiper.destroy(true);
                    self.dateSwiper = new Swiper('#' + self.pid + ' .date-swiper-container', $.extend(true, {}, opt.swiperOptions, {
                        onTouchMove: function (swiper, ev) {
                            ev.preventDefault();

                        },
                        onSlideChangeEnd: function (swiper) {
                            var val = fixNum($(swiper.slides[swiper.activeIndex]).find('.val').data('value'));
                            self.selectedDate = val;
                            opt.changeHandler && opt.changeHandler([self.selectedYear, self.selectedMonth, self.selectedDate], self);
                        }
                    }));
                }

            }

            initDate(this.defaultDate);//默认状态下的日期最大值；

            function fixNum(num) {
                return num >= 10 ? num + "" : "0" + num;
            }




            // this.selectedYear = this.defaultYear || endYear,this.selectedMonth = fixNum(this.defaultMonth) || '01',this.selectedDate = fixNum(this.defaultDate) || '01';

            if (this.defaultYear) {
                var initIndex1 = $('#kdp_year_' + this.defaultYear).index();
            }
            if (this.defaultMonth) {
                var initIndex2 = $('#kdp_month_' + this.defaultMonth).index();
            }
            if (this.defaultDate) {
                var initIndex3 = $('#kdp_date_' + this.defaultDate).index();
            }





            function hide() {
                $(self.container).find('.kdp-mask').fadeOut();
                $(self.container).find('.kdp-box').animate({
                    bottom: -$(win).height()
                }, function () {
                    $(self.container).css({
                        display: 'none'
                    })//隐藏container
                  
                });
            }

            function show() {
                $(self.container).find('.kdp-mask').fadeIn();
                if (self.yearSwiper) {

                    $(self.container).css({
                        display: 'block'
                    }).find('.kdp-box').animate({
                        bottom: 0
                    });
                } else {
                    $(self.container).css({
                        display: 'block'
                    });//显示container
                    //年滑动时，获取年月日的值
                    self.yearSwiper = new Swiper('#' + self.pid + ' .year-swiper-container', $.extend(true, {}, opt.swiperOptions, {
                        initialSlide: initIndex1,//默认状态
                        onTouchMove: function (swiper, ev) {
                            ev.preventDefault();

                        },

                        onSlideChangeEnd: function (swiper) {
                            var val = $(swiper.slides[swiper.activeIndex]).find('.val').data('value') + "";
                            self.selectedYear = val;

                            if (self.monthSwiper && self.dateSwiper) {

                                self.selectedMonth = fixNum($(self.monthSwiper.slides[self.monthSwiper.activeIndex]).find('.val').data('value') + "");
                                //获取月份值
                                // self.dateSwiper.removeAllSlides();
                                initMonth(self.selectedYear)
                                initDate(new Date(parseInt(val), parseInt(self.selectedMonth), 0).getDate());


                                self.selectedDate = fixNum($(self.dateSwiper.slides[self.dateSwiper.activeIndex]).find('.val').data('value') + "");
                                //获取日期值
                              //  opt.changeHandler && opt.changeHandler([self.selectedYear, self.selectedMonth, self.selectedDate], self);
                            }

                        }
                    }));
                    //月滑动时，获取年月日的值
                    self.monthSwiper = new Swiper('#' + self.pid + ' .month-swiper-container', $.extend(true, {}, opt.swiperOptions, {
                        initialSlide: initIndex2,
                        onTouchMove: function (swiper, ev) {
                            ev.preventDefault();

                        },
                        onSlideChangeEnd: function (swiper) {

                            var val = $(swiper.slides[swiper.activeIndex]).find('.val').data('value');
                            self.selectedMonth = fixNum(val);
                            if (self.yearSwiper && self.dateSwiper) {
                                self.selectedYear = $(self.yearSwiper.slides[self.yearSwiper.activeIndex]).find('.val').data('value') + "";

                                initDate(new Date(parseInt(self.selectedYear), parseInt(self.selectedMonth), 0).getDate());

                                self.selectedDate = fixNum($(self.dateSwiper.slides[self.dateSwiper.activeIndex]).find('.val').data('value') + "");
                                opt.changeHandler && opt.changeHandler([self.selectedYear, self.selectedMonth, self.selectedDate], self);
                            }

                        }
                    }));
                    //日滑动时，获取年月日的值
                    self.dateSwiper = new Swiper('#' + self.pid + ' .date-swiper-container', $.extend(true, {}, opt.swiperOptions, {
                        initialSlide: initIndex3,
                        onTouchMove: function (swiper, ev) {
                            ev.preventDefault();

                        },
                        onSlideChangeEnd: function (swiper) {
                            var val = $(swiper.slides[swiper.activeIndex]).find('.val').data('value');
                            self.selectedDate = fixNum(val);
                            if (self.yearSwiper && self.monthSwiper) {
                                self.selectedYear = $(self.yearSwiper.slides[self.yearSwiper.activeIndex]).find('.val').data('value') + "";
                                self.selectedMonth = fixNum($(self.monthSwiper.slides[self.monthSwiper.activeIndex]).find('.val').data('value') + "");

                                
                            }

                        }
                    }));




                    $(self.container).find('.kdp-box').animate({
                        bottom: 0
                    });
                }

              //  opt.showHandler && opt.showHandler(self);


            }

            $(self).click(function () {//点击input区域 显示
                show();
            });
            
            if (opt.clickMaskHide) {//点击半透明区域隐藏；
                this.container.find('.kdp-mask').click(function () {
                    hide();
                });
            }

            this.container.find('.kdp-cancel-btn').click(function () {//点击取消
                hide();
            
            });
            this.container.find('.kdp-ok-btn').click(function () {//点击确认


                var year = self.selectedYear || endYear, month = self.selectedMonth || fixNum(defaultM), date = self.selectedDate || fixNum(defaultD);
                //var year = self.selectedYear,month = self.selectedMonth,date = self.selectedDate;
                //||后面的值，代表不滑动时，默认的值。
                $(self).val(year + "-" + month + "-" + date).addClass('hasValue');

                hide();
            });


        })
    };


})(window, document);
