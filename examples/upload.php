<?php
if (isset($_FILES['file'])) {

    if ($_FILES["file"]["error"] == UPLOAD_ERR_OK) {
        move_uploaded_file($_FILES["file"]["tmp_name"], 'uploads/' . basename($_FILES['file']['name']));
        echo json_encode($_FILES['file']);
    }
    else
        echo json_encode(false);
}