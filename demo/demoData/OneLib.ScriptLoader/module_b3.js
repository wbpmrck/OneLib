//this module should load after b2

var test_b3=1;
if(!test_b2){
    throw 'module b2 not loaded!';
}

