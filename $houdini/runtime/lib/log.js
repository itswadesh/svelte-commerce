// we want to be able to log different colors in the middle of a message.
// this looks something like:
//
// console.log("This message is unformatted, %cbut now it has color!", "color: red")
//
// the entire content needs to be in a single string. each %c refers to the next style in the list
//
// console.log("This message is %cred%c, normal ,%cand then back to blue", "color:red", "", "color:blue")
//
// in order to support the api we want, we will need to wrap the strings in something
// that we can process in order to turn into it into one call to console.log with
// arguments that span around the values left by each color
// $HOUDINI$color$ replaced with "%c" and {color} pushed to the list of colors
// $HOUDINI$       replaced with "%c" and "" pushed to the list of colors (reset)
// NOTE: this format is ignored in node environment so we don't have to worry about a split in the logic
//       we just won't have color on the server
function colorize(message) {
    // get every instance of the tag
    const matches = [...message.matchAll(/\$HOUDINI\$(\w*\$)?/g)];
    // if we dont have any matches, we're done
    if (matches.length === 0) {
        return [message];
    }
    let final = message.replaceAll(/\$HOUDINI\$(\w*\$)?/g, '%c');
    let colors = [];
    // ever match with a color, adds somethign to the list. the others add an empty string (a reset)
    for (const match of matches) {
        const color = match[1] ? `color:${match[1].slice(0, -1)}` : '';
        colors.push(color);
    }
    return [final, ...colors];
}
export function error(message) {
    console.error(...colorize(message));
}
export function info(message) {
    console.log(...colorize(message));
}
export function cyan(message) {
    return wrapMessage('cyan', message);
}
export function red(message) {
    return wrapMessage('red', message);
}
export function yellow(message) {
    return wrapMessage('yellow', message);
}
export function green(message) {
    return wrapMessage('green', message);
}
const tag = `$HOUDINI$`;
const wrapMessage = (color, message) => {
    return tag + `${color}$` + message + tag;
};
