$(function() {
  const $registerBox = $('#registerBox');
  const $loginBox = $('#loginBox');
  const $userInfo = $('#userInfo');
  // 切换到注册页面
  $loginBox.find('a').bind('click', function() {
    $registerBox.show();
    $loginBox.hide();
  });

  // 切换到登录页面
  $registerBox.find('a').bind('click', function() {
    $registerBox.hide();
    $loginBox.show();
  });

  // 注册
  $registerBox.find('button').on('click', ()=> {
    const username = $registerBox.find('[name="username"]').val();
    const password = $registerBox.find('[name="password"]').val();
    const repassword = $registerBox.find('[name="repassword"]').val();
    if (username === '') {
      alert('请输入用户名');
      return;
    }
    if (password === '') {
      alert('请输入密码');
      return;
    }
    if (repassword === '') {
      alert('请输入确认密码');
      return;
    }
    if (repassword !== password) {
      alert('两次密码不一致');
      return;
    }
    $.ajax({
      url: '/api/user/register',
      type: 'post',
      data: {
        username,
        password
      },
      dataType: 'json',
      success(res) {
        if (!res.code) {
          setTimeout(()=> {
            $loginBox.show();
            $registerBox.hide();
          }, 1000);
        }
      }
    });
  });
  
  // 登录
  $loginBox.find('button').on('click', ()=> {
    const username = $loginBox.find('[name="username"]').val();
    const password = $loginBox.find('[name="password"]').val();
    if (username === '') {
      alert('请输入用户名');
      return;
    }
    if (password === '') {
      alert('请输入密码');
      return;
    }
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username,
        password
      },
      dataType: 'json',
      success(res) {
        if (!res.code) {
         /* setTimeout(()=> {
            $loginBox.hide();
            $userInfo.show();
            $userInfo.find('.username').html(res.userInfo.username);
            $userInfo.find('.info').html('你好，欢迎光临我的博客！');
          }, 1000);*/
         window.location.reload();
        } else {
          alert(res.message);
        }
      }
    })
  });
  
  // 退出
  $('.logout').on('click',()=> {
    $.ajax({
      url: '/api/user/logout',
      success(res) {
        if (!res.code) {
          window.location.reload();
        }
      }
    })
  })
});
