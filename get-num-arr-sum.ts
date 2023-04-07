export default function add(numArr: number[], index = 0, sum = 0) {
    sum += numArr[index];
    return numArr.length - 1 === index ? sum : add(numArr, index + 1, sum);
}
