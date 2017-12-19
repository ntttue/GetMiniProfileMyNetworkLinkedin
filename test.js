function callAPI(input, callback) {
    // giả lập hàm gọi api lên server
    setTimeout(function() {
        callback(input)
    }, 500)
}
/**
 @param input, dữ liệu để gọi API
 @param flag, cờ để định danh
 **/
function useAPI(input, flag) {
    callAPI(input, function(input) {
        console.log(input);
        // Định danh
        console.log('I am: ', flag);
    })
}

function mapping() {
    useAPI(1, 'Nhan');
    useAPI(2, 'Tue');
}