var MAX_LENGTH = 30;

function truncateFront(str, isMobile) {
    if (str.length !== 0 && str.match(/[a-zA-Z0-9]$/) && isMobile) {
        str = str + "-";
    }
    if (str.length <= MAX_LENGTH) return str.replaceAll(" ", "&nbsp;");

    var words = str.split(' ');
    var truncated = words.pop();
    var nextWord = words.length > 0 ? words[words.length - 1] : "";

    while (words.length > 0 && (`... ${nextWord} ${truncated}`).length <= MAX_LENGTH) {
        truncated = `${words.pop()} ${truncated}`;
        nextWord = words.length > 0 ? words[words.length - 1] : "";
    }

    return `... ${truncated}`.replaceAll(" ", "&nbsp;");
}

function truncateBack(str, isMobile) {
    if (str.length !== 0 && str.match(/^[a-zA-Z0-9]/) && isMobile) {
        str = "-" + str;
    }
    if (str.length <= MAX_LENGTH) return str.replaceAll(" ", "&nbsp;");

    var words = str.split(' ');
    var truncated = words.shift();
    var nextWord = words.length > 0 ? words[0] : "";

    while (words.length > 0 && (`${truncated} ${nextWord} ...`).length <= MAX_LENGTH) {
        truncated = `${truncated} ${words.shift()}`;
        nextWord = words.length > 0 ? words[0] : "";
    }

    return `${truncated} ...`.replaceAll(" ", "&nbsp;");
}

function matchSubject(subject, content) {
    content = content.split('<br>')[0];
    var match = content.match(new RegExp(`^(.*?)<b>(${subject})</b>(.*?)$`, "i"));
    if (match) return match;
    match = content.match(new RegExp(`^(.*?)<span style=" *font-weight:.+;">(${subject})</span>(.*?)$`, "i"));
    if (match) return match;
    match = content.match(new RegExp(`^(.*?)(${subject})(.*?)$`, "i"));
    if (match) return match;
    return null;
}

function processSubjectInExample(subject, content, isMobile) {
    var match = matchSubject(subject, content)
    if (match) {
        var front = truncateFront(match[1], isMobile);
        var subjectWord = match[2];
        var back = truncateBack(match[3], isMobile);

        return `<span class="before-subject">${front}</span><span class="subject">${subjectWord}</span><span class="after-subject">${back}</span>`;
    }
    return `<span class="subject">${subject}</span>`;
}
