export function formatDate(date : Date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, '0');
  
    return year+'/'+month+'/'+day
}

export function formatTimeStamp(timestamp : any){
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = date.getDate().toString().padStart(2, '0');

    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString()

    
    if(hour.length == 1){
        hour = '0'+ hour
    }

    if(minute.length == 1){
        minute = '0'+ minute
    }
  
    return year+'/'+month+'/'+day + ' ' + hour+":"+minute
  }
  
  