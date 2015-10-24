var test_forEach = function(){
    var arr =[1,2,3,4,5],sum=0;
    arr.forEach(function(item,idx,arr){
        sum+=item;
    });

    alert('sun is:'+sum);
}
