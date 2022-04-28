import moment from "moment";

const DateTimeComparator = (prevValue: Date, cellValue: string) => {
    let leftValue = moment(prevValue).format("YYYY-MM-DD");
    let rightValue = moment(cellValue,"YYYY-MM-DD").format("YYYY-MM-DD");
    if( rightValue < leftValue){
        return -1;
    }else if( rightValue > leftValue ){
        return 1;
    }else{
        return 0;
    }
}

export {
    DateTimeComparator,
}