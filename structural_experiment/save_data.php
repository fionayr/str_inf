<?php
// Get JSON data from jsPsych
$post_data = json_decode(file_get_contents('php://input'), true);

// Get file name and data
$filename = $post_data['filename'];
$filedata = $post_data['filedata'];

// Define folder to save data
$save_path = "data/";  // make sure this folder exists and is writable

// Save the data
if (!file_exists($save_path)) {
    mkdir($save_path, 0777, true);
}

$file = fopen($save_path . $filename, 'w');
fwrite($file, $filedata);
fclose($file);

echo "Data saved as " . $filename;
?>
