var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];


var keyboard = qwertyHancock('keyboard', 600, 150, 3,
                             'A3', 'white', 'black', 'steelblue');


var drawNotes = function(note, canvas) {
    canvas.width = canvas.width;
    var rawNote = /(\D+)/.exec(note.toLowerCase())[1];
    var scale = /(\d)/.test(note.toLowerCase()) ? /(\d)/.exec(note.toLowerCase())[1]: '3';
    scale = parseInt(scale) + 1;
    var formattedNote = rawNote + '/' + scale;

    canvas.width = canvas.width;
    var renderer = new Vex.Flow.Renderer(canvas,
                                         Vex.Flow.Renderer.Backends.CANVAS);

    var ctx = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, 500);
    stave.addClef("treble").setContext(ctx).draw();

    // Create the notes
    var notes = [
        // A quarter-note C.
        new Vex.Flow.StaveNote({ keys: [formattedNote], duration: "q" }),

        // A quarter-note D.
        new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),
	new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),
	new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" })

    ];

    // Create a voice in 4/4
    var voice = new Vex.Flow.Voice({
        num_beats: 4,
        beat_value: 4,
        resolution: Vex.Flow.RESOLUTION
    });

    // Add notes to voice
    voice.addTickables(notes);

    // Format and justify the notes to 500 pixels
    var formatter = new Vex.Flow.Formatter().
        joinVoices([voice]).format([voice], 500);

    // Render voice
    voice.draw(ctx, stave);

};

var context = new webkitAudioContext(),
    nodes = [];



//var odeToJoy = 'E E F G GFED CCDE EDD EEFG GFED CCDE DCC';
var odeToJoy = 'E E F G G F E D C C D E E D D E E F G G F E D C C D E D C C'.split(' ');
var i = 0;
var getNextNote = function() {
//    return notes[Math.floor(Math.random()*notes.length)];
    if (i > odeToJoy.length) i = 0;
    return odeToJoy[i++];
};

$.each(Object.keys(Base64EncodedNotes), function(i, key) {
    var $audio = $('<audio></audio>').attr('id', 'audio' + key);
    $audio.attr('src', Base64EncodedNotes[key]);
    $('#audios').append($audio);
});


var currentNote = getNextNote();
var $noteDisplay = $('#note-display').text(currentNote).data('currentNote', currentNote);
var $currentNote = $('#current-note');
console.log(currentNote);
drawNotes(currentNote, $('#target')[0]);

keyboard.keyDown(function (note, frequency) {
    var simpleNote = /(\D+)/.exec(note)[0];
    $currentNote.text(simpleNote);
    var soundSelector = '#audio' + simpleNote.replace('#', '\\#');
    var sound = $(soundSelector)[0];
    sound.pause();
    sound.currentTime = 0;
    sound.play();
    $('.fade-able').removeClass('fade');
    drawNotes(note, $('#current-note-canvas')[0]);
    // if (simpleNote !== $noteDisplay.data('currentNote')) {
    //  return;
    // }



    // var oscillator = context.createOscillator(),
    //     gainNode = context.createGainNode();

    // oscillator.type = 1;
    // oscillator.frequency.value = frequency;
    // gainNode.gain.value = 0.3;
    // oscillator.connect(gainNode);
    // if (typeof oscillator.noteOn !== 'undefined') {
    //     oscillator.noteOn(0);
    // }
    // gainNode.connect(context.destination);
    // nodes.push(oscillator);



});

keyboard.keyUp(function (note, frequency) {
    $('.fade-able').addClass('fade');
    // for (var i = 0; i < nodes.length; i++) {
    //     if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
    //         if (typeof nodes[i].noteOff !== 'undefined') {
    //             nodes[i].noteOff(0);
    //         }
    //         nodes[i].disconnect();
    //     }
    // }



    var simpleNote = /(\D+)/.exec(note)[0];
    if (simpleNote === $noteDisplay.data('currentNote')) {
        currentNote = getNextNote();
        $noteDisplay.text(currentNote).data('currentNote', currentNote);
	drawNotes(currentNote, $('#target')[0]);
    }
});



$('#hideNotation').click(function() {
    $('#note-display,#current-note').toggleClass('hide');
});