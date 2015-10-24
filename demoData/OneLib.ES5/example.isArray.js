var test_isArray = function(){
    var arr =[1,2,3,4,5],num= 3,obj={a:1},date = new Date();

    alert('arr:'+Array.prototype.isArray(arr)); //true
    alert('num:'+Array.prototype.isArray(num)); //false
    alert('obj:'+Array.prototype.isArray(obj)); //false
    alert('date:'+Array.prototype.isArray(date)); //false
}
