;
(function () {
  // console.log(location.search);

  // 判断当前是在index.html页面还是goods_details.html页面
  if (location.search) { // goods_details.html页面
    dataUrl = '../res/data/data.json'
  } else { //index.html页面
    dataUrl = './res/data/data.json'
  }

  function Page(url) {
    if (location.search) {
      var urlStr = location.search.replace('?', '');
      // console.log(urlStr);
      var temp = urlStr.split('&')
      console.log(temp);
      var type = temp[0].replace('type=', '');
      var id = temp[1].replace('id=', '');
      console.log(type, id);
      this.loadData(url).then(function (res) {
        //console.log(res);
        var goodsDetails = res.goods[type].des[id];
        console.log(goodsDetails);
        this.goodsInfo(goodsDetails)
        this.zoom(); //调用放大镜函数       
        this.loginRegister();
        this.banner();
        this.nav(res.nav);
        this.categoryNav(res.category);
        //右侧栏QQ客服&回到顶部
        this.addRightBar();
      }.bind(this))
    } else {
      this.loadData(url).then(function (res) {
        //console.log(res);
        this.init(res)
      }.bind(this))
    }

  }

  // 异步获取data.json文件中的数据
  Page.prototype.loadData = function (url) {
    return new Promise(function (success, fail) {
      $.ajax({
        type: 'get',
        url
      }).then(function (res) {
        success(res)
      })
    })
  }

  // 初始化项目
  Page.prototype.init = function (data) {
    //注册&登录
    this.loginRegister();
    //轮播图
    this.banner();
    //导航栏
    this.nav(data.nav);
    //分类
    this.categoryNav(data.category);
    //商品列表
    this.goodsList(data.goods);
    //左侧快速定位条
    this.addLeftBar(data.goods);
    //右侧栏QQ客服&回到顶部
    this.addRightBar();
  }

  var loginView = null; // 设置变量用于存放对话框DOM

  function loginRegisterAction(event) {
    event.preventDefault(); // 阻止a标签的默认形为
    // loginView = null 
    if (!loginView) { // 如果对话框没有显示出来
      var type = event.target.dataset.type;
      // console.log(type, event);
      loginView = new pageTools.Login(type == 'login', 'body', function () {
        loginView = null;
      })
    }
  }

  // 注册登录
  Page.prototype.loginRegister = function () {
    $('.login').click(loginRegisterAction);
    $('.register').click(loginRegisterAction);
  }

  // 轮播图
  Page.prototype.banner = function () {
    new Swiper('.swiper-container', {
      loop: true, // 循环模式选项
      // 自动播放
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: true
      },
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    })
  }

  // 导航栏实例化处理
  Page.prototype.nav = function (navList) {
    new pageTools.Nav('.nav_container', navList, function (text) {
      console.log(text);
    })
  }

  // 分类导航
  Page.prototype.categoryNav = function (category) {
    new pageTools.Category('.category-nav', category, function (res) {
      console.log(res);
    })
  }

  // 实例化商品类
  Page.prototype.goodsList = function (goods) {
    new pageTools.Goods('.main-container', goods, function () {
      console.log('goods');
    })
  }

  // 商品详情
  Page.prototype.goodsInfo = function (data) {
    $('.goods-img').css('background-image', 'url(' + data.image + ')')
    $('.title').html(data.title)
    $('.price').html(data.price)
  }

  // 放大镜
  Page.prototype.zoom = function () {
    new pageTools.Zoom('.goods-img')
  }

  //左侧栏快速定位
  Page.prototype.addLeftBar = function (classic) {
    var leftbar = $('<ul class="left-bar"></ul>');
    console.log(classic);
    $(document.body).append(leftbar)
    classic.forEach((item)=>{
      var clsLi = $('<li><a href="#'+item.id+'">'+ item.title +'</a></li>')//页内跳转
      leftbar.append(clsLi)
    })
  }

  //右侧栏QQ客服&回到顶部
  Page.prototype.addRightBar = function(){
    var rightbar = $('<ul class="right-bar"></ul>');
    var data = ['客服','回到顶部'];

    data.forEach((item)=>{
      if(item === '客服'){
        rightbar.append($('<li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2943223781&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:2943223781:52" alt="请问您需要什么帮助？" title="请问您需要什么帮助？"/></a></li>'))
      }else{
        var toTop = $('<li><a href="">'+ item +'</a></li>')
        //回到顶部
        toTop.click((e)=>{
          e.preventDefault();
          $('html,body').animate({
            scrollTop:0
          },3000)
        })
        rightbar.append(toTop)
      }
    })
    $(document.body).append(rightbar)
  }
  // 主函数
  function main() {
    new Page(dataUrl)
  }

  main();
})();