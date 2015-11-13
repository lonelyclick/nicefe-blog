var exec = require('child_process').exec;
exec("hexo server -c -p 80",function(){
  console.log('hexo server start success')
})
