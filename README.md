# Huang-blog-admin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

###bug 待修复
```angular2html
1.菜单栏首页仪表盘title与其他菜单不对齐 2022.04.10 (2022-04-26修复 动态生成菜单变成为模版渲染)
2.路由模式设置成history后面包屑路由跳转失效，更改为hash后路由跳转正常但url异常(2022-04-10)
3.文章发布文章标题增加rules后依然无法显示*提示(2022-04-20)
4.新建文章ctrl+s保存异常(2022-04-24修复 取消对应异步await请求)
5.文章编辑 图片上传待处理(2022-05-05已完成)
6.邮件发送 富文本编辑H1样式丢失(2022-05-06修复 父组件元素样式影响，自定义H1字体大小2em)
7.分类,标签修改 名称与列表绑定(2022-05-10 修复 tag暂时不做更改)
8.日记修改页面 editor不能回显内容(2022-05-07) 组件中赋值只能是html内容，不能是纯文本内容
9.全局footer排版修改(2022-05-10 已删除 )
10.表单校验时需要将label绑定上prop属性，否则校验失败(2022-11-17)
```

