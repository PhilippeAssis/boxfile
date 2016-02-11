<?php
$files = scandir('uploads', 1);

if ($files[0] != '.' and $files[0] != '..')
    $file = 'uploads/' . $files[0];
else
    $file = 'example.jpg';


$handle = fopen($file, 'r');
$fileContents = fread($handle, filesize($file));
fclose($handle);

$filename = basename($files[0]);
$file_extension = strtolower(substr(strrchr($filename, "."), 1));


switch ($file_extension) {
    case "gif":
        $ctype = "image/gif";
        break;
    case "png":
        $ctype = "image/png";
        break;
    case "jpeg":
    case "jpg":
        $ctype = "image/jpeg";
        break;
    default:
}

header('Content-type: ' . $ctype);

echo $fileContents;