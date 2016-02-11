<?php

if ($_SERVER['REQUEST_METHOD'] == "DELETE" and !empty($_GET['file'])) {
    if (file_exists('uploads/' . $_GET['file'])) {
        unlink('uploads/' . $_GET['file']);

    }

    echo json_encode(true);
}
