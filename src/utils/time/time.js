const diffHour = function(start,end){
    diff= parseInt((new Date(end) - new Date(start))/(60000*60))
    // console.log(diff);
    return diff
}

module.exports = {
    diffHour
}

