const test = require('node:test');
const assert = require('assert')

test('<b> wrapper', (t) => {
    assert.match(processSubjectInExample(
        'contraptions',
        'He turned his parents’ garage into a laboratory, rigged electrical <b>contraptions</b> around the house.',
        false
    ), new RegExp('</span><span class="subject">contraptions</span><span class="after-subject">'));
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

