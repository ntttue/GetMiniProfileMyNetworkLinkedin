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

async function getDataAsync() {
    var result = [];
    var a = await getLinkedInConnections(csrfToken, 0, 40);
    result.push(a);
    var b = await getLinkedInConnections(csrfToken, 40, 40);
    result.push(b);
    return result;
}
getDataAsync().then(result=>{console.log(result)});


/*
call ntn, binh thuong thi la dung .then(function(response) {} )
ma dung promise cua ES6 ah
angular example     ZDocService.prototype.getTemplate = function(tempId) {
    var self = this;
    var result = self.$http.get('template/' +tempId).then(function(response){
        return response.data;
    })
    return result;
}*/
