/******************************************************
 * Structural Inequality Experiment (jsPsych Version)
 * Converted from PsychoPy code
 ******************************************************/

// --- Experiment Info ---
const expInfo = {
  participant: prompt("Enter Participant ID:"),
  session: "001",
  date: new Date().toISOString().slice(0, 10)
};

// --- Initialize Timeline ---
const timeline = [];

// --- Outcome Text ---
const outcomeText = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-family:'Open Sans'; color:white; font-size:28px; position:absolute; top:30%; left:13%;">
      The outcome is:
      <span id="yData" style="color:rgb(255,75,0); margin-left:20px;"></span>
    </div>
  `,
  choices: "NO_KEYS",
  trial_duration: 1000 // show for 1 second
};

// --- Inference Text (Prompt) ---
const inferenceTrial = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: `
        <div style="font-family:'Open Sans'; color:white; font-size:22px;">
          What is the <b>ALPHA</b> you predict?<br>
          (Please put a number in the textbox;<br>
          Press "return" key to continue;<br>
          Do NOT edit after entering "return".)
        </div>
      `,
      placeholder: "[Type here]",
      name: "alphaPrediction",
      required: true
    }
  ],
  button_label: "Continue"
};

// --- Continue Prompt (Equivalent to inferStop) ---
const continueTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-family:'Open Sans'; color:white; font-size:24px;">
      Press <b>Return</b> to continue.
    </div>
  `,
  choices: ["Enter"]
};

// --- Add Trials to Timeline ---
timeline.push(outcomeText);
timeline.push(inferenceTrial);
timeline.push(continueTrial);

// --- Start Experiment ---
jsPsych.run(timeline);
