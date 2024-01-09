export const ParseDate = (date) => {
    function padZero(num) {
        return num < 10 ? `0${num}` : num;
    }
    
    const inputDate = new Date(date);
    return `${padZero(inputDate.getDate())}-${padZero(inputDate.getMonth() + 1)}-${inputDate.getFullYear()} ${padZero(inputDate.getHours())}:${padZero(inputDate.getMinutes())}`;
}