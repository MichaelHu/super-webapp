### 3.1 jsx文件动态编译执行

JSX文件的编译，可以在线编译。通过两个方法：

* exec(source, options)
* tranfrom(source, options)

`exec`方法，需要注意执行域，如果希望在调用者的域下执行，可以先`transform`再直接调用`eval`：

    var context;
    var obj = JSX.transfrom(source);
    eval(obj.code);

这种情况下，`context`变量可以在`source`中使用。



### 3.2 React



