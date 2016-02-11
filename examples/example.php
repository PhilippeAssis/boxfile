<?php
function writeFile($file)
{
    $handle = fopen($file, 'r');
    $fileContents = fread($handle, filesize($file));
    fclose($handle);
    echo str_replace('<?php', '', $fileContents);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Example</title>
    <link rel="stylesheet" href="../dist/css/boxfile.css">
    <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/demo.css">
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <form action="upload.php" enctype="multipart/form-data" method="post" data-delete="delete.php">
                <div class="uploadZone">
                    <?php
                    $files = scandir('uploads', 1);

                    if ($files[0] != '.' and $files[0] != '..')
                        $file = 'uploads/' . $files[0];
                    else
                        $file = 'example.jpg';

                    ?>
                    <img src="<?= $file ?>">
                    <input name="file" type="file">
                </div>
            </form>
        </div>
    </div>
    <br>
    <br>
    <br>
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Upload code
                </div>
                <div class="panel-body">
                <pre>
                    <code class="php">
                        <?php writeFile('upload.php') ?>
                    </code>
                </pre>
                </div>
            </div>
        </div>
    </div>

</div>


<script src="bower_components/jquery-dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

<script src="../dist/js/boxfile.js"></script>


<script>
    $('input[type=file]').boxFile()
</script>
</body>
</html>