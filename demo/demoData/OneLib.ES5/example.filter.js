var test_filter = function(){
    var arr =[1,2,3,4,5],result;
    result=arr.filter(function(item,idx,arr){
        return item%2===0||idx===4
    });

    alert('result is:'+result); //[2,4,5]
}
