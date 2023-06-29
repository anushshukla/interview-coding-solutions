/*Input dictionary
--
obj = {
    "x" : {"y": 100},
    "some": "whatever",
    "deep": {
        "one": {
            "two": {"three": "this a deeply nested object"}
        }
    }
}


Input string - Output
--
"x" - {"y": 100}
"x.y" - 100
"deep.one.two" - {"three": "this a deeply nested object"}
"x.xyz" - "Path not found"
"deep.one.some_path" - "Path not found"
*/

export default function getDictValByPath<Dict, Output>(dic: Dict, pathStr: string): Output {
    const paths = pathStr.split('.');
    let dictVal = dic;
    for (const path of  paths) {
        dictVal = dictVal[path];
        if (!dictVal) {
            throw new Error('Path not found');
        }
    }
    return dictVal;
}
