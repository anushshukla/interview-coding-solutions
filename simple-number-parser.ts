const BASIC_NUM_ASCII = {
    48: 0,
    49: 1,
    50: 2,
    51: 3,
    52: 4,
    53: 5,
    54: 6,
    55: 7,
    56: 8,
    57: 9,
}

export default function convertToNumber(input: string): number | NaN {

    if (typeof input === 'number') {
            return input;
    }

    if (typeof input !== 'string') {
            return NaN;
    }

    let len = input.length - 1;
    let output = 0;
    let isNegative = false;
    let index = 0;
    for (const char of input) {
        if (char === '-' && index === 0) {
            isNegative = true;
            index++;
            continue;
        }
        const charCode = char.charCodeAt();
        const num = BASIC_NUM_ASCII[charCode];
        if (typeof num === 'undefined') {
            break;
        }
        
        output += num * 10 ** (len - index);
        index++;
    }

    if (isNegative) {
        output *= -1;
    }
    
    return output;
}

