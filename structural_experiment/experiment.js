/******************************************************
 * Structural Inequality Experiment (jsPsych Version)
 ******************************************************/

// Initialize jsPsych
const jsPsych = initJsPsych({
  on_finish: function() {
    // Convert all data to JSON
    const data = jsPsych.data.get().json();

    // Send it to the server
    fetch('save_data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: `data_${expInfo.participant}_${expInfo.date}.json`,
        filedata: data
      })
    })
    .then(response => response.text())
    .then(result => {
      console.log('✅ Data saved successfully:', result);
    })
    .catch(error => {
      console.error('❌ Error saving data:', error);
      alert('There was a problem saving your data.');
    });
  }
});


// Experiment info
const expInfo = {
  participant: prompt("Enter Participant ID:"),
  session: "001",
  date: new Date().toISOString().slice(0, 10)
};

// Apply global styling
document.body.style.backgroundColor = "black";
document.body.style.color = "white";
document.body.style.fontFamily = "'Open Sans', sans-serif";

// Create timeline
const timeline = [];

// WELCOME SCREEN
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

// INSTRUCTIONS
const instructions = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div style="font-size:24px; text-align:center;">
      <p>Read the instructions carefully before you begin.</p>
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
timeline.push(instructions);

// LOAD TRIALS FROM CSV
Papa.parse("conditionFile/learning_trials.csv", {
  download: true,
  header: true,
  complete: function(results) {
    console.log("CSV loaded successfully:", results.data);

    // Use loaded CSV rows, or fallback if empty
    const trials = results.data.length > 0 ? results.data : [
      { outcome: 0, alpha: 5, beta: 5, image: "default.png" },
      { outcome: 1, alpha: 3, beta: 7, image: "default.png" }
    ];

    // Loop through each row of trials
    trials.forEach((row, index) => {
      // Fixation cross
      timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<div style="font-size:48px; color:white; text-align:center;">+</div>`,
        choices: "NO_KEYS",
        trial_duration: 1000
      });

      // Learning trial
      timeline.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
          <div style="color:white; font-size:24px; display:flex; justify-content:center; align-items:center; height:80vh; gap:80px;">
            <!-- Left: Image -->
            <div style="flex:0 0 300px; text-align:center;">
              <img src="${row.image}" width="250" height="375" style="border-radius:15px; box-shadow:0 0 10px rgba(255,255,255,0.3);">
            </div>

            <!-- Right: Text & Input -->
            <div style="flex:0 0 400px; text-align:left;">
              <p>The alpha is: <span style="color:rgb(255,75,0); font-weight:bold;">${row.alpha}</span></p>
              <p>The beta is: <span style="color:rgb(255,75,0); font-weight:bold;">${row.beta}</span></p>

              <div style="margin-top:40px; text-align:center;">
                <p style="font-size:22px;">What is the <b>OUTCOME</b> you predict?</p>
                <p>(Please enter a number and press <b>Enter</b> to continue.)</p>
                <input id="outcomeInput_${index}" type="number" required 
                      style="font-size:22px; width:200px; text-align:center; margin-top:15px; border-radius:8px; padding:5px;">
              </div>
            </div>
          </div>
        `,
        choices: "NO_KEYS",
        on_load: function() {
          const input = document.getElementById(`outcomeInput_${index}`);
          input.focus();
          const handleKey = (e) => {
            if (e.key === "Enter" && input.value !== "") {
              jsPsych.finishTrial({
                outcome: row.outcome,
                alpha: Number(row.alpha),
                beta: Number(row.beta),
                prediction: Number(input.value),
                image: row.image
              });
              document.removeEventListener("keydown", handleKey);
            }
          };
          document.addEventListener("keydown", handleKey);
        }
      });
    });

    // THANK YOU SCREEN (after all trials)
    timeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <div style="font-size:24px; text-align:center;">
          <p>Thank you for your participation!</p>
          <p>Press "Enter" to quit.</p>
        </div>
      `,
      choices: ['enter'],
      on_finish: function() {
        jsPsych.endExperiment();
      }
    });

    // Run experiment only after CSV is ready
    jsPsych.run(timeline);
  },
  error: function(err) {
    console.error("CSV failed to load:", err);
    alert("Failed to load trial CSV! Check file path and name.");
  }
});
