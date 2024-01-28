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
    var match = content.match(new RegExp(`^(.*?)<b>(${subject})([a-zA-Z]*?)</b>(.*?)$`, "i"));
    if (match) return match;
    match = content.match(new RegExp(`^(.*?)<span style=" *font-weight:.+;">(${subject})([a-zA-Z]*?)</span>(.*?)$`, "i"));
    if (match) return match;
    match = content.match(new RegExp(`^(.*?)(${subject})()(.*?)$`, "i"));
    if (match) return match;
    return null;
}

function processSubjectInExample(subject, content, isMobile) {
    var match = matchSubject(subject, content)
    if (match) {
        var front = truncateFront(match[1], isMobile);
        var subjectWord = match[2];
        var back = truncateBack(match[3] + match[4], isMobile);

        return `<span class="before-subject">${front}</span><span class="subject">${subjectWord}</span><span class="after-subject">${back}</span>`;
    }
    return `<span class="subject">${subject}</span>`;
}

const test = require('node:test');
const assert = require('assert')

test('<b> wrapper', (t) => {
    assert.match(processSubjectInExample(
        'contraptions',
        'He turned his parents’ garage into a laboratory, rigged electrical <b>contraptions</b> around the house.',
        false
    ), new RegExp('</span><span class="subject">contraptions</span><span class="after-subject">'));
});

test('<b> partial wrapper', (t) => {
    assert.match(processSubjectInExample(
        'contraption',
        'He turned his parents’ garage into a laboratory, rigged electrical <b>contraptions</b> around the house.',
        false
    ), new RegExp('</span><span class="subject">contraption</span><span class="after-subject">s'));
});

test('<br> splitting', (t) => {
    assert.match(processSubjectInExample(
        'palliative',
        'His advice was to provide <b>palliative</b> care<br><div align="right" style="font-size:12px"><i>It’s Not the How or the What but the Who Succeed by Surrounding Yourself with the Best Claudio Fernández-Aráoz</i>, Claudio Fernández-Aráoz</div>',
        false
    ), new RegExp('</span><span class="subject">palliative</span><span class="after-subject">&nbsp;care</span>'));
});

test('<span> wrapper', (t) => {
    assert.match(processSubjectInExample(
        'splint',
        'The <span style=" font-weight:600;">splint</span> was for ice mountain emergencies...<br><div align="right"><div align="right" style="font-size:12px"><i>Frozen 2: Forest of Shadows</i>, Benko, Kamilla</div></div>',
        false
    ), new RegExp('<span class="before-subject">The&nbsp;</span><span class="subject">splint</span><span class="after-subject">'));
});

test('Omit - before and after "', (t) => {
    assert.match(processSubjectInExample(
        'ephemeral',
        '‘What does “ephemeral” mean?’ <br><div align="right" style="font-size:12px"><i>The Little Prince</i>, de Saint-Exupéry, Antoine</div>',
        true
    ), new RegExp('What&nbsp;does&nbsp;“</span><span class="subject">ephemeral</span><span class="after-subject">”&nbsp;mean?'));
});

test('Start with the subject', (t) => {
    assert.match(processSubjectInExample(
        'pedestrain',
        'Pedestrains must not walk on the center of the road.',
        true
    ), new RegExp('<span class="subject">Pedestrain</span><span class="after-subject">-s'));
});

test('No match', (t) => {
    assert.match(processSubjectInExample(
        'decadent',
        'The empire had for years been falling into decadence.',
        true
    ), new RegExp('<span class="subject">decadent</span>'));
});

