<?php
    $query = "caracteristica(X,theria), caracteristica(X,eutheria), caracteristica(X,venenoso), write(X), nl, fail.";
    
    $lastLine = exec('swipl -s prolog.pl -g "'.$query.'" -t halt.', $output, $returnValue);


    $i = 0;
    foreach ($output as $line) {

        echo $i."-". $line.'<br>';
        $i += 1;
    }
     
    if($returnValue == 0) echo 'true';
    elseif($returnValue == 1) echo 'false';
    elseif($returnValue == 2) echo 'error';
?>