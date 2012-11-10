var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

var keyboard = qwertyHancock('keyboard', 600, 150, 3,
                             'A3', 'white', 'black', '#f3e939');


var context = new webkitAudioContext(),
    nodes = [];




var getNextNote = function() {
    return notes[Math.floor(Math.random()*notes.length)];
};
















var currentNote = getNextNote();
var $noteDisplay = $('#note-display').text(currentNote).data('currentNote', currentNote);var $currentNote = $('#current-note');

keyboard.keyDown(function (note, frequency) {
    var simpleNote = /(\D+)/.exec(note)[0];
    $currentNote.text(simpleNote);
    if (simpleNote !== $noteDisplay.data('currentNote')) {
	return;
    }
    var oscillator = context.createOscillator(),
        gainNode = context.createGainNode();

    oscillator.type = 1;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.3;
    oscillator.connect(gainNode);
    if (typeof oscillator.noteOn !== 'undefined') {
        oscillator.noteOn(0);
    }
    gainNode.connect(context.destination);
    nodes.push(oscillator);
});

keyboard.keyUp(function (note, frequency) {
    $currentNote.text('');
    for (var i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            if (typeof nodes[i].noteOff !== 'undefined') {
                nodes[i].noteOff(0);
            }
            nodes[i].disconnect();
        }
    }
    var simpleNote = /(\D+)/.exec(note)[0];
    if (simpleNote === $noteDisplay.data('currentNote')) {
	currentNote = getNextNote();
	$noteDisplay.text(currentNote).data('currentNote', currentNote);
    }
});