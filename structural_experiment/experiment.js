/******************************************************
 * Structural Inequality Experiment (jsPsych Version)
 ******************************************************/

const jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

// --- Experiment Info ---
const expInfo = {
  participant: prompt("Enter Participant ID:"),
  session: "001",
  date: new Date().toISOString().slice(0, 10)
};

// --- Initialize Timeline ---
const timeline = [];

// --- Welcome Screen ---
const welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size:26px; text-align:center;">
      <p>Welcome to the experiment!</p>
      <p>In this study, you will be asked to make predictions and respond to prompts.</p>
      <p>Press <b>Space</b> to begin.</p>
    </div>
  `,
  choices: [' ']
};
timeline.push(welcome);

// --- Function to Create a Trial Block (Outcome + Prediction) ---
function createTrial(outcomeValue) {
  const combinedTrial = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
      <div style="font-size:26px; text-align:center; margin-bottom:20px;">
        The outcome is: <span style="color:rgb(255,75,0);">${outcomeValue}</span>
      </div>
      <div style="font-size:22px;">
        What is the <b>ALPHA</b> you predict?<br>
        (Please enter a number below.)
      </div>
    `,
    html: `
      <input name="alphaPrediction" type="number" step="any" required placeholder="Enter a number" style="margin-top:10px;">
    `,
    button_label: "Continue",
    on_finish: function(data) {
      const response = data.response.alphaPrediction;
      jsPsych.data.addProperties({
        outcome: outcomeValue,
        alphaPrediction: response
      });
    }
  };

  timeline.push(combinedTrial);
}

// --- Create Multiple Trials ---
const outcomes = [42, 58, 73]; // you can add more outcomes here
outcomes.forEach(createTrial);

// --- Instruction Routine (with Escape handling) ---
const instructionL = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size:24px; text-align:center;">
      <p>[Insert your instruction text here]</p>
      <p>Press "N" to continue or "Escape" to quit.</p>
    </div>
  `,
  choices: ['n', 'escape'],
  on_finish: function(data) {
    if (data.response === 'escape') {
      jsPsych.endExperiment('Experiment terminated early by user.');
    }
  }
};
timeline.push(instructionL);

// --- Thanks Routine ---
const thanks = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size:24px; text-align:center;">
      <p>Thank you for your participation!</p>
      <p>Press "Enter" to quit.</p>
    </div>
  `,
  choices: ['Enter'],
  on_finish: function() {
    jsPsych.endExperiment();
  }
};
timeline.push(thanks);

// --- Start Experiment ---
jsPsych.run(timeline);
